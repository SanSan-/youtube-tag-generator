const Excel = require('exceljs');

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

const convertJsonToXls = (type, jsonArr, headers, condFormat) => {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet(type);
  if (jsonArr.length > 0) {
    worksheet.columns = headers ? headers : Object.keys(jsonArr[0]).map((key) => ({ header: key, key }));
    worksheet.autoFilter = headers && headers.length > 1 ? `A1:${alphabet[headers.length - 1]}1` : 'A1';
    condFormat && condFormat.forEach((format) => {
      worksheet.addConditionalFormatting({
        ref: `${format.ref}2:${format.ref}${jsonArr.length + 1}`,
        rules: format.rules
      });
    });
    jsonArr && jsonArr.forEach((row) => {
      worksheet.addRow(row);
    });
  }
  return workbook;
};

module.exports = { convertJsonToXls };
