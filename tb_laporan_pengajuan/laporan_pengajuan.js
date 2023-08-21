const express = require('express');
const router = express.Router();
const upload = require('./multer'); // Pastikan Anda mengimpor konfigurasi upload
const database = require('../config/database');
const fs = require("fs");
const path = require("path");
 // Sesuaikan dengan impor modul database Anda

 router.post('/', upload.single('patch_dokumen'), async (req, res) => {
    try {
        // Mendapatkan tanggal saat ini
        const tanggal = new Date();
        
        // Mendapatkan data dari permintaan
        const data = req.body; // Pastikan Anda telah mengirimkan data yang dibutuhkan
        
        const uploadedFile = req.file; // Gunakan req.file untuk mengakses file yang diunggah
        
        if (!uploadedFile) {
            return res.status(400).json({
                status: 0,
                message: "Dokumen tidak ditemukan",
            });
        }

        // Memasukkan data ke dalam database
        const insertedData = await database("tb_laporan_pengajuan").insert({
            id_pengajuan_dana: data.id_pengajuan_dana,
            tanggal: tanggal,
            patch_dokumen: uploadedFile.filename,
            status: data.status
        });

        // Mengembalikan respons yang mencakup data yang telah dimasukkan
        return res.status(200).json({
            status: 1,
            message: "Berhasil",
            results: {
                id_laporan_pengajuan: insertedData[0], // Ambil ID laporan yang baru saja dimasukkan
                ...data, // Sisipkan data yang telah diambil dari permintaan
                tanggal: tanggal, // Gunakan tanggal saat ini
                patch_dokumen: uploadedFile.filename,
                status: data.status // Gunakan nama file yang diunggah
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 0,
            message: error.message
        });
    }
});


// router.post('/upload/add', upload.single('patch_dokumen'), async (req, res) => {
//     try {
//         // Mendapatkan tanggal saat ini
//         const tanggal = new Date();
        
//         // Mendapatkan data dari permintaan
//         const data = req.body; // Pastikan Anda telah mengirimkan data yang dibutuhkan
        
//         const uploadedFile = req.file; // Gunakan req.file untuk mengakses file yang diunggah
        
//         if (!uploadedFile) {
//             return res.status(400).json({
//                 status: 0,
//                 message: "Dokumen tidak ditemukan",
//             });
//         }

//         // Step 1: Kirim permintaan untuk menyimpan pengajuan dana ke API pengajuan dana yang berbeda
//         const pengajuanDanaResponse = await axios.post('http://localhost:8080/api/pengajuan/', {
//             tanggal: tanggal,
//             ...data, // Sisipkan data yang Anda terima dalam permintaan
//         });

//         // Pastikan permintaan berhasil dan dapatkan ID pengajuan dana yang baru saja dibuat
//         const id_pengajuan_dana = pengajuanDanaResponse.data.id_pengajuan_dana;

//         // Step 2: Memasukkan data laporan pengajuan ke dalam database Anda dengan merujuk ke ID pengajuan dana yang telah dibuat
//         const insertedData = await database("tb_laporan_pengajuan").insert({
//             id_pengajuan_dana: id_pengajuan_dana, // Gunakan ID pengajuan dana yang baru saja dimasukkan
//             tanggal: tanggal,
//             patch_dokumen: uploadedFile.filename,
//             status: data.status
//         });

//         // Mengembalikan respons yang mencakup data yang telah dimasukkan
//         return res.status(200).json({
//             status: 1,
//             message: "Berhasil",
//             results: {
//                 id_pengajuan_dana: id_pengajuan_dana,
//                 id_laporan_pengajuan: insertedData[0], // Ambil ID laporan yang baru saja dimasukkan
//                 tanggal: tanggal, // Gunakan tanggal saat ini
//                 patch_dokumen: uploadedFile.filename,
//                 status: data.status
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({
//             status: 0,
//             message: error.message
//         });
//     }
// });


module.exports = router;
