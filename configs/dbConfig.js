const mongoose = require('mongoose');

const connectDB = async ()=>{
    const connect = await mongoose.connect(process.env.DB_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false
    });
    console.log(`connected successfully ${connect.connection.host}`);
}

module.exports = connectDB;