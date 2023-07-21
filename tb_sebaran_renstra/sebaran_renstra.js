const express = require("express");
const router = express.Router();
const database = require("../config/database");


router.get("/", async (req, res) => {
  try {
    const result = await database("tb_sebaran_renstra")
      .select("tb_unit_kerja.nama_unit_kerja", "tb_detail_sebaran_renstra.tahun")
      .leftJoin("tb_unit_kerja", "tb_sebaran_renstra.id_unit_kerja", "tb_unit_kerja.id_unit_kerja")
      .leftJoin("tb_detail_sebaran_renstra", "tb_sebaran_renstra.id_sebaran_renstra", "tb_detail_sebaran_renstra.id_sebaran_renstra")
      .groupBy("tb_unit_kerja.nama_unit_kerja", "tb_detail_sebaran_renstra.tahun");

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

    // Simpan data ke tabel tb_sebaran_renstra
    const [idSebaranRenstra] = await database("tb_sebaran_renstra").insert(inputSebaranRenstra);

    const inputDetailSebaran = {
      id_sebaran_renstra: idSebaranRenstra,
      tahun: data.tahun,
      jumlah: data.jumlah,
    };

    return res.status(201).json({
      status: 1,
      message: "Berhasil",
      result: {
        sebaran_renstra: {
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