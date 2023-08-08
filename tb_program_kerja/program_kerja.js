const express = require("express");
const router = express.Router();
const database = require("../config/database");


router.get("/", async (req, res) => {
    try {
      const prokerData = await database("tb_program_kerja")
        .select(
          "tb_program_kerja.*",
          "tb_rkat.tahun",
          "tb_detail_program_kerja.nama_kegiatan"
        )
        .leftJoin("tb_rkat", "tb_program_kerja.id_rkat", "tb_rkat.id_rkat")
        .leftJoin(
          "tb_detail_program_kerja",
          "tb_program_kerja.id_program_kerja",
          "tb_detail_program_kerja.id_program_kerja"
        );
  
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

  router.post("/simpan", async (req, res) => {
    const data = req.body;
    
    try {
      // Simpan data ke tabel tb_program_kerja
      const inputPROKER = {
        id_rkat: data.id_rkat,
        id_unit_kerja: data.id_unit_kerja,
        nama_program_kerja: data.nama_program_kerja,
        penjab: data.penjab,
        status: data.status,
        create_date: new Date(),
        update_date: new Date(),
      };
      const [idPROKER] = await database("tb_program_kerja").insert(inputPROKER);

      // Simpan data ke tabel tb_detail_program_kerja dalam bentuk array
      const namaKegiatanArray = data.nama_kegiatan;
      const waktuPelaksanaanArray = data.waktu_pelaksanaan_array;
      const plotingDanaArray = data.ploting_dana_array;

      const inputdetailProkerArray = [];
      for (let i = 0; i < namaKegiatanArray.length; i++) {
        const detailProker = {
          id_program_kerja: idPROKER,
          nama_kegiatan: namaKegiatanArray[i],
          waktu_pelaksanaan: new Date(waktuPelaksanaanArray[i]),
          ploting_dana: plotingDanaArray[i],
          status: data.status,
        };
        inputdetailProkerArray.push(detailProker);
        await database("tb_detail_program_kerja").insert(detailProker);
      }
  
      return res.status(201).json({
        status: 1,
        message: "Berhasil",
        result: {
          id_program_kerja: idPROKER,
          ...inputPROKER,
        },
        detail_program_kerja: inputdetailProkerArray,
      });
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.message,
      });
    }
});

  

 
 module.exports = router