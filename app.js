const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { ERROR_NOT_FOUND } = require('./erorrs/erorrs');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodbe');
app.use((req, res, next) => {
  req.user = {
    _id: '6488cefe789ca30d6d26b16e',
  };

  next();
});

app.use(userRoutes);
app.use(cardRoutes);

app.use('/*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Что-то пошло как-то не так' });
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('listen port 3000');
});
