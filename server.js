const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('./Middleware/jwt')
const config = require('./config/database');
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());
app.listen(port, () => {
    console.log('Server started on port ' + port);
});

config();

app.use('/token', require('./Token/token.routes'));

