const express = require("express");
const router = express.Router();
const database = require("../config/database")






router.get("/:nama_bidang/:nama_tahun", async (req, res) => {
  const { nama_bidang, nama_tahun } = req.params;

  try {
    const result = await database("tb_renstra")
      .select(
        "tb_renstra.*",
        "tb_bidang_renstra.nama_bidang",
        "tb_tahun_restra.nama_tahun"
      )
      .leftJoin(
        "tb_bidang_renstra",
        "tb_renstra.id_bidang_renstra",
        "tb_bidang_renstra.id_bidang_renstra"
      )
      .leftJoin(
        "tb_tahun_restra",
        "tb_renstra.id_tahun_restra",
        "tb_tahun_restra.id_tahun_restra"
      )
      .where("tb_bidang_renstra.nama_bidang", nama_bidang)
      .where("tb_tahun_restra.nama_tahun", nama_tahun)
      ;

    if (result) {
      return res.status(200).json({
        status: 1,
        message: "Berhasil",
        result: result,
      });
    } else {
      return res.status(400).json({
        status: 0,
        message: "Data tidak ditemukan",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});





router.get("/", async (req, res) => {
  try {
    const result = await database("tb_renstra")
      .distinct("tb_bidang_renstra.nama_bidang", "tb_tahun_restra.nama_tahun")
      .leftJoin(
        "tb_bidang_renstra",
        "tb_renstra.id_bidang_renstra",
        "tb_bidang_renstra.id_bidang_renstra"
      )
      .leftJoin(
        "tb_tahun_restra",
        "tb_renstra.id_tahun_restra",
        "tb_tahun_restra.id_tahun_restra"
      );

    if (result.length > 0) {
      return res.status(200).json({
        status: 1,
        message: "Berhasil",
        result: result,
      });
    } else {
      return res.status(400).json({
        status: 0,
        message: "Data tidak ditemukan",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});


router.get("/program", async (req, res) => {
  try {
    const result = await database("tb_renstra")
      .select("id_renstra", "program");

    if (result.length > 0) {
      return res.status(200).json({
        status: 1,
        message: "Berhasil",
        result: result.map(item => ({ id_renstra: item.id_renstra, program: item.program })),
      });
    } else {
      return res.status(400).json({
        status: 0,
        message: "Data tidak ditemukan",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});



router.post("/multi/insert", async (req, res) => {
  const data = req.body;

  try {
    const inputRenstra = {
      id_bidang_renstra: data.id_bidang_renstra,
      id_tahun_restra: data.id_tahun_restra,
      program: data.program,
      indikator: data.indikator,
      tujuan: data.tujuan,
      kondisi_existing: data.kondisi_existing,
      baseline: data.baseline,
      standart_ditetapkan: data.standart_ditetapkan,
      status: data.status,
      create_date: new Date(),
      update_date: new Date(),
    };

    // Simpan data ke tabel tb_renstra
    const [idRenstra] = await database("tb_renstra").insert(inputRenstra);

    // Simpan data ke tabel tb_sasaran_renstra
    const inputSasaranRenstra = {
      id_renstra: idRenstra,
      sasaran_renstra: data.sasaran_renstra,
      status: data.status,
    };
    await database("tb_sasaran_renstra").insert(inputSasaranRenstra);

    // Simpan data ke tabel tb_strategi_renstra
    const inputStrategi = {
      id_renstra: idRenstra,
      strategi: data.strategi,
      status: data.status,
    };
    await database("tb_strategi_renstra").insert(inputStrategi);

    // Simpan data ke tabel tb_tahun_capaian_renstra
    const inputTahunCapaianRenstra = {
      id_renstra: idRenstra,
      tahun: data.tahun,
      jumlah: data.jumlah,
      status: data.status,
    };
    await database("tb_tahun_capaian_renstra").insert(inputTahunCapaianRenstra);

    // Simpan data ke tabel tb_dokumen_renstra
    const inputDokumenRenstra = {
      id_renstra: idRenstra,
      nama_dokumen: data.nama_dokumen,
      status: data.status,
    };
    await database("tb_dokumen_renstra").insert(inputDokumenRenstra);

    // Simpan data ke tabel tb_sebaran_renstra
    const inputSebaranRenstra = {
      id_renstra: idRenstra,
      id_unit_kerja: data.id_unit_kerja,
      // baseline: data.baseline,
    };
    await database("tb_sebaran_renstra").insert(inputSebaranRenstra);

    // Dapatkan id_sebaran dari tb_sebaran_renstra
    const { id_sebaran_renstra } = await database("tb_sebaran_renstra")
      .select("id_sebaran_renstra")
      .where("id_renstra", idRenstra)
      // .where("baseline", data.baseline)
      .first();

    // Simpan data ke tabel tb_detail_sebaran_renstra
    const inputDetailSebaranRenstra = {
      id_sebaran_renstra: id_sebaran_renstra,
      tahun: data.tahun,
    };
    await database("tb_detail_sebaran_renstra").insert(inputDetailSebaranRenstra);

    return res.status(201).json({
      status: 1,
      message: "Berhasil",
      result: {
        renstra: {
          id_renstra: idRenstra,
          ...inputRenstra,
        },
        sasaran_renstra: inputSasaranRenstra,
        strategi: inputStrategi,
        tahun_capaian_renstra: inputTahunCapaianRenstra,
        dokumen_renstra: inputDokumenRenstra,
        sebaran_renstra: inputSebaranRenstra,
        detail_sebaran_renstra: inputDetailSebaranRenstra,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});





router.put("/:id_renstra", async (req, res) => {
    try {
      const data = req.body;
      data.update_date = new Date();
  
      const result = await database("tb_renstra")
        .where("id_renstra", req.params.id_renstra)
        .first();
  
      if (result) {
        await database("tb_renstra")
          .where("id_renstra", req.params.id_renstra)
          .update(data);
  
        return res.status(201).json({
          status: 1,
          message: "Berhasil",
        });
      } else {
        return res.status(422).json({
          status: 0,
          message: "Gagal, data tidak ditemukan",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.message,
      });
    }
  });

  router.get("/all", async (req,res) =>{
    try {
        
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        })
    }
})

module.exports = router;