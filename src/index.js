/**
 * Application entry point module loading dependent modules.
 */
import '@babel/polyfill';
import './assets/favicon.png';
import './styles/materialize.min.css';
import './styles/material-font-icons.css';
import './styles/main.css';
import './js/materialize.min.js';
import SevdeskClient from './modules/sevdesk-client';

const client = new SevdeskClient();







































// const fData = {
//   'orderNumber': 'DE - 1010',
//   'contact[id]': '6659849',
//   'contact[objectName]': 'Contact',
//   'orderDate': '1544448937',
//   'status': '100',
//   'header': 'TEST Lieferschein DE - 1008',
//   'headText': '<p>Sehr geehrte Damen und Herren,</p> <p>vielen Dank für Ihre Anfrage. Gerne unterbreiten wir Ihnen das gewünschte freibleibende Angebot:</p>',
//   'footText': '<p>Für Rückfragen stehen wir Ihnen jederzeit gerne zur Verfügung.<br> Wir bedanken uns sehr für Ihr Vertrauen.</p><p>Mit freundlichen Grüßen<br>[%KONTAKTPERSON%]</p>',
//   'addressName': 'Muster GmbH',
//   'addressCountry[id]': 1,
//   'addressCountry[objectName]': 'StaticCountry',
//   'version': 0,
//   'smallSettlement': false,
//   'contactPerson[id]': '248855',
//   'contactPerson[objectName]': 'SevUser',
//   'taxRate': 0,
//   'taxText': 0,
//   'taxType': 'default',
//   'orderType': 'LI',
//   'address': 'Muster GmbH Musterstr. 1 11111 Berlin',
//   'currency': 'EUR',
//   'sumNet': 0,
//   'sumTax': 0,
//   'sumGross': 0,
//   'sumDiscounts': 0,
//   'sumNetForeignCurrency': 0,
//   'sumTaxForeignCurrency': 0,
//   'sumGrossForeignCurrency': 0,
//   'sumDiscountsForeignCurrency': 0,
//   'weight': 0,
//   'customerInternalNote': '1234',
//   'showNet': false,
//   'objectName': 'Order',
//   'discountTime': 0,
//   'discount': 0
// };
