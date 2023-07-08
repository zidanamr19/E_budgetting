const {check} = require("express-validator")

module.exports.data = [
    check('nama_bidang').not().isEmpty().withMessage('nama bidang harus ada')
]