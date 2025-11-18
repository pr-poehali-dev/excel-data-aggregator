import ExcelJS from 'exceljs';

interface KS2Item {
  id: number;
  code: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
  object: string;
}

interface KS2ReportData {
  reportName: string;
  reportPeriod: string;
  contractor: string;
  customer: string;
  contract: string;
  items: KS2Item[];
}

export async function generateKS2Excel(data: KS2ReportData): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('КС-2');

  worksheet.properties.defaultRowHeight = 18;
  worksheet.properties.defaultColWidth = 12;

  worksheet.columns = [
    { width: 8 },
    { width: 35 },
    { width: 10 },
    { width: 12 },
    { width: 15 },
    { width: 18 },
    { width: 15 }
  ];

  let currentRow = 1;

  worksheet.mergeCells(`A${currentRow}:G${currentRow}`);
  const titleCell = worksheet.getCell(`A${currentRow}`);
  titleCell.value = 'АКТ О ПРИЕМКЕ ВЫПОЛНЕННЫХ РАБОТ';
  titleCell.font = { bold: true, size: 14, name: 'Arial' };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  currentRow += 1;

  worksheet.mergeCells(`A${currentRow}:G${currentRow}`);
  const formCell = worksheet.getCell(`A${currentRow}`);
  formCell.value = 'Форма КС-2';
  formCell.font = { size: 11, name: 'Arial' };
  formCell.alignment = { horizontal: 'center', vertical: 'middle' };
  currentRow += 2;

  const infoData = [
    ['Заказчик:', data.customer],
    ['Подрядчик:', data.contractor],
    ['Договор:', data.contract],
    ['Период:', data.reportPeriod],
    ['Название отчета:', data.reportName]
  ];

  infoData.forEach(([label, value]) => {
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    const labelCell = worksheet.getCell(`A${currentRow}`);
    labelCell.value = label;
    labelCell.font = { bold: true, size: 10, name: 'Arial' };
    
    worksheet.mergeCells(`C${currentRow}:G${currentRow}`);
    const valueCell = worksheet.getCell(`C${currentRow}`);
    valueCell.value = value;
    valueCell.font = { size: 10, name: 'Arial' };
    
    currentRow += 1;
  });

  currentRow += 1;

  const headerRow = currentRow;
  const headers = [
    '№ п/п',
    'Наименование работ и затрат',
    'Ед. изм.',
    'Количество',
    'Цена за ед., руб.',
    'Стоимость, руб.',
    'Объект'
  ];

  headers.forEach((header, index) => {
    const cell = worksheet.getCell(headerRow, index + 1);
    cell.value = header;
    cell.font = { bold: true, size: 10, name: 'Arial' };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  currentRow += 1;

  const dataStartRow = currentRow;
  data.items.forEach((item, index) => {
    const row = worksheet.getRow(currentRow);
    
    row.getCell(1).value = index + 1;
    row.getCell(2).value = `${item.code} ${item.name}`;
    row.getCell(3).value = item.unit;
    row.getCell(4).value = item.quantity;
    row.getCell(5).value = item.price;
    row.getCell(6).value = { formula: `D${currentRow}*E${currentRow}` };
    row.getCell(7).value = item.object;

    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.font = { size: 10, name: 'Arial' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { vertical: 'middle' };
    });

    row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(3).alignment = { horizontal: 'center', vertical: 'middle' };
    row.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
    row.getCell(5).alignment = { horizontal: 'right', vertical: 'middle' };
    row.getCell(6).alignment = { horizontal: 'right', vertical: 'middle' };
    row.getCell(7).alignment = { horizontal: 'center', vertical: 'middle' };

    row.getCell(4).numFmt = '#,##0.00';
    row.getCell(5).numFmt = '#,##0.00';
    row.getCell(6).numFmt = '#,##0.00';

    currentRow += 1;
  });

  const totalRow = worksheet.getRow(currentRow);
  worksheet.mergeCells(`A${currentRow}:E${currentRow}`);
  const totalLabelCell = totalRow.getCell(1);
  totalLabelCell.value = 'ИТОГО:';
  totalLabelCell.font = { bold: true, size: 10, name: 'Arial' };
  totalLabelCell.alignment = { horizontal: 'right', vertical: 'middle' };

  const totalCell = totalRow.getCell(6);
  totalCell.value = { formula: `SUM(F${dataStartRow}:F${currentRow - 1})` };
  totalCell.font = { bold: true, size: 11, name: 'Arial' };
  totalCell.numFmt = '#,##0.00';
  totalCell.alignment = { horizontal: 'right', vertical: 'middle' };

  totalRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' }
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
  });

  currentRow += 2;

  const signatureData = [
    ['Подрядчик:', '', 'Заказчик:', ''],
    ['', '(подпись)', '', '(подпись)'],
    ['', '', '', '']
  ];

  signatureData.forEach((rowData) => {
    const row = worksheet.getRow(currentRow);
    rowData.forEach((value, colIndex) => {
      const cell = row.getCell(colIndex + 1);
      cell.value = value;
      cell.font = { size: 9, name: 'Arial' };
      if (value === '(подпись)') {
        cell.alignment = { horizontal: 'center' };
      }
    });
    currentRow += 1;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
}

export function downloadKS2Excel(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
