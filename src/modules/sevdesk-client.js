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
    this._selectCsvBtn = document.querySelector('input[type="file"]');
    this._resultDiv = document.querySelector('#api-result');
    console.log('LOG: _cacheDomElements');
  }
  
  _addListeners() {
    this._createOrderLiBtn.addEventListener('click', e => this.createOrderLI(e));
    this._selectCsvBtn.addEventListener('change', e => this.selectFile(e));
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

    return promise;
  }

  showId(id) {
    console.log(id);
  }

  async selectFile(e) {
    let file = e.target.files[0],
        reader = new FileReader();

    reader.onload = (e) => {
      let csv = reader.result,
          allTextLines = csv.split(/\r\n|\n/),
          lines = [];
      
      for (let i = 1; i < allTextLines.length; i++) {
        let data = allTextLines[i].split(','),
            tarr = [];
        
        for (let j = 0; j < data.length; j++) {
          tarr.push(data[j]);
        }
        lines.push(tarr);
      }
      console.log(lines[0][0].split(' '));
    };
    reader.readAsBinaryString(file);








    
    // let options = {
    //   'method': 'post',
    //   'form': new FormData()
    // };

    // let request = isProdMode ? new Request(`${this._api}/Order`, options) : new Request(`${this._api}/Order`, options);

    // try {
    //   const response = await fetch(request);
    //   // const json = await response;
    //   console.log(response);
      
    //   // document.querySelector('#csv-result').innerHTML = `<pre>${JSON.stringify(json, null, 2)}</pre>`;

    // } catch (error) {
    //   console.log('ERROR: ' + error);
    // }
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

}

export default SevdeskClient;
