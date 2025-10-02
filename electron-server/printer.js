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

module.exports = {
  getPrinters,
  disablePrinter,
  renderPreview
};
