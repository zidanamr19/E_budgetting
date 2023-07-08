const express = require("express")
const router = express.Router();
const database = require("../config/database")
const validasi_data = require("./validasi_data")
const verifikasi_validasi_data = require("../middleware/verifikasi_validasi_data")

router.get("/all", async (req,res) =>{
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
        update_date: new Date
    }
    try {
        const simpan = await database("tb_renstra").insert(data);
        if(simpan){
            return res.status(200).json({
                status: 1,
                message: "berhasil",
                result: {
                    id_renstra: simpan[0],
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

router.put("/:id_renstra", async (req, res) => {
    try {
      const data = req.body;
      data.update_date = new Date();
  
      const result = await database("tb_renstra")
        .where("id_renstra", req.params.id_renstra)
        .first();
  
      if (result) {
        await database("tb_renstra")
          .where("id_renstra", req.params.id_renstra)
          .update(data);
  
        return res.status(201).json({
          status: 1,
          message: "Berhasil",
        });
      } else {
        return res.status(422).json({
          status: 0,
          message: "Gagal, data tidak ditemukan",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.message,
      });
    }
  });

  router.get("/all", async (req,res) =>{
    try {
        
    } catch (error) {
        return res.status(500).json({
            status : 0,
            message : error.message
        })
    }
})

module.exports = router;