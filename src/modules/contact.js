/**
 * Class representing a contact in sevDesk UI environment.
 */
class Contact {

  constructor(id, tagId, tagName) {
    this._id = id;
    this._tagId = tagId;
    this._tagName = tagName;
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

}

export default Contact;
