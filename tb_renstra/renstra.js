const express = require("express")
const router = express.Router();
const database = require("../config/database")

router.get("/all", async (req,res) =>{
    try {
        
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        })
    }
})

router.post("/multi/insert", async (req, res) => {
  const data = req.body;
  const input = {
    ...data,
    status: "a",
    create_date: new Date(),
    update_date: new Date(),
  };

  try {
    const input_renstra = {
      id_bidang_renstra: data.id_bidang_renstra,
      id_tahun_restra: data.id_tahun_restra,
      program: data.program,
      indikator: data.indikator,
      tujuan: data.tujuan,
      kondisi_existing: data.kondisi_existing,
      baseline: data.baseline,
      standart_ditetapkan: data.standart_ditetapkan,
      status: data.status,
    };

    // Simpan data ke tabel tb_renstra
    const [id_renstra] = await database("tb_renstra").insert(input_renstra);

    // Simpan data ke tabel tb_sasaran_renstra
    

    // Simpan data ke tabel tb_strategi_renstra
    

    // Simpan data ke tabel tb_tahun_capaian_renstra
      const input_tahun_capaian_renstra = {
        id_renstra: id_renstra,
        tahun: data.tahun,
        jumlah: data.jumlah,
        status: data.status,}

      await database("tb_tahun_capaian_renstra").insert(input_tahun_capaian_renstra);

      const input_strategi = {
        id_renstra: id_renstra,
        strategi: data.strategi,
        status: data.status,}

      await database("tb_strategi_renstra").insert(input_strategi);
 
      const input_sasaran_renstra = {
        id_renstra: id_renstra,
        sasaran_renstra: data.sasaran_renstra,
        status: data.status,}
      await database("tb_sasaran_renstra").insert(input_sasaran_renstra);

    // Simpan data ke tabel tb_dokumen_renstra
    const input_dokumen_renstra = {
      id_renstra: id_renstra,
      nama_dokumen: data.nama_dokumen,
      patch_dokumen: data.patch_dokumen,
      status: data.status,
    };
    await database("tb_dokumen_renstra").insert(input_dokumen_renstra);

    // Simpan data ke tabel tb_sebaran_renstra
    const input_sebaran_renstra = {
      id_renstra: id_renstra,
      id_unit_kerja: data.id_unit_kerja,
      baseline: data.baseline,
    };
    await database("tb_sebaran_renstra").insert(input_sebaran_renstra);

    return res.status(201).json({
      status: 1,
      message: "Berhasil",
      result: {
        renstra: {
          id_renstra: id_renstra,
          ...input_renstra,
        },
        sasaran_renstra: input_sasaran_renstra,
        strategi: input_strategi,
        tahun_capaian_renstra: input_tahun_capaian_renstra,
        dokumen_renstra: input_dokumen_renstra,
        sebaran_renstra: input_sebaran_renstra,
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