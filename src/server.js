const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const request = require('request');
const bodyParser = require('body-parser');
const log = require('loglevel');

const app = express();
dotenv.config();
log.setLevel(log.levels.DEBUG);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(), (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Allow-Credentials', true);
  next();
});

app.get('/Tag', (req, res) => {

  request.get({
    url: `${process.env.API_URI}/Tag`,
    headers: {
      'Authorization': `${process.env.API_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, (error, response, body) => {
    if (error) {
      return res.send(error);
    }
    return res.send(body);
  });
});

app.get('/TagRelation', (req, res) => {

  request.get({
    url: `${process.env.API_URI}/TagRelation`,
    headers: {
      'Authorization': `${process.env.API_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, (error, response, body) => {
    if (error) {
      return res.send(error);
    }
    return res.send(body);
  });
});

app.post('/Order', (req, res) => {
  log.debug(req.body);
  return res.send(req.body);

  /*
  request.post({
    url: `${process.env.API_URI}/Order`,
    form: fData,
    headers: {
      'Authorization': `${process.env.API_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, (error, response, body) => {
    if (error) {
      return res.send(error);
    }
    return res.send(body);
  });
  */
});

/*
app.get('/getOrders', function (req, res) {
  request.get({
    url: api + getOrders,
    headers: {
      'Authorization': 'cdd9c3611f802f368eac2d10bc29dce9',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, (error, response, body) => {
    res.send(body);
  });
});

app.get('/createContact', function (req, res) {
  request.post({
    url: api + createContact,
    form: formData,
    headers: {
      'Authorization': 'cdd9c3611f802f368eac2d10bc29dce9',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }, (error, response, body) => {
    if (error) {
      return res.send(error);
    }
    return res.send(body);
  });
});
*/

app.listen(`${process.env.PORT}`, `${process.env.HOST}`, () => {
  console.log(`Express server started. http://${process.env.HOST}:${process.env.PORT}.`);
});
