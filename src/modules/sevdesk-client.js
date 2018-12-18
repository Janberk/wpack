import * as log from 'loglevel';
import { config } from './config';
import Contact from './contact';
import _ from 'lodash';

const isProdMode = config.env == 'production' ? true : false;
const options = {
  headers: {
    'Authorization': 'cdd9c3611f802f368eac2d10bc29dce9',
    'Content-Type': 'application/x-www-form-urlencoded'
    // 'credentials': 'same-origin'
  }
};

const level = isProdMode ? log.levels.WARN : log.levels.DEBUG;
log.setLevel(level);

class SevdeskClient {

  constructor() {
    this._cacheDomElements();
    this._addListeners();
    this._api = isProdMode ? config.api : `http://${config.host}:${config.port}`;
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
            let data = map[contact.tags[0].name];

            const params = {
              nextOrderNumber: nextOrderNumber,
              contact: contact.name,
              contactId: contact.id,
              address: contact.addresses[0].street + ' ' + contact.addresses[0].zip + ' ' + contact.addresses[0].city
            };

            log.debug(params);
  
            let options = {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(params)
            };
  
            let requestOrder = isProdMode ? new Request(`${this._api}/Order`, options) : new Request(`${this._api}/Order`, options);
  
            fetch(requestOrder).then(res => { return res.json(); }).then(json => {
              this._uploadResponse.innerHTML = `<pre>${JSON.stringify(json, null, 2)}</pre>`;
            })
            .catch(error => {
              log.error(error);
            });
          });
        });
      });
    }
    reader.readAsBinaryString(file);
  }

  _fetchContacts() {
    let requestContacts;

    if (isProdMode) {
      requestContacts = new Request(`${this._api}/Contact?depth=0&limit=50&offset=0&embed=addresses,tags`, options);
    } else {
      requestContacts = new Request(`${this._api}/Contact`);
    }

    return fetch(requestContacts).then(res => res.json()).then(json => {
      return json; // this._uploadResponse.innerHTML = `<pre>${JSON.stringify(json, null, 2)}</pre>`;
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

    return fetch(requestGetNextOrderNumber).then(res => res.json()).then(data => { return data.objects; }).then(nextOrderNumber => {
      return nextOrderNumber;
    })
    .catch(error => {
      log.error(error);
    });
  }







  /*
  _processCsvData(e) {
    let requestTag;
    let requestTagRelation;

    if (isProdMode) {
      requestTag = new Request(`${this._api}/Tag`, options);
      requestTagRelation = new Request(`${this._api}/TagRelation`, options);
    } else {
      requestTag = new Request(`${this._api}/Tag`);
      requestTagRelation = new Request(`${this._api}/TagRelation`);
    }      

    const promise = fetch(requestTag).then(res => { return res.json(); }).then(json => {

        let data = {
          tags: [],
          tagRelations: [],
          contacts: []
        };

        json.objects.forEach((item) => {
          data.tags.push({
            tagId: item.id,
            tagName: item.name
          });
        });
        return data;

      }).then(data => {
        
        fetch(requestTagRelation).then(res => { return res.json(); }).then(json => {

          json.objects.forEach((item) => {
            data.tagRelations.push({
              tagId: item.tag.id,
              relContactId: item.object.id
            });
          });

          return data;

        }).then(data => {

          let merged = _.map(data.tags, item => {
            return _.assign(item, _.find(data.tagRelations, ['tagId', item.tagId]));
          });

          merged.forEach((item) => {
            let contact = new Contact(item.relContactId, item.tagId, item.tagName);
            data.contacts.push(contact);
          });

          return data;
        }).then(data => {
          let file = e.target.files[0],
              reader = new FileReader(),
              contacts = data.contacts;

          reader.onload = () => {
            let csv = reader.result,
                allLines = csv.split(/\r\n|\n/);

            for (let i = 1; i < allLines.length; i++) {
              let lineData = allLines[i].split(','),
                  tagName = lineData[0].split(' ')[1];

              contacts.forEach(contact => {
                if (tagName === contact.tagName) {
                  contact.data = Object.assign({}, lineData);
                }
              });
            }

            contacts.forEach(contact => {

              this._fetchNextOrderNumber().then(nextOrderNumber => {

                const params = {
                  nextOrderNumber: nextOrderNumber,
                  contact: contact.data[2],
                  contactId: contact.id
                };

                let options = {
                  method: 'post',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(params)
                };

                let requestOrder = isProdMode ? new Request(`${this._api}/Order`, options) : new Request(`${this._api}/Order`, options);

                fetch(requestOrder).then(res => { return res.json(); }).then(json => {
                  this._uploadResponse.innerHTML = `<pre>${JSON.stringify(json, null, 2)}</pre>`;
                })
                .catch(error => {
                  log.error(error);
                });
              });

            });

          };
          reader.readAsBinaryString(file);
        })
      })
    .catch(error => {
      log.error(error);
    });
    log.debug('_processCsvData:');
    return promise;
  }

  async _loadTags() {
    let request = isProdMode ? new Request(`${this._api}/Tag`, options) : new Request(`${this._api}/Tag`);

    try {
      const response = await fetch(request);
      const json = await response.json();

      let tags = [];
      json.objects.forEach((item, index) => {
        tags.push({
          tagId: item.id,
          tagName: item.name
        });
      });

      log.debug('_loadTags');
      return Promise.resolve(tags);
    } catch (error) {
      log.error(error);
    }
  }

  async _loadTagRelations() {
    let request = isProdMode ? new Request(`${this._api}/TagRelation`, options) : new Request(`${this._api}/TagRelation`);

    try {
      const response = await fetch(request);
      const json = await response.json();
      
      let tagRelations = [];
      json.objects.forEach((item, index) => {
        tagRelations.push({
          tagId: item.tag.id,
          relContactId: item.object.id
        });
      });

      log.debug('_loadTagRelations');
      return Promise.resolve(tagRelations);
    } catch (error) {
      log.error(error);
    }
  }

  async _createContacts() {
    try {
      let tags = await this._loadTags()
        .then(value => {
          return value;
        });

      let tagRelations = await this._loadTagRelations()
        .then(value => {
          return value;
        });

      let contacts = [];
  
      let merged = _.map(tags, item => {
        return _.assign(item, _.find(tagRelations, ['tagId', item.tagId]));
      });

      merged.forEach((item, index) => {
        let contact = new Contact(item.relContactId, item.tagId, item.tagName);
        contacts.push(contact);
      });
      
      log.debug('_createContacts');
      return Promise.resolve(contacts);
    } catch (error) {
      log.error(error);
    }
  }
  
  async createOrderLI(e) {
    e.preventDefault();
    
    let request = isProdMode ? new Request(`${this._api}/Order`, options) : new Request(`${this._api}/Order/${this._file}`);
    
    try {
      const response = await fetch(request);
      const json = await response;
      
      this._resultDiv.innerHTML = `<pre>${JSON.stringify(json, null, 2)}</pre>`;
      log.debug('createOrderLI');
      
    } catch (error) {
      log.error(error);
    }
  }
  
  async getContactIdByTagName(tagName) {
    try {      
      let result = await this._createContacts()
      .then(value => {
        let contactIds = [];
        
        value.forEach((contact, index) => {
          if (tagName === contact.tagName) {
            contactIds.push(contact.id);
          }
        });
        return contactIds;
      });
      
      log.debug('getContactIdByTagName');
      return Promise.resolve(result);
    } catch (error) {
      log.error(error);
    }
  }

  appendTagData() {
    this.tagMap.forEach((tag, key) => {
      let id = document.createTextNode(`ID: ${tag.tagId}\xa0`),
          name = document.createTextNode(`Name: ${tag.tagName}`),
          br = document.createElement('br'),
          spanId = document.createElement('span'),
          spanName = document.createElement('span');

      spanId.appendChild(id);
      spanName.appendChild(name);

      this._resultDiv.appendChild(spanId);
      this._resultDiv.appendChild(spanName);
      this._resultDiv.appendChild(br);
    });
  }
  */

}

export default SevdeskClient;
