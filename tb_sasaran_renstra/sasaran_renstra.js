const express = require("express")
const router = express.Router();
const database = require("../config/database")

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