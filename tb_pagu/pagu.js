const express = require("express");
const router = express.Router();
const database = require("../config/database")


router.get("/", async (req, res) => {
  try {
    const paguData = await database("tb_pagu")
      .select("tb_pagu.*", "tb_unit_kerja.nama_unit_kerja")
      .leftJoin("tb_unit_kerja", "tb_pagu.id_unit_kerja", "tb_unit_kerja.id_unit_kerja");

    if (paguData.length > 0) {
      return res.status(200).json({
        status: 1,
        message: "Data PAGU ditemukan",
        pagu_data: paguData,
      });
    } else {
      return res.status(404).json({
        status: 0,
        message: "Data PAGU tidak ditemukan",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message,
    });
  }
});



router.post("/simpan", async (req, res) => {
    const { id_unit_kerja, tahun, jumlah, status } = req.body;
  
    try {
      // Simpan data ke tabel tb_pagu
      const inputPAGU = {
        id_unit_kerja: id_unit_kerja,
        tahun: tahun,
        jumlah : jumlah,
        status: status,
        create_date: new Date(),
        update_date: new Date(),
      };
      const [idPAGU] = await database("tb_pagu").insert(inputPAGU);
  
      return res.status(201).json({
        status: 1,
        message: "Berhasil",
        result: {
          id_pagu: idPAGU,
          ...inputPAGU,
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