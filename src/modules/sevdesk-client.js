import * as log from 'loglevel';
import { config } from './config';
import _ from 'lodash';
import OrderFormUtil from './order-form-util';

const isProdMode = config.env == 'production' ? true : false;
const options = {
  headers: {
    'Authorization': config.token,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

const level = isProdMode ? log.levels.WARN : log.levels.DEBUG;
log.setLevel(level);

class SevdeskClient {

  constructor() {
    this._cacheDomElements();
    this._addListeners();
    this._api = isProdMode ? config.api : `http://${config.host}:${config.port}`;
    this._orderFormUtil = new OrderFormUtil();
    log.debug('constructor');
  }

  _cacheDomElements() {
    this._selectCsvBtn = document.querySelector('input[type="file"]');
    this._uploadResponse = document.querySelector('#upload-Response');
    log.debug('_cacheDomElements');
  }

  _addListeners() {
    this._selectCsvBtn.addEventListener('change', e => this._loadCsvData(e));
    log.debug('_addListeners');
  }

  _loadCsvData(e) {
    e.preventDefault();

    let file = e.target.files[0],
        reader = new FileReader();

    reader.onload = () => {
      
      this._fetchContacts().then(data => {

        let csv = reader.result,
            allLines = csv.split(/\r\n|\n/),
            map = {};
  
        for (let i = 1; i < allLines.length; i++) {
          let lineData = allLines[i].split(','),
              tagName = lineData[0].split(' ')[1];
          map[tagName] = Object.assign({}, lineData);
        }        

        data.objects.forEach(contact => {

          this._fetchNextOrderNumber().then(nextOrderNumber => {
            
            this._createOrderLI(nextOrderNumber, contact).then(orderId => {
              
              this._createOrderPos(orderId).then(orderId => {

                this._uploadResponse.innerHTML = `<pre>${JSON.stringify(orderId, null, 2)}</pre>`;

              });
            });
          });
        });
      })
      .catch(error => {
        log.error(error);
      });
    }
    reader.readAsBinaryString(file);

    log.debug('_loadCsvData');
  }

  _createOrderLI(nextOrderNumber, contact) {
    let orderReqOptions,
        orderFormData = this._orderFormUtil.getOrderData(nextOrderNumber, contact);

    if (isProdMode) {
      orderReqOptions = {
        form: orderFormData,
        headers: {
          'Authorization': config.token,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
    } else {
      orderReqOptions = {
        method: 'post',
        headers: {
          'Authorization': config.token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderFormData)
      };
    }

    const requestOrder = new Request(`${this._api}/Order`, orderReqOptions);
    
    log.debug('_createOrderLI');

    return fetch(requestOrder).then(res => { return res.json(); }).then(json => {
      this._uploadResponse.innerHTML = `<pre>${JSON.stringify(json, null, 2)}</pre>`;
      return json.objects.id;
    })
    .catch(error => {
      log.error(error);
    });
  }

  _createOrderPos(orderId) {
    let orderPosReqOptions,
        orderPosFormData = this._orderFormUtil.getOrderPosData(orderId);

    if (isProdMode) {
      orderPosReqOptions = {
        method: 'post',
        form: orderPosFormData,
        headers: {
          'Authorization': config.token,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

    } else {
      orderPosReqOptions = {
        method: 'post',
        headers: {
          'Authorization': config.token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPosFormData)
      };
    }

    const requestOrderPos = new Request(`${this._api}/OrderPos`, orderPosReqOptions);
    
    log.debug('_createOrderPos');

    return fetch(requestOrderPos).then(res => { return res.json(); }).then(json => {
      return json.objects.id;
    })
    .catch(error => {
      log.error(error);
    });
  }

  _fetchContacts() {
    let requestContacts;

    if (isProdMode) {
      requestContacts = new Request(`${this._api}/Contact?depth=0&limit=50&offset=0&embed=addresses,tags`, options);
    } else {
      requestContacts = new Request(`${this._api}/Contact`);
    }

    log.debug('_fetchContacts');

    return fetch(requestContacts).then(res => res.json()).then(json => {
      return json;
    })
    .catch(error => {
      log.error(error);
    });
  }

  _fetchNextOrderNumber() {
    let requestGetNextOrderNumber;

    if (isProdMode) {
      requestGetNextOrderNumber = new Request(`${this._api}/Order/Factory/getNextOrderNumber?orderType=LI&useNextNumber=true`, options);
    } else {
      requestGetNextOrderNumber = new Request(`${this._api}/Order/Factory/getNextOrderNumber`);
    }

    log.debug('_fetchNextOrderNumber');

    return fetch(requestGetNextOrderNumber).then(res => res.json()).then(data => { return data.objects; }).then(nextOrderNumber => {
      return nextOrderNumber;
    })
    .catch(error => {
      log.error(error);
    });
  }
}

export default SevdeskClient;
