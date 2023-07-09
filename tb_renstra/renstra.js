const express = require("express")
const router = express.Router();
const database = require("../config/database")
const validasi_data = require("./validasi_data")
const verifikasi_validasi_data = require("../middleware/verifikasi_validasi_data")

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

    const simpan_renstra = await database("tb_renstra").insert(input_renstra);

    if (simpan_renstra) {
      const id_renstra = simpan_renstra[0]; // Ambil nilai ID renstra yang disimpan

      const input_sebaran_renstra = {
        id_renstra: id_renstra,
        id_sebaran_renstra: null, // Ganti dengan nilai yang sesuai, jika perlu
        id_unit_kerja: data.id_unit_kerja,
        baseline: data.baseline,
      };

      const simpan_sebaran_renstra = await database("tb_sebaran_renstra").insert(input_sebaran_renstra);

      if (data.id_jenis_status == "7") {
        return res.status(201).json({
          status: 1,
          message: "Berhasil",
          result: {
            renstra: {
              id_renstra: id_renstra,
              ...input_renstra,
            },
            sebaran_renstra: {
              id_sebaran_renstra: simpan_sebaran_renstra[0],
              ...input_sebaran_renstra,
            },
          },
        });
      } else {
        return res.status(201).json({
          status: 1,
          message: "Berhasil",
          result: {
            renstra: {
              id_renstra: id_renstra,
              ...input_renstra,
            },
            sebaran_renstra: {
              id_sebaran_renstra: simpan_sebaran_renstra[0],
              ...input_sebaran_renstra,
            },
          },
        });
      }
    } else {
      return res.status(422).json({
        status: 0,
        message: "Gagal simpan",
      });
    }
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