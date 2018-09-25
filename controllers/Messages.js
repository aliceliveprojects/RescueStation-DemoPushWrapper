'use strict';

var utils = require('../utils/writer.js');
var Message = require('../service/MessageService');

module.exports.messagesPOST = function messagesPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  Message.messagesPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
