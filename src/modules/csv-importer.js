const isProdMode = false;

const CsvImporter = () => {
  
  document.querySelector('#send-request').addEventListener('click', (e) => {
    e.preventDefault();
    let fileName = document.querySelector('#csv-file').value;
    console.log(fileName);
    
    const opt = {
      headers: {
        // 'method': 'get',
        // 'Authorization': auth
      }
    };
    const url = isProdMode ? '' : 'http://127.0.0.1:4000/csv/' + fileName;
  
    let request = new Request(url, opt);
  
    fetch(request)
      .then(res => {
        return res.json();
      })
      .then(data => {
        document.querySelector('#sevdesk-result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
      })
      .catch(errorThrown => {
        console.log('ERROR: ' + errorThrown);
      });
  });

};

export default CsvImporter;
