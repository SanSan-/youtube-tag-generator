const jsonToXls = require('./xls/jsonToXls');

module.exports = (app) => {

  app.post('/api/export/excel', (req, res) => {
    const fileName = req.body.fileName.toString().replace(/"/gi, '');
    const type = req.body.type.toString().replace(/"/gi, '');
    const jsonArr = JSON.parse(req.body.json);
    res.status(200);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}";`);
    jsonToXls.convertJsonToXls(jsonArr, type).xlsx.write(res)
      .then(function () {
        res.end();
      });
  });

};
