import mongoose from 'mongoose'

export const connectDB = async() =>{
    await mongoose.connect('mongodb+srv://kunchaaditya369:kalviresume123@cluster0.ods2cke.mongodb.net/RESUME')
    .then(()=>{
        console.log('Database: MongoDB - Connected - Active')
    })
}