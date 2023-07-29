const express = require("express");
const router = express.Router();
const database = require("../config/database");


router.get("/", async (req, res) => {
    try {
      const prokerData = await database("tb_program_kerja")
        .select("tb_program_kerja.*", "tb_rkat.tahun")
        .leftJoin("tb_rkat", "tb_program_kerja.id_rkat", "tb_rkat.id_rkat");
  
      if (prokerData.length > 0) {
        return res.status(200).json({
          status: 1,
          message: "Data proker ditemukan",
          proker_data: prokerData,
        });
      } else {
        return res.status(404).json({
          status: 0,
          message: "Data proker tidak ditemukan",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.message,
      });
    }
  });

// Pastikan Anda telah menginisialisasi objek database dengan koneksi ke database menggunakan Knex

router.post("/simpan", async (req, res) => {
    const { id_rkat, id_unit_kerja, nama_program_kerja, penjab, waktu_pelaksanaan, ploting_dana } = req.body;
    const status = "a";
    
    try {
      // Simpan data ke tabel tb_program_kerja
      const inputPROKER = {
        id_rkat: id_rkat,
        id_unit_kerja: id_unit_kerja,
        nama_program_kerja: nama_program_kerja,
        penjab: penjab,
        waktu_pelaksanaan: new Date(waktu_pelaksanaan), // Ubah string tanggal menjadi objek Date
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