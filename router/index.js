const express = require("express")
const router = express.Router()

router.use("/proker", require("../tb_program_kerja/program_kerja"))
router.use("/bidang_renstra", require("../tb_bidang_renstra/bidangrenstra"))
router.use("/renstra", require("../tb_renstra/renstra"))
router.use("/unit_kerja", require("../tb_unit_kerja/unit_kerja"))
router.use("/tahun_renstra", require("../tb_tahun_renstra/tahun_renstra"))
router.use("/sasaran", require("../tb_sasaran_renstra/sasaran_renstra"))
router.use("/strategi", require("../tb_strategi_renstra/strategi_renstra"))
router.use("/capaian", require("../tb_tahun capaian_renstra/tahun_capaian"))
router.use("/rkat", require("../tb_rkat/rkat"))
router.use("/pagu", require("../tb_pagu/pagu"))

module.exports= router