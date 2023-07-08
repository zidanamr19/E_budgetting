const express = require("express")
const router = express.Router()

router.use("/programkerja", require("../tb_program_kerja/program_kerja"))
router.use("/bidangrenstra", require("../tb_bidang_renstra/bidangrenstra"))
router.use("/renstra", require("../tb_renstra/renstra"))
router.use("/unit_kerja", require("../tb_unit_kerja/unit_kerja"))

module.exports= router