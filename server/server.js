const express = require('express'),
    bodyParser = require('body-parser'),
    secureEnv = require('secure-env'), //cos we are storing passwords, so need to protect env variables even more
    cors = require('cors'),
    mysql = require('mysql2/promise');

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({limit: '50mb', extended: true})) // limit to prevent hacking, extended true to accept obj & arrs to be encoded into url-encoded format
app.use(bodyParser.json({limit: '50mb'})) //limit size of json files

//integrate with secureEnv
global.env = secureEnv({secret: 'isasecret'})//access the encrypted version of env (.env.enc) to get the values

const APP_PORT= global.env.APP_PORT
const COMMON_NAMESPACE = '/api'

//create pool
const pool = mysql.createPool({
    host:global.env.MYSQL_SERVER,
    port:global.env.MYSQL_SVR_PORT,
    user:global.env.MYSQL_USERNAME,
    password:global.env.MYSQL_PASSWORD,
    database:global.env.MYSQL_SCHEMA,
    connectionLimit:global.env.MYSQL_CON_LIMIT

})

// console.log(pool)

//MYSQL statements 
const queryAllRsvp = 'SELECT * from rsvp;' //* has performance issue if too many columns, so best practice is define columns out
const insertRsvp = 'INSERT INTO rsvp (name, email, phone, status, createdBy, createdDt) values(?,?,?,?,?, CURDATE());' //use backtick `` if u wanna split into sections for easy viewing
//if u are not putting in all the fields of the table u MUST state which fields u are inserting into else cannot get result back


//set up closure function to make calls to db
const makeQuery = (sql, pool) => {
    console.log(sql)
    //return function needs to execute sql statements
    return (async (args) => {
        //init connection
        const conn = await pool.getConnection() //have to wait for connection to do next step
        try{
            let results = await conn.query(sql, args || [])
            return results[0]
        }catch(err){
            console.error(error)
        }
        finally{
            //release connection back to pool
            conn.release() 
        }
    })
}


const findAllRsvp = makeQuery(queryAllRsvp, pool)
const saveOneRsvp = makeQuery(insertRsvp, pool)

//GET /api/rsvps from db
app.get(`${COMMON_NAMESPACE}/rsvps`, (req, resp) =>{
    console.log(`get all rsvp`)
    findAllRsvp([]).then(res => {
        resp.status(200).json(res)
    }).catch(err => {
        console.error("get error", err)
        resp.status(500).json(err)
    })
    //resp.status(200).json({})
})

//POST /api/rsvp
app.post(`${COMMON_NAMESPACE}/rsvp`, (req, resp) =>{
    const bodyValue = req.body
    console.log("body ",bodyValue)
    saveOneRsvp([bodyValue.name, bodyValue.email,
        bodyValue.phone, bodyValue.status, bodyValue.createdBy])
        .then((result) => { 
            resp.status(200).json(result)
        }).catch((error) => {
            resp.status(500).json(error)
    })
    //resp.status(200).json(bodyValue)
})


//start app
app.listen(APP_PORT, ()=>{
    console.log(`Application started on port ${APP_PORT}`)
})