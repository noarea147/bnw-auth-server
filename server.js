const express = require('express');

const app = express();
const cors = require('cors');
const config = require('./config/database');
const LOG = require('./common/helpers/logger');

const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());
app.listen(port, () => {
    LOG.info(`ColocQui Authorization Server started on port ${port} [${process.env.NODE_ENV}]`);
});

config();

app.use('/user', require('./user/user.routes'));
app.use('/admin', require('./admin/admin.routes'));
app.use('/', require('./static/static.routes'));