const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

const port = 3003;
require('./app/routes')(app);
app.listen(port, () => {
  console.log('REST SERVER LISTEN ON PORT: ' + port);
});
