/* eslint-disable no-console */
require('dotenv').config();

const logger = require('winston');
const app = require('./app');
//const https = require('https');
const port = app.get('port');
//const fs = require('fs');
const server = app.listen(port);

// const server = https.createServer({
//   key: fs.readFileSync('./devcerts/server.key'),
//   cert: fs.readFileSync('./devcerts/server.cert')
// }, app).listen(port);

process.on('unhandledRejection', (reason) =>
  logger.error('Unhandled Rejection at: Promise ', reason)
);

// Call app.setup to initialize all services and SocketIO
app.setup(server);


server.on('listening', () =>
  logger.info(`Feathers application started on ${app.get('host')}:${port}`)
);
