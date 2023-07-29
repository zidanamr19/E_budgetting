const express = require("express");
const router = express.Router();
const database = require("../config/database");

router.post("/simpan", async (req, res) => {
    const { id_rkat, id_unit_kerja, nama_program_kerja, penjab, waktu_pelaksanaan, ploting_dana } = req.body;
    const status = "a";
    
    try {
      // Simpan data ke tabel tb_program kerja
      const inputPROKER = {
        id_rkat: id_rkat,
        id_unit_kerja: id_unit_kerja,
        nama_program_kerja: nama_program_kerja,
        penjab : penjab,
        waktu_pelaksanaan : waktu_pelaksanaan,
        ploting_dana: ploting_dana,
        status: status,
        create_date: new Date(),
        update_date: new Date(),
      };
      const [idPROKER] = await database("tb_program_kerja").insert(inputPROKER);
  
      return res.status(201).json({
        status: 1,
        message: "Berhasil",
        result: {
          id_program_kerja: idPROKER,
          ...inputPROKER,
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