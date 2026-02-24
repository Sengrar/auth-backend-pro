const express = require('express')
const app  = express()
const connectDB = require('./config/db')
require('dotenv').config()
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT

connectDB()

app.use(express.json())
app.use(cookieParser())

app.get('/',(req,res)=>{
res.send("Welcome to Auth backend")
})

app.use('/api/auth',authRoutes)

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})