import csv from 'csv-parser';
import * as fs from 'fs';

const module = (() => {
  console.log('######### csv-importer.js');
  let results = [];
  fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', results.push)
    .on('end', () => {
      console.log(results);
      // [
      //   { NAME: 'Daffy Duck', AGE: 24 },
      //   { NAME: 'Bugs Bunny', AGE: 22 }
      // ]
    });
})();

export default module;
