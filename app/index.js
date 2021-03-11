const express = require('express');
const api = require('./app');
const app = express();

app.use(express.static("client"));
app.use('/api/', api);
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '../client/index.html');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});