import { config } from './config';

const isProdMode = config.env == 'production' ? true : false;

class SevdeskClient {

  constructor(file) {
    this.file = file;
    this.api = isProdMode ? '' : `http://${config.host}:${config.port}`;
    this.createOrderLiBtn = document.querySelector('#create-order-li-btn');
    this.getTagsBtn = document.querySelector('#get-tags-btn');
    this.getTagRelationsBtn = document.querySelector('#get-tagrelations-btn');
    this.resultDiv = document.querySelector('#api-result');
    this.addListeners();
  }

  addListeners() {
    this.createOrderLiBtn.addEventListener('click', e => this.createOrderLI(e));
    this.getTagsBtn.addEventListener('click', e => this.getTags(e));
    this.getTagRelationsBtn.addEventListener('click', e => this.getTagRelations(e));
  }

  createOrderLI(e) {
    e.preventDefault();

    let request = new Request(`${this.api}/createOrderLI/${this.file}`);

    fetch(request)
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      })
      .catch(errorThrown => {
        console.log('ERROR: ' + errorThrown);
      });
  }

  getTags(e) {
    e.preventDefault();

    let request = new Request(`${this.api}/getTags`);

    fetch(request)
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      })
      .catch(errorThrown => {
        console.log('ERROR: ' + errorThrown);
      });
  }

  getTagRelations(e) {
    e.preventDefault();

    let request = new Request(`${this.api}/getTagRelations`);

    fetch(request)
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      })
      .catch(errorThrown => {
        console.log('ERROR: ' + errorThrown);
      });
  }

}

export default SevdeskClient;
