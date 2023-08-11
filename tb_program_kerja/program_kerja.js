const express = require("express");
const router = express.Router();
const database = require("../config/database");


router.get("/list", async(req,res) => {
  try {
      const result = await database.select("tb_program_kerja.id_program_kerja", "tb_program_kerja.nama_program_kerja")
      .from('tb_program_kerja')
      if(result.length > 0){
          return res.status(200).json({
              status :1,
              message : "Berhasil",
              result : result
          })
      }else{
         return res.status(400).json({
             status : 0,
             message : "Gagal",
        })
      }   
  } catch (error) {
      return res.status(500).json({
          status : 0,
          message : error.message
      })
  }
})


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


  router.get('/rkat/:id_rkat', async (req, res) => {
    const { id_rkat } = req.params;
  
    try {
      // Langkah 1: Mendapatkan ID Program Kerja berdasarkan ID RKAT dari tb_program_kerja
      const idProgramKerjaResult = await database('tb_program_kerja')
        .select('id_program_kerja')
        .where('id_rkat', id_rkat)
        .first();
  
      if (!idProgramKerjaResult) {
        return res.status(404).json({
          status: 0,
          message: 'Program kerja tidak ditemukan',
        });
      }
  
      const idProgramKerja = idProgramKerjaResult.id_program_kerja;
  
      // Langkah 2: Mendapatkan daftar nama program kerja
      const programKerjaList = await database('tb_program_kerja')
        .select('id_rkat','id_program_kerja','nama_program_kerja')
        .where('id_program_kerja', idProgramKerja);
  
      // Langkah 3: Mendapatkan kegiatan berdasarkan ID Program Kerja
      const kegiatan = await database('tb_detail_program_kerja')
        .select('id_detail_program_kerja','nama_kegiatan', 'waktu_pelaksanaan', 'ploting_dana')
        .where('id_program_kerja', idProgramKerja);
  
      return res.status(200).json({
        status: 1,
        message: 'Data ditemukan',
        programKerja: programKerjaList,
        kegiatan: kegiatan,
      });
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.message,
      });
    }
  });
  
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Ambil data kegiatan dari database berdasarkan id_program_kerja dengan LEFT JOIN
      const kegiatan = await database('tb_detail_program_kerja')
        .select('id_program_kerja','nama_kegiatan', 'waktu_pelaksanaan', 'ploting_dana')
        .leftJoin('tb_rkat', 'tb_detail_program_kerja.id_program_kerja', '=', 'tb_rkat.id_renstra')
        .where('tb_detail_program_kerja.id_program_kerja', id);
  
      if (kegiatan.length > 0) {
        return res.status(200).json({
          status: 1,
          message: 'Data ditemukan',
          kegiatan: kegiatan,
        });
      } else {
        return res.status(404).json({
          status: 0,
          message: 'Data tidak ditemukan',
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
  
      // Simpan data kegiatan ke dalam array
      const kegiatanArray = data.detail_program_kerja || [];
  
      const inputdetailProkerArray = [];
      for (const kegiatan of kegiatanArray) {
        const detailProker = {
          id_program_kerja: idPROKER,
          nama_kegiatan: kegiatan.nama_kegiatan,
          waktu_pelaksanaan: new Date(kegiatan.waktu_pelaksanaan),
          ploting_dana: kegiatan.ploting_dana,
          status: kegiatan.status,
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