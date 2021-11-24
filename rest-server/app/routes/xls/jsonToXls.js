const Excel = require('exceljs');

const convertJsonToXls = (jsonArr, type) => {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet(type);
  if (jsonArr.length > 0) {
    worksheet.columns = Object.keys(jsonArr[0]).map((key) => ({ header: key, key }));
    jsonArr.forEach((row) => {
      worksheet.addRow(row);
    });
  }
  return workbook;
};

module.exports = { convertJsonToXls };
