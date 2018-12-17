/**
 * Class representing a contact in sevDesk UI environment.
 */
class Contact {

  constructor(id, tagId, tagName) {
    this._id = id;
    this._tagId = tagId;
    this._tagName = tagName;
    this._data = {};
  }

  get id() {
    return this._id;
  }

  get tagId() {
    return this._tagId;
  }

  get tagName() {
    return this._tagName;
  }

  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
  }

}

export default Contact;
