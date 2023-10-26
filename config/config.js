const mongoose = require('mongoose')
const db = 'mongodb+srv://abhishekspiral:hjK6Gzd4LDzpO4jG@jwt.w8wpngt.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(db).then(() =>{
console.log('Connected');
}).catch((err)=>console.log('no Connected'));

// mongoose.connect("mongodb://localhost:27017/mkm")