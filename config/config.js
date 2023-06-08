const mongoose = require('mongoose')
const db = 'mongodb+srv://vipulspiral:ugWp1xwiiLoGuPjQ@cluster0.xmwkubn.mongodb.net/mkm?retryWrites=true&w=majority'
mongoose.connect(db).then(() =>{
console.log('Connected');
}).catch((err)=>console.log('no Connected'));

// mongoose.connect("mongodb://localhost:27017/mkm")