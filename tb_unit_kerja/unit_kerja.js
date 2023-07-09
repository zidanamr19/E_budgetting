const express = require("express");
const router = express.Router();
const database = require("../config/database");
const bcrypt = require('bcrypt');

router.get("/unitkerja/:user", async (req, res) => {
    const user = req.params.user;
  
    try {
      const unitKerja = await database("tb_unit_kerja").where("user", user).limit(1);
  
      if (unitKerja.length > 0) {
        return res.status(200).json({
          status: 1,
          message: "Berhasil",
          result: unitKerja[0],
        });
      } else {
        return res.status(404).json({
          status: 0,
          message: "Data tidak ditemukan",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.message,
      });
    }
  });
  


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