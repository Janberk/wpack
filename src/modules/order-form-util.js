class OrderFormData {

  constructor() {
  }

  getOrderData(nextOrderNumber, contact) {
    return {
      'orderNumber': nextOrderNumber,
      'contact[id]': contact.id, // 6869627
      'contact[objectName]': 'Contact',
      'orderDate': '1545127497',
      'status': '100',
      'header': 'Lieferschein ' + nextOrderNumber, // Lieferschein LI - 1001
      'headText': '<p>Sehr geehrte Damen und Herren,</p> <p>vielen Dank für Ihre Anfrage. Gerne unterbreiten wir Ihnen das gewünschte freibleibende Angebot:</p>',
      'footText': '<p>Für Rückfragen stehen wir Ihnen jederzeit gerne zur Verfügung.<br> Wir bedanken uns sehr für Ihr Vertrauen.</p><p>Mit freundlichen Grüßen<br>[%KONTAKTPERSON%]</p>',
      'addressName': contact.name,
      'addressCountry[id]': 1,
      'addressCountry[objectName]': 'StaticCountry',
      'version': 0,
      'smallSettlement': false,
      'contactPerson[id]': '251893',
      'contactPerson[objectName]': 'SevUser',
      'taxRate': 0,
      // 'taxSet': null,
      'taxText': 'Umsatzsteuer ausweisen',
      'taxType': 'default',
      'orderType': 'LI',
      'address': contact.addresses[0].street + ' ' + contact.addresses[0].zip + ' ' + contact.addresses[0].city,
      'currency': 'EUR',
      'sumNet': 0,
      'sumTax': 0,
      'sumGross': 0,
      'sumDiscounts': 0,
      'sumNetForeignCurrency': 0,
      'sumTaxForeignCurrency': 0,
      'sumGrossForeignCurrency': 0,
      'sumDiscountsForeignCurrency': 0,
      'weight': 0,
      'showNet': true,
      'objectName': 'Order',
      'types': '[object Object]'
    };
  }

  getOrderPosData(orderId) {
    return {
      'order[id]': orderId,
      'order[objectName]': 'Order',
      'quantity': 1,
      'price': 15.42,
      'taxRate': 119,
      'unity[id]': 1,
      'unity[objectName]': 'Unity'
    };
  }
}

export default OrderFormData;