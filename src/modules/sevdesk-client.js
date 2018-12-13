import { config } from './config';
import Contact from './contact';
// import _ from 'underscore';
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
    this._file = file;
    this._api = isProdMode ? config.api : `http://${config.host}:${config.port}`;

    this._createOrderLiBtn = document.querySelector('#create-order-li-btn');
    this._resultDiv = document.querySelector('#api-result');
    this.addListeners();

    this._tagMap = [];
    this._tagRelationMap = [];
    this._contacts = [];

    console.log('LOG: constructor');
  }
  
  addListeners() {
    this._createOrderLiBtn.addEventListener('click', e => this.createOrderLI(e));

    console.log('LOG: addListeners');
  }

  async loadTags() {
    let request = isProdMode ? new Request(`${this._api}/Tag`, options) : new Request(`${this._api}/Tag`);

    await fetch(request)
      .then(res => {
        console.log('LOG: loadTags 1st then');

        return res.json();
      })
      .then(data => {
        console.log('LOG: loadTags 2nd then');

        let arr = [];
        data.objects.forEach((item, key) => {
          arr.push({
            tagId: item.id,
            tagName: item.name
          });
        });
        this.tagMap = arr;
      })
      .then(() => {
        console.log('LOG: loadTags 3rd then');

        this._loadTagRelations();
      })
      .catch(errorThrown => {
        console.log('ERROR: ' + errorThrown);
      });

    console.log('LOG: loadTags');
  }

  async _loadTagRelations() {
    let request = isProdMode ? new Request(`${this._api}/TagRelation`, options) : new Request(`${this._api}/TagRelation`);

    await fetch(request)
      .then(res => {
        console.log('LOG: _loadTagRelations 1st then');

        return res.json();
      })
      .then(data => {
        console.log('LOG: _loadTagRelations 2nd then');

        let arr = [];
        data.objects.forEach((item, key) => {
          arr.push({
            tagId: item.tag.id,
            relContactId: item.object.id
          });
        });
        this.tagRelationMap = arr;
      })
      .then(() => {
        console.log('LOG: _loadTagRelations 3rd then');

        this._createContacts();
      })
      .catch(errorThrown => {
        console.log('ERROR: ' + errorThrown);
      });

    console.log('LOG: _loadTagRelations');
  }

  // async createOrderLI(e) {
  //   e.preventDefault();
  //   let request = isProdMode ? new Request(`${this._api}/Order`, options) : new Request(`${this._api}/Order/${this._file}`);

  //   await fetch(request)
  //     .then(res => {
  //       return res.json();
  //     })
  //     .then(data => {
  //       this._resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  //     })
  //     .catch(errorThrown => {
  //       console.log('ERROR: ' + errorThrown);
  //     });
  // }

  _createContacts() {
    /* underscore.js
    let merged = _.map(this.tagMap, item => {
      return _.extend(item, _.findWhere(this.tagRelationMap, { tagId: item.tagId }));
    });
    */

    /* lodash.js */
    let merged = _.map(this.tagMap, item => {
      return _.assign(item, _.find(this.tagRelationMap, ['tagId', item.tagId]));
    });

    merged.forEach((item, key) => {
      let contact = new Contact(item.relContactId, item.tagId, item.tagName);
      this.contacts.push(contact);
    });

    console.log('LOG: _createContacts');
  }

  async getContactIdByTagName(tagName) {
    this.contacts.forEach((item, key) => {
      if (tagName === item.tagName) {
        return contact.id;
      }
    });

    console.log('LOG: getContactIdByTagName');
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

  clearResultContainer() {
    this._resultDiv.innerHTML = '';
  }

  get tagMap() {
    return this._tagMap;
  }

  set tagMap(tagMap) {
    this._tagMap = tagMap;
  }

  get tagRelationMap() {
    return this._tagRelationMap;
  }

  set tagRelationMap(tagRelationMap) {
    this._tagRelationMap = tagRelationMap;
  }

  get contacts() {
    return this._contacts;
  }

  set contacts(contact) {
    this._contact = contact;
  }

}

export default SevdeskClient;
