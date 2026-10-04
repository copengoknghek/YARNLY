const cors = require('cors');
const express = require('express');
const env = require('./config/env');
const seed = require('./config/seed');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

seed();

app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
