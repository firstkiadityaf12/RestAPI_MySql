//inisialisasi library
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")

// inisialisasi
const md5 = require("md5")
const Cryptr = require("cryptr")
const crypt = new Cryptr("098765")

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

//validate token
validateToken = () => {
    return (req,res, next) => {
        //cek keberadaan "token" pada request header
        if (!req.get("Token")) {
            //jika token tidak ada
            res.json({ message:"Access Forbidden"})
        } else {
            // tampung nilai Token
            let token  = req.get("Token")
            
            // decrypt token menjadi id_user
            let decryptToken = crypt.decrypt(token)

            // sql cek id_user
            let sql = "select * from karyawan where ?"

            // set parameter
            let param = { id_karyawan: decryptToken}

            // run query
            db.query(sql, param, (error, result) => {
                if (error) throw error
                 // cek keberadaan id_user
                if (result.length > 0) {
                    // id_user tersedia
                    next()
                } else {
                    // jika user tidak tersedia
                    res.json({
                        message: "Invalid Token"
                    })
                }
            })
        }
    }
}

//endpoint proses authentication karyawan
app.post("/karyawan/auth", (req,res)=>{
    //tampung username dan password
    let param = [
        req.body.username, //username
        md5(req.body.password) //password
    ]
    //query
    let sql = "select * from user where username = ? and password = ?"
    //run
    db.query(sql, param,(error,result)=>{
        if (error) throw error
        if (result.length > 0) {
            //user tersedia
            res.json({
                message: "logged",
                token: crypt.encrypt(result[0].id_karyawan), //generate token
                data: result
            })
        } else {
            // user tidak tersedia
            res.json({
                message: "Invalid username/password"
            })
        }
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

//endpoint get all
app.get("/:penyewaan",validateToken(), (req,res)=>{
    var penyewaan = req.params.penyewaan
    if (penyewaan!='mobil'&&penyewaan!='sewa'&&penyewaan!='pelanggan'&&penyewaan!='karyawan') {
        res.json({ket: 'Parameter salah'})
    } else if (penyewaan == 'sewa') {
        //buat query
        let sql = "select id_sewa,p.id_mobil, p.id_pelanggan,p.id_karyawan,p.tgl_sewa, p.tgl_kembali, p.total_bayar, s.nama_karyawan, t.nama_pelanggan, u.nomor_mobil, u.merk " + "from sewa p INNER JOIN mobil u ON p.id_mobil = u.id_mobil " + "INNER JOIN pelanggan t ON p.id_pelanggan = t.id_pelanggan" + " INNER JOIN karyawan s ON p.id_karyawan = s.id_karyawan"
        //run
        db.query(sql, (error,result)=>{
            if (error) {
                res.json({message: error.message})
            } else {
                res.json({
                    count: result.length,
                    sewa: result
                })
            }
        })
    } else {
        let sql = "select * from " + penyewaan
        db.query(sql, (error,result)=>{
            let response = null
            if (error) {
                response = {
                    error: error.message
                }
            } else {
                response = {
                    count: result.length,
                    penyewaan:result
                }
            }
            res.json(response)
        })
    }{      
    }
})

// end-point GET by ID => mobil
app.get("/mobil/:id", (req,res)=>{
    let data = {
        id_mobil : req.params.id
    }
    //query
    let sql = " select * from mobil where ?";
    //run
    db.query(sql, data,(error,result)=>{
        let response = null;
        if (error) {
            response = {
                //pesan error
                message: error.message
            }
        } else {
            response = {
                //jumlah data
                count: result.length,
                mobil: result
            }
        }
        res.json(response)// send response
    })
})

// end-point GET by ID => karyawan
app.get("/karyawan/:id", (req,res)=>{
    let data = {
        id_karyawan : req.params.id
    }
    //query
    let sql = " select * from karyawan where ?";
    //run
    db.query(sql, data,(error,result)=>{
        let response = null;
        if (error) {
            response = {
                //pesan error
                message: error.message
            }
        } else {
            response = {
                //jumlah data
                count: result.length,
                karyawan: result
            }
        }
        res.json(response)// send response
    })
})

// end-point GET by ID => pelanggan
app.get("/pelanggan/:id", (req,res)=>{
    let data = {
        id_pelanggan : req.params.id
    }
    //query
    let sql = " select * from pelanggan where ?";
    //run
    db.query(sql, data,(error,result)=>{
        let response = null;
        if (error) {
            response = {
                //pesan error
                message: error.message
            }
        } else {
            response = {
                //jumlah data
                count: result.length,
                pelanggan: result
            }
        }
        res.json(response)// send response
    })
})

// end-point GET by ID => sewa
app.get("/sewa/:id", (req,res)=>{
    let data = {
        id_sewa : req.params.id
    }
    //query
    let sql = " select * from sewa where ?";
    //run
    db.query(sql, data,(error,result)=>{
        let response = null;
        if (error) {
            response = {
                //pesan error
                message: error.message
            }
        } else {
            response = {
                //jumlah data
                count: result.length,
                sewa: result
            }
        }
        res.json(response)// send response
    })
})

//endpoint put
app.put('/:penyewaan',(req,res)=>{
    var penyewaan = req.params.penyewaan
    if (penyewaan!='mobil'&&penyewaan!='karyawan'&&penyewaan!='pelanggan'&&penyewaan!='sewa') {
        res.json({ket: 'parameter salah'})
    } else if (penyewaan == 'pelanggan') { //jika pelanggan
        let data = [{
            nama_pelanggan: req.body.nama_pelanggan,
            alamat_pelanggan: req.body.alamat_pelanggan,
            kontrak: req.body.kontrak
        },{
            //primary key
            id_pelanggan: req.body.id_pelanggan
        }]
        //query
        let sql = "update pelanggan set ? where ?"
        //run
        db.query(sql, data,(error,result)=>{
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
            res.json(response)
        })
    } else if (penyewaan == 'karyawan') {
        let data = [{
            nama_karyawan: req.body.nama_karyawan,
            alamat_karyawan: req.body.alamat_karyawan,
            kontrak: req.body.kontrak,
            username: req.body.username,
            password: req.body.password
        },{
            //primary key
            id_karyawan: req.body.id_karyawan
        }]
        //query
        let sql = "update karyawan set ? where ?"
        //run
        db.query(sql, data,(error,result)=>{
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
            res.json(response)
        })
    } else if (penyewaan == 'mobil') {
        let data = [{
            nomor_mobil: req.body.nomor_mobil,
            merk: req.body.mobil,
            jenis: req.body.jenis,
            warna: req.body.jenis,
            tahun_pembuatan: req.body.tahun_pembuatan,
            biaya_sewa_perhari: req.body.biaya_sewa_perhari,
            image: req.body.image
        },{
            //primary key
            id_mobil: req.body.id_mobil
        }]
        //query
        let sql = "update mobil set ? where ?"
        //run
        db.query(sql, data,(error,result)=>{
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
            res.json(response)
        })
    } else {     
                }{        
            }{
        }{        
    }
})

// end point delete => mobil
app.delete("/mobil/:id",(req,res)=>{
    //prepare data
    let data = {
        id_mobil: req.params.id_mobil
    }
    //query
    let sql = "delete from mobil where ?"
    //run
    db.query(sql, data,(error,result)=>{
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
        res.json(response)//kirim response
    })
})

// end point delete => karyawan
app.delete("/karyawan/:id",(req,res)=>{
    //prepare data
    let data = {
        id_karyawan: req.params.id_karyawan
    }
    //query
    let sql = "delete from karyawan where ?"
    //run
    db.query(sql, data,(error,result)=>{
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
        res.json(response)//kirim response
    })
})

// end point delete => pelanggan
app.delete("/pelanggan/:id",(req,res)=>{
    //prepare data
    let data = {
        id_pelanggan: req.params.id_pelanggan
    }
    //query
    let sql = "delete from pelanggan where ?"
    //run
    db.query(sql, data,(error,result)=>{
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
        res.json(response)//kirim response
    })
})

// end point delete => sewa
app.delete("/sewa/:id",(req,res)=>{
    //prepare data
    let data = {
        id_sewa: req.params.id_sewa
    }
    //query
    let sql = "delete from sewa where ?"
    //run
    db.query(sql, data,(error,result)=>{
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
        res.json(response)//kirim response
    })
})
