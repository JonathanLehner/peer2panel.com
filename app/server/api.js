import { WebApp } from 'meteor/webapp';
import express from 'express';

var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

const app = express()
const port = 8080
require('dotenv').config();

app.get('/createPVLimitContract', (req, response) => {
  console.log(req.url)
  var optionsQuerystring = req.url.split('?').pop();

  var options = querystring.parse(optionsQuerystring);

  const code = require('./limitorder')();
  console.log(code);
  console.log(options)

  createPVLimitContract(options['account'], options['price'])
    .then((data) => {
      response.write(JSON.stringify({
        "contractAddress": data
      }));
      response.statusCode = 200;
      response.end();
    })
    .catch((e) => {
      console.log(e);
      response.writeHead(e.status);
      response.write(JSON.stringify({
        "error": e
      }));
      response.end();
    });
})

app.get('/executePVLimitContract', (req, response) => {
  console.log("executePVLimitContract")
  console.log(req.url)
  var optionsQuerystring = req.url.split('?').pop();

  var options = querystring.parse(optionsQuerystring);
  console.log(options)

  const code = require('./limitorder')();
  console.log(code);

  executePVLimitContract(options['address'], options['price'])
    .then((data) => {
      response.write(JSON.stringify({
        "txId": data
      }));
      response.statusCode = 200;
      response.end();
    })
    .catch((e) => {
      console.log(e);
      response.writeHead(e.status);
      response.write(JSON.stringify({
        "error": e
      }));
      response.end();
    });
})

app.get('/createSplitContract', (req, response) => {
  var optionsQuerystring = req.url.split('?').pop();

  var options = querystring.parse(optionsQuerystring);

  require('./split')();

  createSplitContract(options['sender'], options['recipient1'], options['ratio1'], 
    options['recipient2'], options['ratio2'])
    .then((data) => {
      response.write(JSON.stringify({
        "contractAddress": data
      }));
      response.statusCode = 200;
      response.end();
    })
    .catch((e) => {
      console.log(e);
      response.writeHead(e.status);
      response.write(JSON.stringify({
        "error": e
      }));
      response.end();
    });
});

app.get('/executeSplitContract', (req, response) => {
  var optionsQuerystring = req.url.split('?').pop();

  var options = querystring.parse(optionsQuerystring);

  require('./split')();

  executeSplitContract(options['address'], options['amount'])
    .then((data) => {
      response.write(JSON.stringify({
        "txId": data
      }));
      response.statusCode = 200;
      response.end();
    })
    .catch((e) => {
      console.log(e);
      response.writeHead(e.status);
      response.write(JSON.stringify({
        "error": e
      }));
      response.end();
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

WebApp.connectHandlers.use(app);
