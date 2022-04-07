const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const logger = require('winston');
const { Loggly } = require('winston-loggly-bulk');


const loggingLayer = process.env.LOGGING_LAYER || 'console';
console.log('LOGGING_LAYER', loggingLayer);

if (loggingLayer === 'loggly') {
  logger.add(new Loggly({
    token: process.env.LOGGLY_TOKEN,
    subdomain: process.env.LOGGLY_SUB_DOMAIN,
    tags: process.env.LOGGLY_APP_NAME || 'Backend-core',
    json: true
  }));
}else{
  logger.add(new logger.transports.Console({
    format: logger.format.prettyPrint(),
  }));

  // collect all the logs under error
  logger.add(new logger.transports.File({ filename: 'app.log' }));
}


const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const configuration = require('@feathersjs/configuration');
const rest = require('@feathersjs/express/rest');

const handler = require('@feathersjs/express/errors');
const notFound = require('@feathersjs/errors/not-found');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const knex = require('./knex');

const gmaps = require('./gmaps');

const swagger = require('feathers-swagger');

const authentication = require('../authentication/authentication');

const customQueryParser = require('./custom-query-parser');

const app = express(feathers());

app.set('query parser', customQueryParser); //this only works on this line

// eslint-disable-next-line no-unused-vars
const genMockData = require('./generate-mock-data');

const genRootAcc = require('./generate-root-acc');


const SegfaultHandler = require('segfault-handler');
SegfaultHandler.registerHandler('crash.log');

// this loads the ./config/default.json variables
app.configure(configuration());


if (process.env.NODE_ENV === 'development') {
  logger.info(`STARTING IN DEVELOPMENT MODE!`);
  //documentation :
  app.configure(swagger({
    docsPath: '/docs',
    uiIndex: path.join(__dirname, 'docs.html'),
    info: {
      title: 'Backend CORE',
      description: 'API documentation'
    }
  }));
}

// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());

app.use(bodyParser.json({limit: '40mb'}));
app.use(bodyParser.urlencoded({
  limit: '40mb',
  extended: true
}));

app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));
app.use('/download-invoice', express.static(path.join(__dirname, '/invoices')));
app.configure(knex);
app.configure(gmaps);
app.configure(rest());
app.configure(authentication);



app.use(function(req, res, next) {
  req.feathers.requestor_ip = req.ip;
  next();
})
// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Configure a middleware for 404s and the error handler
app.use(notFound());
app.use(handler());



app.hooks(appHooks);


genRootAcc(app);

// Mock data
if(process.env.NODE_ENV === 'development')
{
  //genMockData(app);
}


module.exports = app;
