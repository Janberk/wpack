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

app.get('/Order/Factory/getNextOrderNumber', (req, res) => {

  request.get({
    url: `${process.env.API_URI}/Order/Factory/getNextOrderNumber?orderType=LI&useNextNumber=true`,
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

  const formData = prepareFormData(req);

  request.post({
    url: `${process.env.API_URI}/Order`,
    form: formData,
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

function prepareFormData(req) {

  const nextOrderNumber = req.body.nextOrderNumber;
  const contact = req.body.contact;
  const contactId = req.body.contactId;
  const address = `${contact}<br>Musterstr. 1<br>12345 Berlin`;

  const fData = {
    'orderNumber': nextOrderNumber,
    'contact[id]': contactId, // 6869627
    'contact[objectName]': 'Contact',
    'orderDate': '1545127497',
    'status': '100',
    'header': 'Lieferschein ' + nextOrderNumber, // Lieferschein LI - 1001
    'headText': '<p>Sehr geehrte Damen und Herren,</p> <p>vielen Dank für Ihre Anfrage. Gerne unterbreiten wir Ihnen das gewünschte freibleibende Angebot:</p>',
    'footText': '<p>Für Rückfragen stehen wir Ihnen jederzeit gerne zur Verfügung.<br> Wir bedanken uns sehr für Ihr Vertrauen.</p><p>Mit freundlichen Grüßen<br>[%KONTAKTPERSON%]</p>',
    'addressName': contact,
    'addressCountry[id]': 1,
    'addressCountry[objectName]': 'StaticCountry',
    'version': 0,
    'smallSettlement': false,
    'contactPerson[id]': '251893',
    'contactPerson[objectName]': 'SevUser',
    'taxRate': 0,
    // 'taxSet': null,
    'taxText': 'Umsatzsteuer ausweisen',
    'taxType': 'default',
    'orderType': 'LI',
    'address': address,
    'currency': 'EUR',
    'sumNet': 0,
    'sumTax': 0,
    'sumGross': 0,
    'sumDiscounts': 0,
    'sumNetForeignCurrency': 0,
    'sumTaxForeignCurrency': 0,
    'sumGrossForeignCurrency': 0,
    'sumDiscountsForeignCurrency': 0,
    'weight': 0,
    'showNet': true,
    'objectName': 'Order',
    'types': '[object Object]'
  };

  return fData;
}

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
