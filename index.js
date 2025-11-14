//no variable for dotenev because it is not used anywhere else and config() loads .env file contents into process.env
require('dotenv').config()
//variables will bw reused
const express = require('express')
//cross origin resource sharing
const cors = require('cors')
//importing router file to a variable
const router = require('./routing/routing')
//db connection , no need for variable, just it has to run using node mongoose
require('./db/connection')

//server creation
const bookstoreServer=express()



// enable cors protocol in server
bookstoreServer.use(cors())

//js cannot understand json , so parsing is done
bookstoreServer.use(express.json())

//server to use router ,place this after cors, then only control returnd from routing.js back to index.js.
bookstoreServer.use(router)

//create port - 3000 or any other value
const PORT = 3000

//server should listen 
bookstoreServer.listen(PORT,()=>{
    console.log(`Server started at  ${PORT} `);
    
})
//Now run code using 'node,on index.js' in cmd and in localhost:3000 , you can see Cannot GET / , this is because request is not resolved.

//resolving http request ,only get will be seen , no other outputs
bookstoreServer.get('/',(req,res)=>{
    res.status(200).send('<h1> Done</h1>')
})
