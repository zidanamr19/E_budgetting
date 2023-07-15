const express = require("express");
const router = express.Router();
const database = require("../config/database");


router.get("/", async (req, res) => {
  try {
    const result = await database("tb_sebaran_renstra")
      .distinct("tb_unit_kerja.nama_unit_kerja", "tb_bidang_renstra.nama_bidang")
      .leftJoin("tb_unit_kerja", "tb_sebaran_renstra.id_unit_kerja", "tb_unit_kerja.id_unit_kerja")
      .leftJoin("tb_bidang_renstra", function() {
        this.on("tb_sebaran_renstra.id_renstra", "=", "tb_bidang_renstra.nama_bidang");
      })
      .whereIn("tb_sebaran_renstra.id_renstra", function() {
        this.select("id_renstra")
          .from("tb_renstra")
          .whereRaw("tb_renstra.id_renstra = tb_sebaran_renstra.id_renstra");
      });

    if (result.length > 0) {
      return res.status(200).json({
        status: 1,
        message: "Berhasil",
        result: result,
      });
    } else {
      return res.status(400).json({
        status: 0,
        message: "Data tidak ditemukan",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});




router.post("/multi/insert", async (req, res) => {
  const data = req.body;

  try {
    const inputSebaranRenstra = {
      id_renstra: data.id_renstra,
      id_unit_kerja: data.id_unit_kerja,
      baseline: data.baseline,
      create_date: new Date(),
      update_date: new Date(),
    };

    // Simpan data ke tabel tb_renstra
    const [idSebaranRenstra] = await database("tb_sebaran_renstra").insert(inputSebaranRenstra);

    // Simpan data ke tabel tb_sasaran_renstra
    const inputDetailSebaran = {
      id_sebaran_renstra: idSebaranRenstra,
      tahun: data.tahun,
      jumlah: data.jumlah,
    };

    return res.status(201).json({
      status: 1,
      message: "Berhasil",
      result: {
        renstra: {
          id_sebaran_renstra: idSebaranRenstra,
          ...inputSebaranRenstra,
        },
        detail_sebaran: inputDetailSebaran,
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