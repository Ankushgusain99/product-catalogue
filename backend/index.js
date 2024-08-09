const express=require('express')

const app=express()
const cors=require('cors')
require('dotenv').config()
const port=process.env.PORT || 4000
app.use(cors());
app.use(express.json())
const dbConnect=require('./src/database/connectDb')

dbConnect()

app.listen(port,()=>{
    console.log(`This application is running at port ${port} `)
})

const route=require('./src/routes/allRoutes')
app.use('/api/v1',route)


