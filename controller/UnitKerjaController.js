const m$unit = require('../module/unitKerja.module')

const { Router } = require('express')
const response = require('../helpers/response')

const UnitController = Router()


UnitController.post('/', async (req, res) => {
    const data = await m$unit.createUnit(req.body)

    response.sendResponse(res, data)
})

module.exports = UnitController