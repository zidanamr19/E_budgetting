const express = require("express");
const router = express.Router();
const database = require("../config/database")



router.get("/", async (req, res) => {
  try {
    const rkatData = await database("tb_rkat")
      .select("tb_rkat.*", "tb_renstra.program")
      .leftJoin("tb_renstra", "tb_rkat.id_renstra", "tb_renstra.id_renstra");

    if (rkatData.length > 0) {
      return res.status(200).json({
        status: 1,
        message: "Data RKAT ditemukan",
        rkat_data: rkatData,
      });
    } else {
      return res.status(404).json({
        status: 0,
        message: "Data RKAT tidak ditemukan",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});





router.post("/simpan", async (req, res) => {
  const { id_renstra, tahun, baseline, status, id_unit_kerja, jumlah } = req.body;

  try {
    // Simpan data ke tabel tb_rkat
    const inputRKAT = {
      id_renstra: id_renstra,
      tahun: tahun,
      baseline: baseline,
      status: status,
      create_date: new Date(),
      update_date: new Date(),
    };
    const [idRKAT] = await database("tb_rkat").insert(inputRKAT);

    // Simpan data id_unit_kerja dan jumlah ke dalam tabel tb_rkat
    for (let i = 0; i < id_unit_kerja.length; i++) {
      await database("tb_rkat").insert({
        id_renstra: id_renstra,
      tahun: tahun,
      baseline: baseline,
      status: status,
      create_date: new Date(),
      update_date: new Date(),
        id_unit_kerja: id_unit_kerja[i],
        jumlah: jumlah[i],
      });
    }

    return res.status(201).json({
      status: 1,
      message: "Berhasil",
      result: {
        id_rkat: idRKAT,
        ...inputRKAT,
        id_unit_kerja: id_unit_kerja,
        jumlah: jumlah,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});



  module.exports = router;