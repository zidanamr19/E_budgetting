const express = require("express");
const router = express.Router();
const database = require("../config/database")


router.post("/simpan", async (req, res) => {
    const { id_renstra, id_unit_kerja, tahun, baseline, status } = req.body;
  
    try {
      // Simpan data ke tabel tb_rkat
      const inputRKAT = {
        id_renstra: id_renstra,
        id_unit_kerja: id_unit_kerja,
        tahun: tahun,
        baseline : baseline,
        status: status,
        create_date: new Date(),
        update_date: new Date(),
      };
      const [idRKAT] = await database("tb_rkat").insert(inputRKAT);
  
      return res.status(201).json({
        status: 1,
        message: "Berhasil",
        result: {
          id_rkat: idRKAT,
          ...inputRKAT,
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