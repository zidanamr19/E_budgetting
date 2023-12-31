const express = require("express");
const router = express.Router();
const database = require("../config/database")


router.get("/renstra/:nama_bidang/:nama_tahun", async (req, res) => {
  const { nama_bidang, nama_tahun } = req.params;

  try {
    const mainResults = await database("tb_renstra")
      .select(
        "tb_renstra.*",
        "tb_bidang_renstra.nama_bidang",
        "tb_tahun_restra.nama_tahun",
        "tb_sasaran_renstra.sasaran_renstra",
        "tb_strategi_renstra.strategi",
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
      .leftJoin(
        "tb_sasaran_renstra",
        "tb_renstra.id_renstra",
        "tb_sasaran_renstra.id_renstra"
      )
      .leftJoin(
        "tb_strategi_renstra",
        "tb_renstra.id_renstra",
        "tb_strategi_renstra.id_renstra"
      )
      .where("tb_bidang_renstra.nama_bidang", nama_bidang)
      .where("tb_tahun_restra.nama_tahun", nama_tahun);

    if (mainResults.length > 0) {
      // Get the corresponding data from tb_tahun_capaian_renstra
      const idRenstras = mainResults.map((result) => result.id_renstra);
      const tahunCapaianResults = await database("tb_tahun_capaian_renstra")
        .select("id_renstra", "tahun", "jumlah")
        .whereIn("id_renstra", idRenstras);

      // Group the tahun capaian renstra data by id_renstra
      const tahunCapaianRenstraByRenstraId = {};
      tahunCapaianResults.forEach((tahunCapaianResult) => {
        const { id_renstra, tahun, jumlah } = tahunCapaianResult;
        if (!tahunCapaianRenstraByRenstraId[id_renstra]) {
          tahunCapaianRenstraByRenstraId[id_renstra] = [];
        }
        tahunCapaianRenstraByRenstraId[id_renstra].push({ tahun, jumlah });
      });

      // Get the corresponding data from tb_dokumen_renstra
      const dokumenRenstraResults = await database("tb_dokumen_renstra")
        .select("id_renstra", "nama_dokumen")
        .whereIn("id_renstra", idRenstras);

      // Group the dokumen renstra data by id_renstra
      const dokumenRenstraByRenstraId = {};
      dokumenRenstraResults.forEach((dokumenRenstraResult) => {
        const { id_renstra, nama_dokumen } = dokumenRenstraResult;
        if (!dokumenRenstraByRenstraId[id_renstra]) {
          dokumenRenstraByRenstraId[id_renstra] = [];
        }
        dokumenRenstraByRenstraId[id_renstra].push(nama_dokumen);
      });

      // Format the main results data
      const formattedResults = mainResults.map((result) => ({
        id_bidang_renstra: result.id_bidang_renstra,
        id_tahun_restra: result.id_tahun_restra,
        program: result.program,
        indikator: result.indikator,
        tujuan: result.tujuan,
        kondisi_existing: result.kondisi_existing,
        baseline: result.baseline,
        standart_ditetapkan: result.standart_ditetapkan,
        status: result.status,
        sasaran_renstra: result.sasaran_renstra,
        strategi: result.strategi,
        tahun_capaian_renstra: tahunCapaianRenstraByRenstraId[result.id_renstra] || [],
        dokumen_renstra: dokumenRenstraByRenstraId[result.id_renstra] || [],
      }));

      return res.status(200).json({
        status: 1,
        message: "Berhasil",
        result: formattedResults,
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


router.get("/program-renstra-by-tahun-bidang/:nama_tahun/:nama_bidang", async (req, res) => {
  const { nama_tahun, nama_bidang } = req.params;

  try {
    const programRenstra = await database("tb_renstra")
      .select("id_renstra","program",) 
      .leftJoin("tb_bidang_renstra", "tb_renstra.id_bidang_renstra", "tb_bidang_renstra.id_bidang_renstra")
      .leftJoin("tb_tahun_restra", "tb_renstra.id_tahun_restra", "tb_tahun_restra.id_tahun_restra")
      .where("tb_tahun_restra.nama_tahun", nama_tahun)
      .where("tb_bidang_renstra.nama_bidang", nama_bidang);

    if (programRenstra.length > 0) {
      return res.status(200).json({
        status: 1,
        message: "Data ditemukan",
        program_renstra: programRenstra,
      });
    } else {
      return res.status(404).json({
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


router.get("/baseline-by-id-renstra/:id_renstra", async (req, res) => {
  const { id_renstra } = req.params;

  try {
    const baselineData = await database("tb_renstra")
      .select("baseline")
      .where("id_renstra", id_renstra);

    if (baselineData.length > 0) {
      return res.status(200).json({
        status: 1,
        message: "Data baseline ditemukan",
        baseline_data: baselineData[0], // Karena id_renstra unik, hanya mengambil data pertama (jika ada)
      });
    } else {
      return res.status(404).json({
        status: 0,
        message: "Data baseline tidak ditemukan",
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

    // Simpan data ke tabel tb_tahun_capaian_renstra (multi-insert)
    let inputTahunCapaianRenstra = []; // Deklarasi variabel inputTahunCapaianRenstra
    if (data.tahun && data.jumlah && data.tahun.length === data.jumlah.length) {
      inputTahunCapaianRenstra = data.tahun.map((tahun, index) => ({
        id_renstra: idRenstra,
        tahun: tahun,
        jumlah: data.jumlah[index],
        status: data.status,
      }));
      await database("tb_tahun_capaian_renstra").insert(inputTahunCapaianRenstra);
    }

    // Simpan data ke tabel tb_dokumen_renstra (multi-insert)
    let inputDokumenRenstra = []; // Deklarasi variabel inputDokumenRenstra sebagai array kosong
    if (data.dokumen && Array.isArray(data.dokumen)) {
      inputDokumenRenstra = data.dokumen.map((dokumen) => ({
        id_renstra: idRenstra,
        nama_dokumen: dokumen.nama_dokumen,
        status: data.status,
      }));
      await database("tb_dokumen_renstra").insert(inputDokumenRenstra);
    }

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
        tahun_capaian_renstra: inputTahunCapaianRenstra, // Jika perlu, tambahkan array tahun capaian renstra
        dokumen_renstra: inputDokumenRenstra, // Jika perlu, tambahkan array dokumen renstra
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});




router.put("/multi/edit", async (req, res) => {
  const data = req.body;
  const updatedData = [];

  try {
    // Loop melalui data yang diterima untuk melakukan update pada setiap tabel yang relevan
    for (const renstraData of data) {
      const { id_renstra, sasaran_renstra, strategi, tahun_capaian_renstra, nama_dokumen } = renstraData;

      // Update data pada tabel tb_sasaran_renstra
      if (sasaran_renstra) {
        for (const sasaranData of sasaran_renstra) {
          const { id_sasaran_renstra, sasaran, status } = sasaranData;

          const updatedSasaranRenstra = {
            sasaran_renstra: sasaran || existingSasaranRenstra.sasaran_renstra,
            status: status || existingSasaranRenstra.status,
            update_date: new Date(),
          };

          await database("tb_sasaran_renstra").where("id_sasaran_renstra", id_sasaran_renstra).update(updatedSasaranRenstra);

          updatedData.push({
            id_sasaran_renstra,
            ...updatedSasaranRenstra,
          });
        }
      }

      // Update data pada tabel tb_strategi_renstra
      if (strategi) {
        for (const strategiData of strategi) {
          const { id_strategi, strategi, status } = strategiData;

          const updatedStrategiRenstra = {
            strategi: strategi || existingStrategiRenstra.strategi,
            status: status || existingStrategiRenstra.status,
            update_date: new Date(),
          };

          await database("tb_strategi_renstra").where("id_strategi", id_strategi).update(updatedStrategiRenstra);

          updatedData.push({
            id_strategi,
            ...updatedStrategiRenstra,
          });
        }
      }

      // Update data pada tabel tb_tahun_capaian_renstra
      if (tahun_capaian_renstra) {
        for (const tahunCapaianData of tahun_capaian_renstra) {
          const { id_tahun_capaian_renstra, tahun, jumlah, status } = tahunCapaianData;

          const updatedTahunCapaianRenstra = {
            tahun: tahun || existingTahunCapaianRenstra.tahun,
            jumlah: jumlah || existingTahunCapaianRenstra.jumlah,
            status: status || existingTahunCapaianRenstra.status,
            update_date: new Date(),
          };

          await database("tb_tahun_capaian_renstra").where("id_tahun_capaian_renstra", id_tahun_capaian_renstra)
          .update(updatedTahunCapaianRenstra);

          updatedData.push({
            id_tahun_capaian_renstra,
            ...updatedTahunCapaianRenstra,
          });
        }
      }

      // Update data pada tabel tb_dokumen_renstra
      if (nama_dokumen) {
        for (const dokumenData of nama_dokumen) {
          const { id_dokumen, nama_dokumen, status } = dokumenData;

          const updatedDokumenRenstra = {
            nama_dokumen: nama_dokumen || existingDokumenRenstra.nama_dokumen,
            status: status || existingDokumenRenstra.status,
            update_date: new Date(),
          };

          await database("tb_dokumen_renstra").where("id_dokumen", id_dokumen).update(updatedDokumenRenstra);

          updatedData.push({
            id_dokumen,
            ...updatedDokumenRenstra,
          });
        }
      }
    }

    return res.status(200).json({
      status: 1,
      message: "Berhasil mengubah data",
      updated_data: updatedData,
    });
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


router.get("/bidang-renstra", async (req, res) => {
  try {
    const bidangRenstraList = await database("tb_renstra")
      .distinct("tb_rkat.id_rkat","tb_renstra.id_renstra", "tb_bidang_renstra.nama_bidang")
      .leftJoin(
        "tb_bidang_renstra",
        "tb_renstra.id_bidang_renstra",
        "tb_bidang_renstra.id_bidang_renstra"
      )
      .leftJoin(
        "tb_rkat",
        "tb_renstra.id_renstra",
        "tb_rkat.id_renstra"
      )
      .whereNotNull("tb_renstra.id_bidang_renstra")
      .groupBy("tb_bidang_renstra.nama_bidang");

    if (bidangRenstraList.length > 0) {
      return res.status(200).json({
        status: 1,
        message: "Data ditemukan",
        bidangRenstraList: bidangRenstraList,
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





module.exports = router;