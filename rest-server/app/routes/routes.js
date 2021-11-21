module.exports = (app) => {

  app.get('/export/excel', (req, res) => {
    res.send('200');
  });
};
