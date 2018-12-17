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
  
  for (const contact of req.body) {
    const formData = prepareFormData(contact);
    
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
  }

});

function prepareFormData(contact) {
  let contactId = contact._id,
      header = contact._data['1'];

  const fData = {
    'orderNumber': 'DE - 1010',
    'contact[id]': contactId,
    'contact[objectName]': 'Contact',
    'orderDate': '1544448937',
    'status': '100',
    'header': header,
    'headText': '<p>Sehr geehrte Damen und Herren,</p> <p>vielen Dank für Ihre Anfrage. Gerne unterbreiten wir Ihnen das gewünschte freibleibende Angebot:</p>',
    'footText': '<p>Für Rückfragen stehen wir Ihnen jederzeit gerne zur Verfügung.<br> Wir bedanken uns sehr für Ihr Vertrauen.</p><p>Mit freundlichen Grüßen<br>[%KONTAKTPERSON%]</p>',
    'addressName': 'Muster GmbH',
    'addressCountry[id]': 1,
    'addressCountry[objectName]': 'StaticCountry',
    'version': 0,
    'smallSettlement': false,
    'contactPerson[id]': '248855',
    'contactPerson[objectName]': 'SevUser',
    'taxRate': 0,
    'taxText': 0,
    'taxType': 'default',
    'orderType': 'LI',
    'address': 'Muster GmbH Musterstr. 1 11111 Berlin',
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
    'customerInternalNote': '1234',
    'showNet': false,
    'objectName': 'Order',
    'discountTime': 0,
    'discount': 0
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
