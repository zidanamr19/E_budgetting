const express = require("express");
const router = express.Router();
const database = require("../config/database");
const { data } = require("../tb_program_kerja/validasi_data");

router.post("/sebaran-renstra", async (req, res) => {
  const { id_renstra, id_unit_kerja, baseline } = req.body;

  try {
    // Cek apakah Renstra dengan id_renstra yang diberikan ada dalam database
    const existingRenstra = await database("tb_renstra").where("id_renstra", id_renstra).first();
    if (!existingRenstra) {
      return res.status(404).json({
        status: 0,
        message: "Renstra tidak ditemukan",
      });
    }

    // Ambil data Bidang Renstra yang dipilih
    const bidangRenstra = await database("tb_bidang_renstra")
      .where("id_bidang_renstra", existingRenstra.id_bidang_renstra)
      .first();

    // Ambil program Renstra berdasarkan bidang Renstra yang dipilih
    const programRenstra = await database("tb_renstra")
      .select("program")
      .where("id_bidang_renstra", existingRenstra.id_bidang_renstra)
      .groupBy("program");

    // Simpan data Sebaran Renstra
    const inputSebaranRenstra = {
      id_renstra: id_renstra,
      id_unit_kerja: id_unit_kerja,
      baseline: baseline,
    };

    const [idSebaranRenstra] = await database("tb_sebaran_renstra").insert(inputSebaranRenstra);

    // Ambil data tahun capaian renstra yang terkait dengan renstra yang dipilih
    const tahunCapaianRenstra = await database("tb_tahun_capaian_renstra")
      .select("tahun")
      .where("id_renstra", existingRenstra.id_renstra);

    // Buat array objek untuk multi-insert ke tabel tb_detail_sebaran_renstra
    const detailSebaranRenstra = await Promise.all(
      tahunCapaianRenstra.map(async (tahun) => {
        const capaianRenstra = await database("tb_tahun_capaian_renstra")
          .select("jumlah")
          .where("id_renstra", existingRenstra.id_renstra)
          .where("tahun", tahun.tahun)
          .first();

        return {
          id_sebaran_renstra: idSebaranRenstra,
          tahun: tahun.tahun,
          jumlah: capaianRenstra.jumlah,
        };
      })
    );

    // Simpan data ke tabel tb_detail_sebaran_renstra
    await database("tb_detail_sebaran_renstra").insert(detailSebaranRenstra);

    return res.status(200).json({
      status: 1,
      message: "Berhasil",
      result: {
        bidang_renstra: bidangRenstra,
        program_renstra: programRenstra,
        sebaran_renstra: inputSebaranRenstra,
        detail_sebaran_renstra: detailSebaranRenstra,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});

  
  
  

module.exports = router