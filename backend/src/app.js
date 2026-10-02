const cors = require('cors');
const express = require('express');
const env = require('./config/env');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
