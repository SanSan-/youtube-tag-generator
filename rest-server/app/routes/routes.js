module.exports = (app) => {

  app.get('/api/export/excel', (req, res) => {
    res.send('200');
  });
};
