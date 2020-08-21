//inisialisasi library
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const moment = require("moment")

//implementasi
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//mysql connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "penyewaan_mobil"
})

db.connect(error => {
    if (error) {
        console.log(error.message)
    } else {
        console.log("MySql Connected")
    }
})

//server
app.listen(1000, ()=>{
    console.log("Run on port 1000")
})

//endpoint pertama => akses mobil
app.get("/mobil/:id", (req,res)=>{
    let sql = "select * from mobil"
    db.query(sql, (error, result)=>{
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                mobil:result
            }
        }
        res.json(response)
    })
})

// => menanmbahkan data data penyewaan
app.post("/:penyewaan", (req,res)=>{
    var penyewaan = req.params.penyewaan
    if (penyewaan!= 'mobil' && penyewaan!='pelanggan' && penyewaan!='sewa' && penyewaan!='karyawan') {
        res.json({ket: "Invalid URL"})
    } else if (penyewaan == 'mobil') {
        let data = {
            id_mobil: req.body.id_mobil,
            nomor_mobil: req.body.nomor_mobil,
            merk: req.body.merk,
            jenis: req.body.jenis,
            warna: req.body.warna,
            tahun_pembuatan: req.body.tahun_pembuatan,
            biaya_sewa_perhari: req.body.biaya_sewa_perhari,
            image: req.body.image
        }
        //make query
        let sql = "insert into mobil set ?"
        //run query
        db.query(sql, data, (error,result)=>{
            let response = null
            if (error) {
                response = {
                    message: error.message
                }
            } else {
                response = {
                    message: result.affectedRows + " data inserted"
                }
            }
            res.json(response) //kirim response
        })
    } else if (penyewaan == 'pelanggan') {
        let data = {
            id_pelanggan: req.body.id_pelanggan,
            nama_pelanggan: req.body.nama_pelanggan,
            alamat_pelanggan: req.body.alamat_pelanggan,
            kontrak: req.body.kontrak
        }
        // make query
        let sql = "insert into pelanggan set ?"
        //run
        db.query(sql, data, (error,result)=>{
            let response = null
            if (error) {
                response = {
                    error: error.message
                }
            } else {
                response = {
                    message: result.affectedRows + " data inserted"
                }
            }
            res.json(response)
        })
    } else if (penyewaan == 'sewa') {
        let data = {
            id_sewa: req.body.id_sewa,
            id_mobil: req.body.id_mobil,
            id_karyawan: req.body.id_karyawan,
            id_pelanggan: req.body.id_pelanggan,
            tgl_sewa: req.body.tgl_sewa,
            tgl_kembali: req.body.tgl_kembali,
            total_bayar: req.body.total_bayar
        }
        //make query
        let sql = "insert into sewa set ?"
        //run
        db.query(sql, data, (error, result)=>{
            let response = null
            if (error) {
                response = {
                    error: error.message
                }
            } else {
                response = {
                    message: result.affectedRows + " data inserted"
                }
            }
            res.json(response)
        })
    } else if (penyewaan == 'karyawan') {
        let data = {
            id_karyawan: req.body.id_karyawan,
            nama_karyawan: req.body.nama_karyawan,
            alamat_karyawan: req.body.alamat_karyawan,
            kontrak: req.body.kontrak,
            username: req.body.username,
            password: req.body.password
        }
        // make query
        let sql = "insert into karyawan set ?"
        //run
        db.query(sql, data, (error, result)=>{
            let response = null
            if (error) {
                response = {
                    error: error.message
                }
            } else {
                response = {
                    message: result.affectedRows + " data inserted"
                }
            }
            res.json(response)
        })
    } else {
        
        }{       
            }{        
                }{        
            }{        
        }
    
})



