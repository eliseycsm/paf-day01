//1. import node modules
const express = require('express'),
    bodyParser = require('body-parser'),
    secureEnv = require('secure-env'), //cos we are storing passwords, so need to protect env variables even more
    cors = require('cors'),
    mysql = require('mysql2/promise');

//2. instantiate express
const app = express()

//3. initialize all relevant params for express middleware
//3a. use cors as we are loading Ng from 4200 port and calling to 3000port for express
app.use(cors())
//3b. use bodyParser 
//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
/* urlencoded([options])
Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option. 
This parser accepts only UTF-8 encoding of the body and supports automatic inflation of gzip and deflate encodings */
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})) // limit to prevent hacking via receiving virus, extended true to accept obj & arrs to be encoded into url-encoded format
app.use(bodyParser.json({limit: '50mb'})) //limit size of json files, Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option. 

//4. integrate with secureEnv
global.env = secureEnv({secret: 'isasecret'})//decrypt the encrypted version of env (.env.enc) to get the values
/* before 4, 
- create .env file to store & set env variables with values
- create .env.sample file to store only env variables (w/o setting values), so that others who use app know what vars to set
- use npx (npm extension) in CLI as such: npx secure-env -s isasecret 
* -s is to set the hash using the key ("isasecret") set
- .env.enc (encrypted file) is created and ready to use as above(.env can be deleted)
*/

//5. get port var from secureEnv
const APP_PORT= global.env.APP_PORT
const COMMON_NAMESPACE = '/api'

//6. create Mysql connection pool & se up params
const pool = mysql.createPool({
    host:global.env.MYSQL_SERVER,
    port:global.env.MYSQL_SVR_PORT,
    user:global.env.MYSQL_USERNAME,
    password:global.env.MYSQL_PASSWORD,
    database:global.env.MYSQL_SCHEMA,
    connectionLimit:global.env.MYSQL_CON_LIMIT

})

// console.log(pool)

//7. construct MYSQL statements - select all rsvps & insert one record
const queryAllRsvp = 'SELECT * from rsvp;' //* has performance issue if too many columns, so best practice is define columns out
const insertRsvp = 'INSERT INTO rsvp (name, email, phone, status, createdBy, createdDt) values(?,?,?,?,?, CURDATE());' //use backtick `` if u wanna split into sections for easy viewing
//if u are not putting in all the fields of the table u MUST state which fields u are inserting into else cannot get result back


//8. establish connection, take in params and query to db
//done via set up currying function to make calls to db
const makeQuery = (sql, pool) => {
    console.log(sql)

    return (async (args) => {
        //init connection
        const conn = await pool.getConnection() //have to wait for connection to do next step
        try{
            let results = await conn.query(sql, args || []) //results returned as [result, metadata]
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

// 9. Create the closure function for the end point to
// perform crud operation against the database
const findAllRsvp = makeQuery(queryAllRsvp, pool)
const saveOneRsvp = makeQuery(insertRsvp, pool)


// 10. end point that return all rsvp
// invoke the findAllRsvp closure function 
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

// 11. end point that insert one record to the rsvp table
// capture the values from the http request object
// invoke the saveOneRsvp closure function 
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


// started the process of app listening to
// port retrieve from env var.
app.listen(APP_PORT, ()=>{
    console.log(`Application started on port ${APP_PORT}`)
})