//inisialisasi library
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const moment = require("moment")

//implementasi nya
const app =  express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//membuat mysql connection
const db = mysql.createConnection({
    host: "localhost",
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
    let sql = "insert into siswa set ?"

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

//endpoint tambah data pelanggaran siswa
app.post("/pelanggaran_siswa", (req,res)=>{
    //prepeara data to pelanggaran siswa
    let data = {
        id_siswa: req.body.id_siswa,
        id_user: req.body.id_user,
        waktu: moment().format('YYYY-MM-DD HH:mm:ss')// gt current time
    }
    //parse => json
    let pelanggaran = JSON.parse(req.body.pelanggaran)

    //buat query insert to pelanggaran siswa
    let sql = "insert into pelanggaran_siswa set ?"

    //run
    db.query(sql, data, (error, result)=>{
        let response = null
        if (error) {
            res.json({message:error.message})
        } else {
            //get last insert id_pelanggaran
            let lastID = result.insertID

            //prepare datda to detail pelanggarna
            let data = []
            for (let index = 0; index < pelanggaran.length; index++) {
                data.push([
                    lastID, pelanggaran[index].id_pelanggaran
                ])
            }
            //buat query insert detain pelanggaran
            let sql = "insert into detail_pelanggaran_siswa values ?"
            db.query(sql, [data], (error, result) =>{
                if (error) {
                    res.json({message: error.message})
                } else {
                    res.json({message: "Data has been inserted"})
                }
            })
        }
    })
})

// end-point menampilkan data pelanggaran siswa
app.get("/pelanggaran_siswa", (req,res) => {
    // create sql query
    let sql = "select p.id_pelanggaran_siswa, p.id_siswa,p.waktu, s.nis, s.nama_siswa, p.id_user, u.nama_user " +
     "from pelanggaran_siswa p join siswa s on p.id_siswa = s.id_siswa " +
     "join user u on p.id_user = u.id_user"

    // run query
    db.query(sql, (error, result) => {
        if (error) {
            res.json({ message: error.message})   
        }else{
            res.json({
                count: result.length,
                pelanggaran_siswa: result
            })
        }
    })
})

// end-point untuk menampilkan detail pelanggaran
app.get("/pelanggaran_siswa/:id_pelanggaran_siswa", (req,res) => {
    let param = { id_pelanggaran_siswa: req.params.id_pelanggaran_siswa}

    // create sql query
    let sql = "select p.nama_pelanggaran, p.poin " + 
    "from detail_pelanggaran_siswa dps join pelanggaran p "+
    "on p.id_pelanggaran = dps.id_pelanggaran " +
    "where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({ message: error.message})   
        }else{
            res.json({
                count: result.length,
                detail_pelanggaran_siswa: result
            })
        }
    })
})

// end-point untuk menghapus data pelanggaran_siswa
app.delete("/pelanggaran_siswa/:id_pelanggaran_siswa", (req, res) => {
    let param = { id_pelanggaran_siswa: req.params.id_pelanggaran_siswa}

    // create sql query delete detail_pelanggaran
    let sql = "delete from detail_pelanggaran_siswa where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({ message: error.message})
        } else {
            let param = { id_pelanggaran_siswa: req.params.id_pelanggaran_siswa}
            // create sql query delete pelanggaran_siswa
            let sql = "delete from pelanggaran_siswa where ?"

            db.query(sql, param, (error, result) => {
                if (error) {
                    res.json({ message: error.message})
                } else {
                    res.json({message: "Data has been deleted"})
                }
            })
        }
    })

})


//port
app.listen(8000, () => {
    console.log("Run on port 8000")
})


