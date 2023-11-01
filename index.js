const express = require('express')
const cors = require('cors')
const route = require('./routes/routes')
const app = express()

app.use(express.json())
app.use(cors())
app.use('/',route)

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
