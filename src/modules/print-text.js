console.log('print-text.js');

const PRINT_TEXT = (function(doc) {
  let container = doc.querySelector('#text-container');
  container.innerHTML = 'Canberk';
})(document);

export default PRINT_TEXT;
