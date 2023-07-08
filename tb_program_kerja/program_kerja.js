const express = require("express");
const router = express.Router();
const database = require("../config/database");
const validasi_data = require("./validasi_data")
const verifikasi_validasi_data = require("../middleware/verifikasi_validasi_data")


router.get(`/`, async (req,res) =>{
    try {
        const result = await database
            .select("*")
            .from('tb_program_kerja')
            // .where('status', 'a')
            .modify(function (queryBuilder) {
                if (req.query.cari) {
                    queryBuilder.where('nama_program_kerja','like', `%${req.query.cari}`)
                }
            }).paginate({
                perPage: parseInt(req.query.limit) || 5000,
                currentPage : req.query.page || null,
                isLengthAware: true,
            })
        return res.status(201).json({
            status: 1,
            message: "Berhasil",
            result: result.data,
            per_page: result.pagination ? result.pagination.perPage : null,
            total_pages: req.query.limit ? result.pagination.to : null,
            total_data: req.query.limit ? result.pagination.toal : null
        })
        
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        })
    }
})

router.post(`/simpan`, validasi_data.data,verifikasi_validasi_data, async (req,res) =>{
    const data = req.body
    const input = {
     ...data,
     create_date :  new Date(),
     status : "a"
    } 
    try {
     const simpan = await database("tb_program_kerja").insert(input)
     if(simpan){
         return res.status(200).json({
             status: 1,
             message: "berhasil,",
             result : {
                 id_program_kerja : simpan[0],
                 ...input
             }
         })
     }else{
         return res.status(400).json({
             status : 0,
             message : "gagal"
         })
     }
    } catch (error) {
     return res.status(500).json({
         status : 0,
         message : error.message
     })
    }
 })
 
 module.exports = router