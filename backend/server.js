import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js'
import userRoutes from './routes/userRoutes.js'


const app = express()
const port = 4000

app.use(cors())

//Connect DB
connectDB()

//MiddleWare
app.use(express.json())

app.use('/api/auth', userRoutes)

//Routes
app.get('/', (req,res)=>{
    res.send('API WORKING..!')
})

app.listen(port, ()=>{
    console.log('Server: 4000 - Running - Active')
    console.log(`URL: http://localhost:${port}`)
})
