'use strict';

var utils = require('../utils/writer.js');
var Types = require('../service/TypesService');

module.exports.message_typesGET = function message_typesGET (req, res, next) {
  Types.message_typesGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.user_rolesGET = function user_rolesGET (req, res, next) {
  Types.user_rolesGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
