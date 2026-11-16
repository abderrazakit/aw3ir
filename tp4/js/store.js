/*
store.js
Script modulaire pour gérer la liste de contacts en JSON via localStorage
*/
var contactStore = (function () {
  // Variable privée initialisée depuis le localStorage
  let contactListString = localStorage.getItem("contactList");
  var contactList = contactListString ? JSON.parse(contactListString) : [];

  return {
    add: function (_name, _firstname, _date, _adress, _mail) {
      var contact = {
        name: _name,
        firstname: _firstname,
        date: _date,
        adress: _adress,
        mail: _mail,
      };

      contactList.push(contact);
      localStorage.setItem("contactList", JSON.stringify(contactList));

      return contactList;
    },

    reset: function () {
      contactList = [];
      localStorage.removeItem("contactList");

      return contactList;
    },

    getList: function () {
      return contactList;
    },
  };
})();