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
    this._contacts = [];
    this._csvTagNames = [];

    this._loadInitialData();
    log.debug('constructor');
  }

  _cacheDomElements() {
    this._selectCsvBtn = document.querySelector('input[type="file"]');
    this._uploadResponse = document.querySelector('#upload-Response');
    log.debug('_cacheDomElements');
  }

  _addListeners() {
    this._selectCsvBtn.addEventListener('change', e => this._processCsvData(e));
    log.debug('_addListeners');
  }

  _loadInitialData() {
    let request = isProdMode ? new Request(`${this._api}/Tag`, options) : new Request(`${this._api}/Tag`);

    fetch(request)
      .then(res => { return res.json(); })
      .then(json => {
        let tags = [];
        json.objects.forEach((item) => {
          tags.push({
            tagId: item.id,
            tagName: item.name
          });
        });

        log.debug('tags:');
        log.debug(tags);

        return tags;
      })
      .then(tags => {

        request = isProdMode ? new Request(`${this._api}/TagRelation`, options) : new Request(`${this._api}/TagRelation`);

        let tagsAndRelations = [];

        fetch(request)
          .then(res => { return res.json(); })
          .then(json => {
            let tagRelations = [];
            json.objects.forEach((item) => {
              tagRelations.push({
                tagId: item.tag.id,
                relContactId: item.object.id
              });
            });

            log.debug('tagRelations:');
            log.debug(tagRelations);

            tagsAndRelations.push(tags);
            tagsAndRelations.push(tagRelations);

            log.debug('tagsAndRelations:');
            log.debug(tagsAndRelations);

            return tagsAndRelations;
          })
          .then(tagsAndRelations => {

            let merged = _.map(tagsAndRelations[0], item => {
              return _.assign(item, _.find(tagsAndRelations[1], ['tagId', item.tagId]));
            });

            merged.forEach((item) => {
              let contact = new Contact(item.relContactId, item.tagId, item.tagName);
              this._contacts.push(contact);
            });

            log.debug('this._contacts:');
            log.debug(this._contacts);
          })
          .catch(error => {
            log.error(error);
          });
      });
  }

  _processCsvData(e) {
    log.debug('_processCsvData:');
    log.debug(this._contacts);

    let file = e.target.files[0],
        reader = new FileReader();

    reader.onload = (e) => {
      let csv = reader.result,
          allLines = csv.split(/\r\n|\n/);

      for (let i = 1; i < allLines.length; i++) {
        let lineData = allLines[i].split(','),
            tarr = [];

        for (let j = 0; j < lineData.length; j++) {
          tarr.push(lineData[j]);
        }
        let firstRow = tarr[0].split(' ');
        this._csvTagNames.push(firstRow[1]);
      }

      let postData = {};

      for (const contact of this._contacts) {
        postData[contact._id] = contact._tagName;
      }
      log.debug(postData);

      let options = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      };

      let request = isProdMode ? new Request(`${this._api}/Order`, options) : new Request(`${this._api}/Order`, options);

      fetch(request)
        .then(res => { return res.json(); })
        .then(json => {
          log.debug(json);
          this._uploadResponse.innerHTML = `<pre>${JSON.stringify(json, null, 2)}</pre>`;
        log.debug('createOrderLI');
        })
        .catch(error => {
          log.error(error);
        });
    };
    reader.readAsBinaryString(file);
  }

  /*
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
