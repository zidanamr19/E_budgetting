const express = require("express")
const router = express.Router();
const database = require("../config/database")

// Endpoint untuk posting data pengajuan dana
router.post("/", async (req, res) => {
    const { id_detail_program_kerja, status, tanggal_pengajuan } = req.body;
  
    try {
      // Ambil data plotting dana dari tb_detail_program_kerja
      const detailProgramKerja = await database("tb_detail_program_kerja")
        .select("nama_kegiatan","ploting_dana")
        .where("id_detail_program_kerja", id_detail_program_kerja)
        .first();
  
      if (!detailProgramKerja) {
        return res.status(404).json({
          status: 0,
          message: "Detail program kerja tidak ditemukan",
        });
      }
      const nama_kegiatan = detailProgramKerja.nama_kegiatan;
      const total_dana = detailProgramKerja.ploting_dana;
  
      // Simpan data pengajuan
      const pengajuan = await database("tb_pengajuan_dana").insert({
        id_detail_program_kerja: id_detail_program_kerja,
        nama_kegiatan: nama_kegiatan,
        tanggal_pengajuan: tanggal_pengajuan,
        total_dana: total_dana,
        status: status,
      });
  
      // Simpan data ke tabel tb_detail_pengajuan (multi-insert)
      const inputDetailPengajuan = {
        id_pengajuan_dana: pengajuan[0],
        id_detail_program_kerja: id_detail_program_kerja,
        nominal: total_dana,
        status: status , // Gunakan status "a" untuk status "m" pada detail pengajuan
      };
      await database("tb_detail_pengajuan").insert(inputDetailPengajuan);
  
      return res.status(201).json({
        status: 1,
        message: "Pengajuan dana berhasil disimpan",
        result: {
          id_pengajuan: pengajuan[0],
          id_detail_program_kerja: id_detail_program_kerja,
          nama_kegiatan: nama_kegiatan,
          tanggal_pengajuan: tanggal_pengajuan,
          total_dana: total_dana,
          status: status,
          detail_pengajuan: inputDetailPengajuan,
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