const express = require("express")
const router = express.Router();
const database = require("../config/database")
const validasi_data = require("./validasi_data")
const verifikasi_validasi_data = require("../middleware/verifikasi_validasi_data")

router.get(`/`, async (req,res) =>{
    try {
        const result = await database.select("*").from('tb_sasaran_renstra')
        if(result.length > 0){
            return res.status(200).json({
                status :1,
                message : "Berhasil",
                result : result
            })
        }else{
           return res.status(400).json({
               status : 0,
               message : "Gagal",
          })
        }   
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        })
    }
})

router.delete(`/`, async (req,res) =>{
    try {
        
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        })
    }
})

router.post("/simpan", validasi_data.data,verifikasi_validasi_data, async (req,res) =>{
    const data = req.body
    const input = {
        ...data,
        status: "a",
        create_date: new Date(),
        update_date: new Date()
    }
    try {
        const simpan = await database("tb_sebaran_renstra").insert(data);
        if(simpan){
            return res.status(200).json({
                status: 1,
                message: "berhasil",
                result: {
                    id_sebaran_renstra: simpan[0],
                    ...input
                }
            })
        }else{
            return res.status(400).json({
                status: 0,
                message: "gagal"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        })
    }
})

router.put(`/`, async (req,res) =>{
    try {
        
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        })
    }
})

module.exports = router