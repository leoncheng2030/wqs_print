const { Server } = require('socket.io');
const mqtt = require('mqtt');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const printer = require('./printer');

const printer = require('./printer');
io.on('connection', (socket) => {
  console.log('Socket.io 客户端已连接:', socket.id);
  socket.on('print', (data) => {
    // 打印逻辑处理
    console.log('收到打印请求:', data);
    socket.emit('print-result', { status: 'ok', data });
  });
  // 获取打印机列表
  socket.on('get-printers', () => {
    const printers = printer.getPrinters();
    socket.emit('printers-list', printers);
  });
  // 禁用打印机
  socket.on('disable-printer', (printerName) => {
    const result = printer.disablePrinter(printerName);
    socket.emit('printer-disabled', result);
  });
  // 打印渲染预览
  socket.on('render-preview', ({ template, data }) => {
    const preview = printer.renderPreview(template, data);
    socket.emit('preview-result', preview);
  });
});

// MQTT 通信
// Socket.io 通信（仅打印相关接口）
io.on('connection', (socket) => {
  console.log('Socket.io 客户端已连接:', socket.id);
  socket.on('print-text', async ({ data, printerName }) => {
    try {
  const jobID = await printer.printText(data, printerName);
      socket.emit('print-result', { status: 'ok', jobID });
    } catch (err) {
      socket.emit('print-result', { status: 'error', error: err.message });
    }
  });
  socket.on('print-file', async ({ filename, printerName }) => {
    try {
  const jobID = await printer.printFile(filename, printerName);
      socket.emit('print-result', { status: 'ok', jobID });
    } catch (err) {
      socket.emit('print-result', { status: 'error', error: err.message });
    }
  });
  socket.on('get-printers', () => {
  socket.emit('printers-list', printer.getPrinters());
  });
  socket.on('get-default-printer', () => {
  socket.emit('default-printer', printer.getDefaultPrinterName());
  });
  socket.on('get-job', ({ printerName, jobID }) => {
  socket.emit('job-status', printer.getJob(printerName, jobID));
  });
  socket.on('cancel-job', ({ printerName, jobID }) => {
  socket.emit('cancel-result', printer.cancelJob(printerName, jobID));
  });
  socket.on('get-printer', (printerName) => {
  socket.emit('printer-info', printer.getPrinter(printerName));
  });
// MQTT 通信（仅打印相关接口）
const mqttClient = mqtt.connect('mqtt://localhost:1883');
mqttClient.on('connect', () => {
  console.log('MQTT 已连接');
  mqttClient.subscribe('print/text');
  mqttClient.subscribe('print/file');
});
mqttClient.on('message', async (topic, message) => {
  try {
    if (topic === 'print/text') {
      const { data, printerName } = JSON.parse(message.toString());
      const jobID = await printer.printText(data, printerName);
      mqttClient.publish('print/result', JSON.stringify({ status: 'ok', jobID }));
    } else if (topic === 'print/file') {
      const { filename, printerName } = JSON.parse(message.toString());
      const jobID = await printer.printFile(filename, printerName);
      mqttClient.publish('print/result', JSON.stringify({ status: 'ok', jobID }));
    }
  } catch (err) {
    mqttClient.publish('print/result', JSON.stringify({ status: 'error', error: err.message }));
  }
});

// HTTP 通信
app.post('/print', express.json(), (req, res) => {
// MQTT 通信（仅打印相关接口）
const mqttClient = mqtt.connect('mqtt://localhost:1883');
mqttClient.on('connect', () => {
  console.log('MQTT 已连接');
  mqttClient.subscribe('print/text');
  mqttClient.subscribe('print/file');
});
mqttClient.on('message', async (topic, message) => {
  try {
    if (topic === 'print/text') {
      const { data, printerName } = JSON.parse(message.toString());
  const jobID = await printer.printText(data, printerName);
      mqttClient.publish('print/result', JSON.stringify({ status: 'ok', jobID }));
    } else if (topic === 'print/file') {
      const { filename, printerName } = JSON.parse(message.toString());
  const jobID = await printer.printFile(filename, printerName);
      mqttClient.publish('print/result', JSON.stringify({ status: 'ok', jobID }));
    }
  } catch (err) {
    mqttClient.publish('print/result', JSON.stringify({ status: 'error', error: err.message }));
  }
});
  // 打印逻辑处理
  console.log('收到 HTTP 打印请求:', req.body);
// HTTP 通信（标准打印服务接口）
app.use(express.json());

// 打印文本
app.post('/print/text', async (req, res) => {
  const { data, printerName } = req.body;
  try {
    const jobID = await printerCore.printText(data, printerName);
    res.json({ status: 'ok', jobID });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// 打印文件
app.post('/print/file', async (req, res) => {
  const { filename, printerName } = req.body;
  try {
    const jobID = await printerCore.printFile(filename, printerName);
    res.json({ status: 'ok', jobID });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// 获取打印机列表
app.get('/printers', (req, res) => {
  res.json(printer.getPrinters());
});

// 获取默认打印机
app.get('/printer/default', (req, res) => {
  res.json({ defaultPrinter: printer.getDefaultPrinterName() });
});

// 获取打印机详细信息
app.get('/printer/:name', (req, res) => {
  res.json(printer.getPrinter(req.params.name));
});

// 获取打印任务状态
app.use(express.json());

// 打印文本
app.post('/print/text', async (req, res) => {
  const { data, printerName } = req.body;
  try {
    const jobID = await printer.printText(data, printerName);
    res.json({ status: 'ok', jobID });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// 打印文件
app.post('/print/file', async (req, res) => {
  const { filename, printerName } = req.body;
  try {
    const jobID = await printer.printFile(filename, printerName);
    res.json({ status: 'ok', jobID });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// 获取打印机列表
app.get('/printers', (req, res) => {
  res.json(printer.getPrinters());
});

// 获取默认打印机
app.get('/printer/default', (req, res) => {
  res.json({ defaultPrinter: printer.getDefaultPrinterName() });
});

// 获取打印机详细信息
app.get('/printer/:name', (req, res) => {
  res.json(printer.getPrinter(req.params.name));
});

// 获取打印任务状态
app.get('/job', (req, res) => {
  const { printerName, jobID } = req.query;
  res.json(printer.getJob(printerName, jobID));
});

// 取消打印任务
app.post('/job/cancel', (req, res) => {
  const { printerName, jobID } = req.body;
  const result = printer.cancelJob(printerName, jobID);
  res.json({ result });
});

// 禁用打印机
app.post('/printer/disable', express.json(), (req, res) => {
  const { printerName } = req.body;
  const result = printer.disablePrinter(printerName);
  res.json(result);
});

// 打印渲染预览
app.post('/printer/preview', express.json(), (req, res) => {
  const { template, data } = req.body;
  const preview = printer.renderPreview(template, data);
  res.json({ preview });
});
