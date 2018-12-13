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

class SevdeskClient {

  constructor(file) {
    this._cacheDomElements();
    this._addListeners();

    this._file = file;
    this._api = isProdMode ? config.api : `http://${config.host}:${config.port}`;

    this._tagMap = [];
    this._tagRelationMap = [];
    this._contacts = [];
    
    console.log('LOG: end constructor');
  }
  
  _cacheDomElements() {
    this._createOrderLiBtn = document.querySelector('#create-order-li-btn');
    this._resultDiv = document.querySelector('#api-result');
    console.log('LOG: _cacheDomElements');
  }
  
  _addListeners() {
    this._createOrderLiBtn.addEventListener('click', e => this.createOrderLI(e));
    console.log('LOG: _addListeners');
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

      console.log('LOG: _loadTags');
      // this._tagMap = tags;
      return tags;

    } catch (error) {
      console.log('ERROR: ' + error);
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

      console.log('LOG: _loadTagRelations');
      // this._tagRelationMap = tagRelations;
      return tagRelations;  

    } catch (error) {
      console.log('ERROR: ' + error);
    }
  }

  async _createContacts() {
    try {
      const tags = await this._loadTags();
      const tagRelations = await this._loadTagRelations();

      let contacts = [];
  
      let merged = _.map(tags, item => {
        return _.assign(item, _.find(tagRelations, ['tagId', item.tagId]));
      });
  
      merged.forEach((item, index) => {
        let contact = new Contact(item.relContactId, item.tagId, item.tagName);
        contacts.push(contact);
      });
      
      console.log('LOG: _createContacts');
      // this._contacts = contacts;
      return contacts;

    } catch (error) {
      console.log('ERROR: ' + error);
    }
  }

  async createOrderLI(e) {
    e.preventDefault();

    let request = isProdMode ? new Request(`${this._api}/Order`, options) : new Request(`${this._api}/Order/${this._file}`);

    try {
      const response = await fetch(request);
      const json = await response;

      this._resultDiv.innerHTML = `<pre>${JSON.stringify(json, null, 2)}</pre>`;
      console.log('LOG: createOrderLI');

    } catch (error) {
      console.log('ERROR: ' + error);
    }
  }

  async getContactIdByTagName(tagName) {
    console.log('LOG: getContactIdByTagName');
    let contacts = await this._createContacts();

    let promise = new Promise((resolve, reject) => {
      contacts.forEach((contact, index) => {
        if (tagName === contact.tagName) {
          resolve(contact.id);
        }
      });
    });

    // promise.then((res) => {
    // });

    return promise;
  }

  showId(id) {
    console.log(id);
  }

  // appendTagData() {
  //   this.tagMap.forEach((tag, key) => {
  //     let id = document.createTextNode(`ID: ${tag.tagId}\xa0`),
  //         name = document.createTextNode(`Name: ${tag.tagName}`),
  //         br = document.createElement('br'),
  //         spanId = document.createElement('span'),
  //         spanName = document.createElement('span');

  //     spanId.appendChild(id);
  //     spanName.appendChild(name);

  //     this._resultDiv.appendChild(spanId);
  //     this._resultDiv.appendChild(spanName);
  //     this._resultDiv.appendChild(br);
  //   });
  // }

  // get tagMap() {
  //   return this._tagMap;
  // }

  // set tagMap(tagMap) {
  //   this._tagMap = tagMap;
  // }

  // get tagRelationMap() {
  //   return this._tagRelationMap;
  // }

  // set tagRelationMap(tagRelationMap) {
  //   this._tagRelationMap = tagRelationMap;
  // }

  // get contacts() {
  //   return this._contacts;
  // }

  // set contacts(contact) {
  //   this._contact = contact;
  // }

}

export default SevdeskClient;
