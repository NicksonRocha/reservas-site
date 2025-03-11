
const Product = require('./models/Product')
const Business = require('./models/Business')
const User = require('./models/User')
const ProductImage = require('./models/ProductImage')
const Album = require('./models/Album')
const Booking = require('./models/Booking')
const BookingCode = require('./models/BookingCode')
const Notification = require('./models/Notification')
const NotificationBusiness = require('./models/NotificationBusiness')

const express = require('express')
const app = express()
const conn = require('./db/conn')
const path = require("path")
const cors = require('cors')
const cookieParser = require('cookie-parser'); 

app.use(cookieParser());

require("dotenv").config()
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(cors({credentials: true, origin: 'http://localhost:3000'}))


const router = require("./routes/router")
app.use(router);

conn
.sync({ alter: true })
    .then(() => {
        app.listen(port, () => {
            console.log(`App rodando na porta ${port}`)
        })
    }).catch((err) => console.log(err))
