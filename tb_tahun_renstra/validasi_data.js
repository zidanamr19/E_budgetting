const {check} = require("express-validator")

module.exports.data = [
    check('nama_tahun').not().isEmpty().withMessage('nama tahun harus ada'),
    check('status').not().isEmpty().withMessage('status harus ada'),
    
]