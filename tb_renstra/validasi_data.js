const {check} = require("express-validator")

module.exports.data = [
    check('tahun').not().isEmpty().withMessage('tahun harus ada'),
    check('program').not().isEmpty().withMessage('program harus ada'),
    check('indikator').not().isEmpty().withMessage('indikator harus ada'),
    check('tujuan').not().isEmpty().withMessage('tujuan harus ada'),
    check('kondisi_existing').not().isEmpty().withMessage('kondisi existing harus ada'),
    check('baseline').not().isEmpty().withMessage('baseline harus ada'),
    check('stadart_ditetapkan').not().isEmpty().withMessage('standart ditetapkan harus ada'),
]