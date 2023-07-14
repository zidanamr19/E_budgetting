const express = require("express");
const router = express.Router();
const database = require("../config/database");
const bcrypt = require('bcrypt');

router.get(`/`, async (req,res) =>{
  try {
      const result = await database.select("*").from('tb_unit_kerja')
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