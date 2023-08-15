const express = require("express")
const router = express.Router();
const database = require("../config/database")

// Endpoint untuk posting data pengajuan dana
router.post("/", async (req, res) => {
  const requestData = req.body;

  try {
    const results = [];

    for (const data of requestData) {
      const { id_detail_program_kerja, status, tanggal_pengajuan } = data;

      // Ambil data plotting dana dari tb_detail_program_kerja
      const detailProgramKerja = await database("tb_detail_program_kerja")
        .select("nama_kegiatan", "ploting_dana")
        .where("id_detail_program_kerja", id_detail_program_kerja)
        .first();

      if (!detailProgramKerja) {
        results.push({
          id_detail_program_kerja: id_detail_program_kerja,
          status: 0,
          message: "Detail program kerja tidak ditemukan",
        });
        continue; // Lanjut ke data berikutnya jika detail tidak ditemukan
      }

      const nama_kegiatan = detailProgramKerja.nama_kegiatan;
      const total_dana = detailProgramKerja.ploting_dana;

      // Simpan data pengajuan
      const pengajuan = await database("tb_pengajuan_dana").insert({
        id_detail_program_kerja: id_detail_program_kerja,
        nama_kegiatan: nama_kegiatan,
        tanggal_pengajuan: tanggal_pengajuan, // Gunakan tanggal_pengajuan dari permintaan POST
        total_dana: total_dana,
        status: status,
      });

      // Simpan data ke tabel tb_detail_pengajuan (multi-insert)
      const inputDetailPengajuan = {
        id_pengajuan_dana: pengajuan[0],
        id_detail_program_kerja: id_detail_program_kerja,
        nominal: total_dana,
        status: status, // Gunakan status "a" untuk status "m" pada detail pengajuan
      };
      await database("tb_detail_pengajuan").insert(inputDetailPengajuan);

      results.push({
        id_detail_program_kerja: id_detail_program_kerja,
        status: 1,
        message: "Pengajuan dana berhasil disimpan",
        result: {
          id_pengajuan: pengajuan[0],
          id_detail_program_kerja: id_detail_program_kerja,
          nama_kegiatan: nama_kegiatan,
          tanggal_pengajuan: tanggal_pengajuan, // Gunakan tanggal_pengajuan dari permintaan POST
          total_dana: total_dana,
          status: status,
          detail_pengajuan: inputDetailPengajuan,
        },
      });
    }

    return res.status(201).json({
      status: 1,
      message: "Proses pengajuan dana selesai",
      results: results,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});


module.exports = router