import mongoose from 'mongoose';

// database connect
const dbConnect = () => {
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then((data) => {
        console.log(`mogodb connected: with server ${data.connection.host}`)
    })
}

export default dbConnect;