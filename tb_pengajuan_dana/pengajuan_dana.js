const express = require("express")
const router = express.Router();
const database = require("../config/database")
const upload = require('./multer');

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
        continue;
      }
      const nama_kegiatan = detailProgramKerja.nama_kegiatan;
      const total_dana = detailProgramKerja.ploting_dana;
      // Simpan data pengajuan
      const pengajuan = await database("tb_pengajuan_dana").insert({
        id_detail_program_kerja: id_detail_program_kerja,
        nama_kegiatan: nama_kegiatan,
        tanggal_pengajuan: tanggal_pengajuan,
        total_dana: total_dana,
        status: "m",
      });
      await database("tb_detail_program_kerja")
        .where("id_detail_program_kerja", id_detail_program_kerja)
        .update({
          status: "t",
        });
      // Simpan data ke tabel tb_detail_pengajuan (multi-insert)
      const inputDetailPengajuan = {
        id_pengajuan_dana: pengajuan[0],
        id_detail_program_kerja: id_detail_program_kerja,
        nominal: total_dana,
        status: "a", // Gunakan status "a" untuk status "m" pada detail pengajuan
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


// router.post("/", async (req, res) => {
//   const requestData = req.body;

//   try {
//     const results = [];

//     for (const data of requestData) {
//       const { id_detail_program_kerja, status, tanggal_pengajuan } = data;

//       // Ambil data plotting dana dari tb_detail_program_kerja
//       const detailProgramKerja = await database("tb_detail_program_kerja")
//         .select("nama_kegiatan", "ploting_dana", "id_program_kerja")
//         .where("id_detail_program_kerja", id_detail_program_kerja)
//         .first();

//       if (!detailProgramKerja) {
//         results.push({
//           id_detail_program_kerja: id_detail_program_kerja,
//           status: 0,
//           message: "Detail program kerja tidak ditemukan",
//         });
//         continue; // Lanjut ke data berikutnya jika detail tidak ditemukan
//       }

//       const { nama_kegiatan, ploting_dana, id_program_kerja } = detailProgramKerja;

//       // Ambil id_unit_kerja dari tb_program_kerja berdasarkan id_program_kerja
//       const programKerja = await database("tb_program_kerja")
//         .select("id_unit_kerja")
//         .where("id_program_kerja", id_program_kerja)
//         .first();

//       if (!programKerja) {
//         results.push({
//           id_detail_program_kerja: id_detail_program_kerja,
//           status: 0,
//           message: "Program kerja tidak ditemukan",
//         });
//         continue; // Lanjut ke data berikutnya jika program kerja tidak ditemukan
//       }

//       const id_unit_kerja = programKerja.id_unit_kerja;

//       // Simpan data pengajuan
//       const pengajuan = await database("tb_pengajuan_dana").insert({
//         id_detail_program_kerja: id_detail_program_kerja,
//         nama_kegiatan: nama_kegiatan,
//         tanggal_pengajuan: tanggal_pengajuan, // Gunakan tanggal_pengajuan dari permintaan POST
//         total_dana: ploting_dana,
//         status: "m",
//         id_unit_kerja: id_unit_kerja, // Simpan id_unit_kerja di sini
//       });

//       // Simpan data ke tabel tb_history_pengajuan
//       await database("tb_history_pengajuan").insert({
//         id_pengajuan_dana: pengajuan[0],
//         id_unit_kerja: id_unit_kerja, // Simpan id_unit_kerja di sini
//       });

//       // Setelah pengajuan sukses, ubah status nama kegiatan menjadi "t" (tidak aktif)
//       await database("tb_detail_program_kerja")
//         .where("id_detail_program_kerja", id_detail_program_kerja)
//         .update({
//           status: "t",
//         });

//       // Simpan data ke tabel tb_detail_pengajuan (multi-insert)
//       const inputDetailPengajuan = {
//         id_pengajuan_dana: pengajuan[0],
//         id_detail_program_kerja: id_detail_program_kerja,
//         nominal: ploting_dana,
//         status: "a", // Gunakan status "a" untuk status "m" pada detail pengajuan
//       };
//       await database("tb_detail_pengajuan").insert(inputDetailPengajuan);

//       results.push({
//         id_detail_program_kerja: id_detail_program_kerja,
//         status: 1,
//         message: "Pengajuan dana berhasil disimpan",
//         result: {
//           id_pengajuan: pengajuan[0],
//           id_detail_program_kerja: id_detail_program_kerja,
//           nama_kegiatan: nama_kegiatan,
//           tanggal_pengajuan: tanggal_pengajuan, // Gunakan tanggal_pengajuan dari permintaan POST
//           total_dana: ploting_dana,
//           status: status,
//           detail_pengajuan: inputDetailPengajuan,
//           id_unit_kerja: id_unit_kerja, // Sisipkan id_unit_kerja
//         },
//       });
//     }

//     return res.status(201).json({
//       status: 1,
//       message: "Proses pengajuan dana selesai",
//       results: results,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 0,
//       message: error.message,
//     });
//   }
// });


router.get('/pengajuan/:id_detail_program_kerja', async (req, res) => {
  const { id_detail_program_kerja } = req.params;

  try {
    // Mengambil data id_detail_program_kerja dan nama_kegiatan dari tb_pengajuan_dana berdasarkan id_pengajuan
const detailProgramKerja = await database('tb_pengajuan_dana as pd')
.select('pd.id_pengajuan_dana', 'pd.id_detail_program_kerja')
.leftJoin('tb_detail_program_kerja', 'pd.id_detail_program_kerja', '=', 'tb_detail_program_kerja.id_detail_program_kerja')
.where('tb_detail_program_kerja.id_detail_program_kerja', id_detail_program_kerja);

    if (detailProgramKerja.length > 0) {
      return res.status(200).json({
        status: 1,
        message: 'Data ditemukan',
        detail_program_kerja: detailProgramKerja,
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



// Endpoint untuk mengambil semua data pengajuan dana
router.get('/', async (req, res) => {
  try {
    const semuaPengajuan = await database('tb_pengajuan_dana')
      .select('id_pengajuan_dana', 'id_detail_program_kerja', 'nama_kegiatan', 'tanggal_pengajuan', 'total_dana', 'status');
    if (semuaPengajuan.length > 0) {
      return res.status(200).json({
        status: 1,
        message: 'Data semua pengajuan dana ditemukan',
        pengajuan: semuaPengajuan,
      });
    } else {
      return res.status(404).json({
        status: 0,
        message: 'Data pengajuan dana tidak ditemukan',
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});


// router.get('/pengajuan/:id_detail_program_kerja', async (req, res) => {
//   const { id_detail_program_kerja } = req.params;

//   try {
//     // Mengambil data id_pengajuan_dana dari tb_pengajuan_dana
//     const pengajuan = await database('tb_pengajuan_dana')
//       .select('id_pengajuan_dana')
//       .where('id_detail_program_kerja', id_detail_program_kerja);

//     if (pengajuan.length > 0) {
//       return res.status(200).json({
//         status: 1,
//         message: 'Data ditemukan',
//         pengajuan: pengajuan,
//       });
//     } else {
//       return res.status(404).json({
//         status: 0,
//         message: 'Data tidak ditemukan',
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status: 0,
//       message: error.message,
//     });
//   }
// });



// router.post("/", async (req, res) => {
//   const requestData = req.body;

//   try {
//     const results = [];

//     for (const data of requestData) {
//       const { id_detail_program_kerja, status, tanggal_pengajuan } = data;

//       // Ambil data plotting dana dari tb_detail_program_kerja
//       const detailProgramKerja = await database("tb_detail_program_kerja")
//         .select("nama_kegiatan", "ploting_dana")
//         .where("id_detail_program_kerja", id_detail_program_kerja)
//         .first();

//       if (!detailProgramKerja) {
//         results.push({
//           id_detail_program_kerja: id_detail_program_kerja,
//           status: 0,
//           message: "Detail program kerja tidak ditemukan",
//         });
//         continue; // Lanjut ke data berikutnya jika detail tidak ditemukan
//       }

//       const nama_kegiatan = detailProgramKerja.nama_kegiatan;
//       const total_dana = detailProgramKerja.ploting_dana;

//       // Simpan data pengajuan
//       const pengajuan = await database("tb_pengajuan_dana").insert({
//         id_detail_program_kerja: id_detail_program_kerja,
//         nama_kegiatan: nama_kegiatan,
//         tanggal_pengajuan: tanggal_pengajuan, // Gunakan tanggal_pengajuan dari permintaan POST
//         total_dana: total_dana,
//         status: status,
//       });

//       // Simpan data ke tabel tb_detail_pengajuan (multi-insert)
//       const inputDetailPengajuan = {
//         id_pengajuan_dana: pengajuan[0],
//         id_detail_program_kerja: id_detail_program_kerja,
//         nominal: total_dana,
//         status: status, // Gunakan status "a" untuk status "m" pada detail pengajuan
//       };
//       await database("tb_detail_pengajuan").insert(inputDetailPengajuan);

//       results.push({
//         id_detail_program_kerja: id_detail_program_kerja,
//         status: 1,
//         message: "Pengajuan dana berhasil disimpan",
//         result: {
//           id_pengajuan: pengajuan[0],
//           id_detail_program_kerja: id_detail_program_kerja,
//           nama_kegiatan: nama_kegiatan,
//           tanggal_pengajuan: tanggal_pengajuan, // Gunakan tanggal_pengajuan dari permintaan POST
//           total_dana: total_dana,
//           status: status,
//           detail_pengajuan: inputDetailPengajuan,
//         },
//       });
//     }

//     return res.status(201).json({
//       status: 1,
//       message: "Proses pengajuan dana selesai",
//       results: results,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 0,
//       message: error.message,
//     });
//   }
// });



// Endpoint untuk posting data pengajuan dana
// router.post("/", upload.single('patch_dokumen'), async (req, res) => {
//   const requestData = JSON.parse(req.body.data); // Mengurai data JSON dari form-data
//   const uploadedFile = req.file;
//   const tanggal = new Date();

//   try {
//     const results = [];

//     for (const data of requestData) {
//       const { id_detail_program_kerja, status, tanggal_pengajuan } = data;

//       // Ambil data plotting dana dari tb_detail_program_kerja
//       const detailProgramKerja = await database("tb_detail_program_kerja")
//         .select("nama_kegiatan", "ploting_dana")
//         .where("id_detail_program_kerja", id_detail_program_kerja)
//         .first();

//       if (!detailProgramKerja) {
//         results.push({
//           id_detail_program_kerja: id_detail_program_kerja,
//           status: 0,
//           message: "Detail program kerja tidak ditemukan",
//         });
//         continue; // Lanjut ke data berikutnya jika detail tidak ditemukan
//       }

//       const nama_kegiatan = detailProgramKerja.nama_kegiatan;
//       const total_dana = detailProgramKerja.ploting_dana;

//       // Simpan data pengajuan
//       const pengajuan = await database("tb_pengajuan_dana").insert({
//         id_detail_program_kerja: id_detail_program_kerja,
//         nama_kegiatan: nama_kegiatan,
//         tanggal_pengajuan: tanggal_pengajuan, // Gunakan tanggal_pengajuan dari permintaan POST
//         total_dana: total_dana,
//         status: status,
//       });

//       // Simpan data ke tabel tb_detail_pengajuan (multi-insert)
//       const inputDetailPengajuan = {
//         id_pengajuan_dana: pengajuan[0],
//         id_detail_program_kerja: id_detail_program_kerja,
//         nominal: total_dana,
//         status: status, // Gunakan status "a" untuk status "m" pada detail pengajuan
//       };
//       await database("tb_detail_pengajuan").insert(inputDetailPengajuan);

//       const inputLaporan = {
//         id_pengajuan_dana: pengajuan[0],
//         tanggal: tanggal,
//         patch_dokumen: uploadedFile.filename,
//         status: status
//       };

//       await database("tb_laporan_pengajuan").insert(inputLaporan);

//       results.push({
//         id_detail_program_kerja: id_detail_program_kerja,
//         status: 1,
//         message: "Pengajuan dana berhasil disimpan",
//         result: {
//           id_pengajuan: pengajuan[0],
//           id_detail_program_kerja: id_detail_program_kerja,
//           nama_kegiatan: nama_kegiatan,
//           tanggal_pengajuan: tanggal_pengajuan, // Gunakan tanggal_pengajuan dari permintaan POST
//           total_dana: total_dana,
//           status: status,
//           detail_pengajuan: inputDetailPengajuan,
//           laporan_pengajuan: inputLaporan
//         },
//       });
//     }

//     return res.status(201).json({
//       status: 1,
//       message: "Proses pengajuan dana selesai",
//       results: results,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 0,
//       message: error.message,
//     });
//   }
// });


// Endpoint untuk menampilkan semua data pengajuan
router.get("/", async (req, res) => {
  try {
    const pengajuanData = await database("tb_pengajuan_dana")
      .select("id_pengajuan_dana", "nama_kegiatan");

    if (pengajuanData.length === 0) {
      return res.status(404).json({
        status: 0,
        message: "Data pengajuan tidak ditemukan"
      });
    }

    return res.status(200).json({
      status: 1,
      message: "Data pengajuan berhasil ditemukan",
      data: pengajuanData
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});


// router.post("/pengajuan-dana", async (req, res) => {
//   const requestData = req.body;

//   try {
//     const results = [];

//     for (const data of requestData) {
//       // ... proses pengajuan dana seperti sebelumnya ...

//       // Proses upload dokumen
//       if (data.dokumen) {
//         const fileData = data.dokumen;
//         const filePath = fileData.path;

//         // Simpan data ke tabel tb_laporan_dokumen
//         try {
//           const inputDokumen = {
//             id_pengajuan_dana: data.id_pengajuan_dana,
//             tanggal: tanggal,
//             patch_dokumen: filePath,
//             status: "a", // Atur status "a" atau "t" sesuai kebutuhan
//           };
//           const insertedDokumen = await database("tb_laporan_dokumen").insert(inputDokumen);

//           results.push({
//             id_detail_program_kerja: data.id_detail_program_kerja,
//             status: 1,
//             message: "Pengajuan dana berhasil disimpan dan file diunggah",
//             // ... informasi lainnya ...
//             inserted_data: insertedDokumen,
//           });
//         } catch (error) {
//           results.push({
//             id_detail_program_kerja: data.id_detail_program_kerja,
//             status: 0,
//             message: "Pengajuan dana berhasil disimpan, tetapi gagal mengunggah file",
//           });
//         }
//       } else {
//         results.push({
//           id_detail_program_kerja: data.id_detail_program_kerja,
//           status: 1,
//           message: "Pengajuan dana berhasil disimpan tanpa file",
//           // ... informasi lainnya ...
//         });
//       }
//     }

//     return res.status(201).json({
//       status: 1,
//       message: "Proses pengajuan dana selesai",
//       results: results,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 0,
//       message: error.message,
//     });
//   }
// });







// router.post("/", upload.single('patch_dokumen'), async (req, res) => {
//   const requestData = req.body;
//   const uploadedFile = req.body;
//   const tanggal = new Date();

//   try {
//     const results = [];

//     for (const data of requestData) {
//       const { id_detail_program_kerja, status, tanggal_pengajuan } = data;

//       // Ambil data plotting dana dari tb_detail_program_kerja
//       const detailProgramKerja = await database("tb_detail_program_kerja")
//         .select("nama_kegiatan", "ploting_dana")
//         .where("id_detail_program_kerja", id_detail_program_kerja)
//         .first();

//       if (!detailProgramKerja) {
//         results.push({
//           id_detail_program_kerja: id_detail_program_kerja,
//           status: 0,
//           message: "Detail program kerja tidak ditemukan",
//         });
//         continue; // Lanjut ke data berikutnya jika detail tidak ditemukan
//       }

//       const nama_kegiatan = detailProgramKerja.nama_kegiatan;
//       const total_dana = detailProgramKerja.ploting_dana;

//       // Simpan data pengajuan
//       const pengajuan = await database("tb_pengajuan_dana").insert({
//         id_detail_program_kerja: id_detail_program_kerja,
//         nama_kegiatan: nama_kegiatan,
//         tanggal_pengajuan: tanggal_pengajuan, // Gunakan tanggal_pengajuan dari permintaan POST
//         total_dana: total_dana,
//         status: status,
//       });

//       // Simpan data ke tabel tb_detail_pengajuan (multi-insert)
//       const inputDetailPengajuan = {
//         id_pengajuan_dana: pengajuan[0],
//         id_detail_program_kerja: id_detail_program_kerja,
//         nominal: total_dana,
//         status: status, // Gunakan status "a" untuk status "m" pada detail pengajuan
//       };
//       await database("tb_detail_pengajuan").insert(inputDetailPengajuan);

//       const inputLaporan = {
//         id_pengajuan_dana: pengajuan[0],
//         tanggal: tanggal,
//         patch_dokumen: uploadedFile.filename,
//         status: status
//     }
//     await database("tb_laporan_pengajuan").insert(inputLaporan)

//       results.push({
//         id_detail_program_kerja: id_detail_program_kerja,
//         status: 1,
//         message: "Pengajuan dana berhasil disimpan",
//         result: {
//           id_pengajuan: pengajuan[0],
//           id_detail_program_kerja: id_detail_program_kerja,
//           nama_kegiatan: nama_kegiatan,
//           tanggal_pengajuan: tanggal_pengajuan, // Gunakan tanggal_pengajuan dari permintaan POST
//           total_dana: total_dana,
//           status: status,
//           detail_pengajuan: inputDetailPengajuan,
//           laporan_pengajuan: inputLaporan
//         },
//       });
//     }

//     return res.status(201).json({
//       status: 1,
//       message: "Proses pengajuan dana selesai",
//       results: results,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 0,
//       message: error.message,
//     });
//   }
// });

module.exports = router