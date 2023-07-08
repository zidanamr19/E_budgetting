const express = require("express");
const router = express.Router();
const database = require("../config/database");
const bcrypt = require('bcrypt');

router.post(`/simpan`, async (req,res) =>{
    const data = req.body;
    try {
       const user = await database("tb_unit_kerja").where('user',data.user).first()
       if(user){
        return res.status(400).json({
            status: 0,
            message: "user sudah ada"
        })
       }else{
        const create = {
            ...data,
            password : bcrypt.hashSync(data.password,12)
        }
        const simpan = await database("tb_unit_kerja").insert(create)
        return res.status(200).json({
            status :1,
            message: {
                id_unit_kerja : simpan[0],
                ...create
            }
        })
       }
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        })
    }
});

module.exports = router