import { config } from './config';

const isProdMode = config.env == 'production' ? true : false;

class SevdeskClient {

  constructor(file) {
    this.file = file;
    this.url = isProdMode ? '' : `http://${config.host}:${config.port}/csv/${this.file}`;
    this.sendBtn = document.querySelector('#send-request');
    this.addListeners();
  }

  addListeners() {
    this.sendBtn.addEventListener('click', e => this.sendRequest(e));
  }

  sendRequest(e) {
    console.log('SEND');

    e.preventDefault();

    let request = new Request(this.url);

    fetch(request)
      .then(res => {
        return res.json();
      })
      .then(data => {
        document.querySelector('#sevdesk-result').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      })
      .catch(errorThrown => {
        console.log('ERROR: ' + errorThrown);
      });
  }

}

export default SevdeskClient;
