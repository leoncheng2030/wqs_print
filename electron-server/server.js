const { Server } = require('socket.io');
const mqtt = require('mqtt');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const printer = require('./printer');

// Socket.io 通信
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
const mqttClient = mqtt.connect('mqtt://localhost:1883');
mqttClient.on('connect', () => {
  console.log('MQTT 已连接');
  mqttClient.subscribe('print/request');
});
mqttClient.on('message', (topic, message) => {
  if (topic === 'print/request') {
    // 打印逻辑处理
    console.log('收到 MQTT 打印请求:', message.toString());
    mqttClient.publish('print/result', JSON.stringify({ status: 'ok', message: message.toString() }));
  }
});

// HTTP 通信
app.post('/print', express.json(), (req, res) => {
  // 打印逻辑处理
  console.log('收到 HTTP 打印请求:', req.body);
  res.json({ status: 'ok', data: req.body });
});

// 获取打印机列表
app.get('/printers', (req, res) => {
  const printers = printer.getPrinters();
  res.json(printers);
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

server.listen(3000, () => {
  console.log('服务已启动，端口 3000');
});
