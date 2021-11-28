const jsonToXls = require('./xls/jsonToXls');
const contentDisposition = require('content-disposition');

module.exports = (app) => {

  app.post('/api/export/excel', (req, res) => {
    const fileName = req.body.fileName.toString().replace(/"/gi, '');
    const type = req.body.type.toString().replace(/"/gi, '');
    const jsonArr = JSON.parse(req.body.json);
    const headers = JSON.parse(req.body.headers);
    res.status(200);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', contentDisposition(fileName));
    jsonToXls.convertJsonToXls(jsonArr, headers, type).xlsx.write(res)
      .then(function () {
        res.end();
      });
  });

};
