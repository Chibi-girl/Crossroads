const mongoose = require('mongoose')
mongoose
    .connect(process.env.BACKEND, { useNewUrlParser: true })
    .then(()=>{
    	console.log('Connected successfully');
    	})
    .catch(e => {
        console.error('Connection error', e.message);
    })
   

const db = mongoose.connection;
module.exports = db
