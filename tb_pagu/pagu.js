const express = require("express");
const router = express.Router();
const database = require("../config/database")


router.post("/", async (req, res) => {
    const { id_unit_kerja, tahun, jumlah, status } = req.body;
  
    try {
      // Simpan data ke tabel tb_pagu
      const inputPAGU = {
        id_unit_kerja: id_unit_kerja,
        tahun: tahun,
       jumlah : jumlah,
        status: status,
        create_date: new Date(),
        update_date: new Date(),
      };
      const [idPAGU] = await database("tb_rkat").insert(inputPAGU);
  
      return res.status(201).json({
        status: 1,
        message: "Berhasil",
        result: {
          id_pagu: idPAGU,
          ...inputPAGU,
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