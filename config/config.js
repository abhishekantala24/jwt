const mongoose = require('mongoose')
const db = 'mongodb+srv://abhishekspiral:GFVta85INCgj5fhA@jwt.mjupbu1.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(db).then(() =>{
console.log('Connected');
}).catch((err)=>console.log('no Connected',err));

// mongoose.connect("mongodb://localhost:27017/mkm")

// mongodb+srv://abhishekspiral:Fyihg0UbHSS0NDqP@jwt.mjupbu1.mongodb.net/?retryWrites=true&w=majority