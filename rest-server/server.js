const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 3003;
require('./app/routes')(app);
app.listen(port, () => {
  console.log('REST SERVER LISTEN ON PORT: ' + port);
});
