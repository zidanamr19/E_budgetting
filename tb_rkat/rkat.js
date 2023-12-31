const express = require("express");
const router = express.Router();
const database = require("../config/database")

router.get('/data-unit-kerja', async (req, res) => {
  const { id_renstra, tahun } = req.query;

  try {
    let query = database('tb_rkat')
      .select(
        'tb_rkat.id_rkat',
        'tb_rkat.id_renstra',
        'tb_rkat.id_unit_kerja',
        'tb_rkat.jumlah',
        'tb_rkat.status',
        'tb_unit_kerja.nama_unit_kerja'
      )
      .leftJoin('tb_unit_kerja', 'tb_rkat.id_unit_kerja', 'tb_unit_kerja.id_unit_kerja')
      .where({
        'tb_rkat.id_renstra': id_renstra,
        'tb_rkat.tahun': tahun,
      });

    const rkatData = await query;

    return res.status(200).json({
      status: 1,
      message: 'Data berhasil diambil',
      data: rkatData,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});

router.get('/data-rkat/:id_unit_kerja', async (req, res) => {
  const id_unit_kerja = req.params.id_unit_kerja;

  try {
    const rkatData = await database('tb_rkat')
      .select(
        'tb_rkat.id_rkat',
        'tb_rkat.id_renstra',
        'tb_rkat.id_unit_kerja',
        'tb_rkat.tahun',
        'tb_rkat.jumlah',
        'tb_rkat.baseline',
        'tb_rkat.status',
        'tb_unit_kerja.nama_unit_kerja',
        'tb_renstra.program'
      )
      .leftJoin('tb_unit_kerja', 'tb_rkat.id_unit_kerja', 'tb_unit_kerja.id_unit_kerja')
      .leftJoin('tb_renstra', 'tb_rkat.id_renstra', 'tb_renstra.id_renstra')
      .where({
        'tb_rkat.id_unit_kerja': id_unit_kerja,
      });

    return res.status(200).json({
      status: 1,
      message: 'Data RKAT berhasil diambil berdasarkan ID unit kerja',
      data: rkatData,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});

router.get('/', async (req, res) => {
  const { id_renstra, tahun } = req.query;

  try {
    let query = database('tb_rkat')
      .select('tb_rkat.id_rkat','tb_rkat.id_renstra', 'tb_rkat.tahun','tb_rkat.baseline', 'tb_renstra.program') // Ganti 'nama_program' dengan kolom yang sesuai pada tb_renstra
      .leftJoin('tb_renstra', 'tb_rkat.id_renstra', 'tb_renstra.id_renstra'); // Ganti 'id_renstra' dan 'id' sesuai dengan kolom yang sesuai

    // Jika id_renstra dan tahun tersedia, lakukan filter
    if (id_renstra && tahun) {
      query = query.where({
        'tb_rkat.id_renstra': id_renstra,
        'tb_rkat.tahun': tahun,
      });
    }

    query = query.groupBy('tb_rkat.id_renstra', 'tb_rkat.tahun'); // Grup berdasarkan tahun dan id_renstra

    const rkatData = await query;

    return res.status(200).json({
      status: 1,
      message: 'Data berhasil diambil',
      data: rkatData,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});


router.post("/simpan", async (req, res) => {
  const {  id_renstra, tahun, baseline, status, id_unit_kerja, jumlah } = req.body;

  try {
    // Simpan data ke tabel tb_rkat
    const inputRKAT = {
    };
    // Simpan data id_unit_kerja dan jumlah ke dalam tabel tb_rkat
    for (let i = 0; i < id_unit_kerja.length; i++) {
      await database("tb_rkat").insert({

        id_renstra: id_renstra,
        tahun: tahun,
        baseline: baseline,
        status: status,
        create_date: new Date(),
        update_date: new Date(),
        id_unit_kerja: id_unit_kerja[i],
        jumlah: jumlah[i],
      });
    }

    return res.status(201).json({
      status: 1,
      message: "Berhasil",
      result: {
        ...inputRKAT,
        id_renstra: id_renstra,
        tahun: tahun,
        baseline: baseline,
        status: status,
        create_date: new Date(),
        update_date: new Date(),
        id_unit_kerja: id_unit_kerja,
        jumlah: jumlah,
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