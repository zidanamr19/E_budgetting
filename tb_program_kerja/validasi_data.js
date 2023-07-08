const {check} = require("express-validator")

module.exports.data = [
    check('nama_program_kerja').not().isEmpty().withMessage('nama program kerja harus ada')
]