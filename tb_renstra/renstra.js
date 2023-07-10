const express = require("express")
const router = express.Router();
const database = require("../config/database")

// router.get("/all", async (req,res) =>{
//     try {
        
//     } catch (error) {
//         return res.status(500).json({
//             status : 0,
//             message : error.message
//         })
//     }
// })

router.get("/", async (req, res) => {
  try {
    const result = await database("tb_renstra")
      .select("tb_bidang_renstra.nama_bidang", "tb_tahun_restra.nama_tahun", "tb_renstra.*")
      .leftJoin("tb_bidang_renstra", "tb_renstra.id_bidang_renstra", "tb_bidang_renstra.id_bidang_renstra")
      .leftJoin("tb_tahun_restra", "tb_renstra.id_tahun_restra", "tb_tahun_restra.id_tahun_restra").first();

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





router.get("/:id_renstra", async (req, res) => {
  const { id_renstra } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;

    const query = database
      .select (
      "tb_renstra.id_renstra",
      "tb_renstra.id_bidang_renstra",
      "tb_renstra.id_tahun_restra",
      "tb_bidang_renstra.nama_bidang",
      "tb_renstra.program",
      "tb_renstra.indikator",
      "tb_renstra.tujuan",
      "tb_renstra.kondisi_existing",
      "tb_renstra.baseline",
      "tb_renstra.standart_ditetapkan",
      "tb_tahun_capaian_renstra.tahun",
      "tb_tahun_capaian_renstra.jumlah",
      "tb_strategi_renstra.strategi",
      "tb_sasaran_renstra.sasaran_renstra",
      "tb_dokumen_renstra.nama_dokumen",
      "tb_renstra.status",
    )
      .from("tb_renstra")
      .leftJoin(
        "tb_tahun_capaian_renstra",
        "tb_renstra.id_renstra",
        "tb_tahun_capaian_renstra.id_renstra"
      )
      .leftJoin(
        "tb_strategi_renstra",
        "tb_renstra.id_renstra",
        "tb_strategi_renstra.id_renstra"
      )
      .leftJoin(
        "tb_sasaran_renstra",
        "tb_renstra.id_renstra",
        "tb_sasaran_renstra.id_renstra"
      )
      .leftJoin(
        "tb_dokumen_renstra",
        "tb_renstra.id_renstra",
        "tb_dokumen_renstra.id_renstra"
      )
      .leftJoin(
        "tb_sebaran_renstra",
        "tb_renstra.id_renstra",
        "tb_sebaran_renstra.id_renstra"
      )
      .leftJoin(
        "tb_bidang_renstra",
        "tb_renstra.id_bidang_renstra",
        "tb_bidang_renstra.id_bidang_renstra"
      )
      .modify((queryBuilder) => {
        if (id_renstra) {
          queryBuilder.where("tb_renstra.id_renstra", id_renstra);
        }
      });

    const countQuery = query.clone().clearSelect().count({ total: "*" });

    const [data, countResult] = await Promise.all([
      query.offset(offset).limit(limit),
      countQuery,
    ]);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      status: 1,
      message: "Success",
      data: data,
      total: total,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});




router.get("/renstra/:nama_tahun", async (req, res) => {
  const namaTahun = req.params.nama_tahun;

  try {
    const result = await database("tb_renstra")
      .select("tb_renstra.*", "tb_tahun_restra.nama_tahun")
      .join("tb_tahun_restra", "tb_renstra.id_tahun_renstra", "tb_tahun_restra.id_tahun_renstra")
      .where("tb_tahun_restra.nama_tahun", namaTahun);

    const totalData = result.length;

    if (totalData > 0) {
      return res.status(200).json({
        status: 1,
        message: "Berhasil",
        totalData: totalData,
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




router.post("/multi/insert", async (req, res) => {
  const data = req.body; // Mendapatkan tanggal saat ini dalam format YYYY-MM-DD

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
      create_date: new Date (),
      update_date: new Date ,
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
      status: data.status,
    };

    await database("tb_tahun_capaian_renstra").insert(input_tahun_capaian_renstra);

    const input_strategi = {
      id_renstra: id_renstra,
      strategi: data.strategi,
      status: data.status,
    };

    await database("tb_strategi_renstra").insert(input_strategi);

    const input_sasaran_renstra = {
      id_renstra: id_renstra,
      sasaran_renstra: data.sasaran_renstra,
      status: data.status,
    };

    await database("tb_sasaran_renstra").insert(input_sasaran_renstra);

    // Simpan data ke tabel tb_dokumen_renstra
    const input_dokumen_renstra = {
      id_renstra: id_renstra,
      nama_dokumen: data.nama_dokumen,
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