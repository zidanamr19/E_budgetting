const {check} = require("express-validator")

module.exports.data = [
    check('sebaran_renstra').not().isEmpty().withMessage('sebaran renstra harus ada'),
    
]