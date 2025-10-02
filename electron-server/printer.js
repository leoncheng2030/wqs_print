const os = require('os');

const Printer = require('printer');

// 获取打印机列表（集成 printer 库）
function getPrinters() {
  try {
    const printers = Printer.getPrinters();
    // 可根据实际需求扩展 status/disabled 字段
    return printers.map(p => ({
      name: p.name,
      status: p.status || 'unknown',
      disabled: false
    }));
  } catch (err) {
    return [];
  }
}

// 禁用打印机
function disablePrinter(printerName) {
  // 实际应保存禁用状态到配置或数据库
  return { name: printerName, disabled: true };
}

// 打印渲染预览（示例）
function renderPreview(template, data) {
  // 实际可集成模板渲染引擎
  return `<div>预览: ${template} - ${JSON.stringify(data)}</div>`;
}

// 获取默认打印机名称
function getDefaultPrinterName() {
  try {
    return Printer.getDefaultPrinterName();
  } catch (err) {
    return null;
  }
}

// 打印文本内容
function printText(data, printerName) {
  return new Promise((resolve, reject) => {
    Printer.printDirect({
      data,
      printer: printerName || getDefaultPrinterName(),
      type: 'RAW',
      success: jobID => resolve(jobID),
      error: err => reject(err)
    });
  });
}

// 打印文件（如 PDF）
function printFile(filename, printerName) {
  return new Promise((resolve, reject) => {
    Printer.printFile({
      filename,
      printer: printerName || getDefaultPrinterName(),
      success: jobID => resolve(jobID),
      error: err => reject(err)
    });
  });
}

// 获取打印任务状态
function getJob(printerName, jobID) {
  try {
    return Printer.getJob(printerName, jobID);
  } catch (err) {
    return null;
  }
}

// 取消打印任务
function cancelJob(printerName, jobID) {
  try {
    Printer.setJob(printerName, jobID, 'CANCEL');
    return true;
  } catch (err) {
    return false;
  }
}

// 获取打印机详细信息
function getPrinter(printerName) {
  try {
    return Printer.getPrinter(printerName);
  } catch (err) {
    return null;
  }
}

module.exports = {
  getPrinters,
  getDefaultPrinterName,
  printText,
  printFile,
  getJob,
  cancelJob,
  getPrinter,
  disablePrinter,
  renderPreview
};
