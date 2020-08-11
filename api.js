//inisialisasi library
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")

//implementasi nya
const app =  express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//membuat mysql connection
const db = mysql.createConnection({
    host: "localthost",
    user: "root",
    password: "",
    database: "pelanggaran_siswa"
})

db.connect(error => {
    if (error) {
        console.log(error.message)
    } else {
        console.log("MySql Connected")
    }
})

//endpoint akses data siswa mengguankan method GET
app.get("/siswa", (req,res)=>{
    //buat query sql
    let sql = "select * from siswa"
    // run query
    db.query(sql, (error, result)=>{
        let response = null
        if (error){
            response = {
                message: error.message //tampilpesan error
            }
        } else {
            response = {
                count: result.length, //tmpil jmlah data
                siswa: result // isi data
            }
        }
        res.json(response) //mengirim response
    })
})

//endpoint akses data siswa berdasarkan id menggunakan method GET
app.get("/siswa/:id", (req,res)=>{
    let data = {
        id_siswa: req.params.id
    }
    //buat sql query
    let sql = "select * from siswa where ? ";

    //run query
    db.query(sql, data, (error, result)=>{
        let response = null
        if (error) {
            response = {
                message: error.message //pesan error
            }
        } else {
            response = {
                count: result.length, //jumlah data
                siswa: result //isi data
            }
        }
        res.json(response) //send response
    })
})

// --> endpoint menyimpan data siswa method POST
app.post("/siswa", (req,res)=>{
    //prepare data
    let data = {
        nis: req.body.nis,
        nama_siswa: req.body.nama_siswa,
        kelas: req.body.kelas,
        poin: req.body.poin
    }
    //buat sql query insert
    let sql = "inser into siswa set ?"

    //run query
    db.query(sql, data, (error, result)=>{
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
})

//endpoint mengubah data siswa menggunakan method put
app.put("/siswa", (req,res)=>{
    //prepare data
    let data = [
        //data
        {
            nis: req.body.nis,
            nama_siswa: req.body.nama_siswa,
            kelas: req.body.kelas,
            poin: req.body.poin
        },
        //parameter (primary key)
        {
            id_siswa : req.body.id_siswa
        }
    ]
    //buat query update
    let sql = "update siswa set ? where ?"
    // run query
    db.query(sql, data, (error, result)=>{
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data update"
            }
        }
        res.json(response) //kirim response
    })
})

// menghapus data menggunakan method DELETE

// ---> endpoint menghapus data siswa berdasarkan id_siswa
app.delete("/siswa/:id", (req,res)=>{
    //prepare data
    let data = {
        id_siswa: req.params.id
    }
    //buat query sql del
    let sql = "delete from siswa where ?"

    //run query
    db.query(sql, data, (error, result)=>{
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
            message: result.affectedRows + " data deleted"
            }
        }
        res.json(response) //kirim response
    })
})

//port
app.listen(8000, () => {
    console.log("Run on port 8000")
})


