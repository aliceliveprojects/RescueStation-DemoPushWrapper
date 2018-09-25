'use strict';

var utils = require('../utils/writer.js');
var Connection = require('../service/ConnectionService');

module.exports.connectionsConnection_idDELETE = function connectionsConnection_idDELETE (req, res, next) {
  var connection_id = req.swagger.params['connection_id'].value;
  Connection.connectionsConnection_idDELETE(connection_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.connectionsPOST = function connectionsPOST (req, res, next) {
  Connection.connectionsPOST()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
