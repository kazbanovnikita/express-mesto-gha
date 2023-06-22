/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const defaultError = require('./middlewares/defaultError');
const router = require('./routes');

const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodbe');

app.use(router);

app.use(errors());
app.use(defaultError);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listen port 3000');
});
