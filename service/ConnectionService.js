'use strict';

const uuidv1 = require('uuid/v1');

/**
 * delete connection
 * deletes the specified connection
 *
 * connection_id String 
 * no response value expected for this operation
 **/
exports.connectionsConnection_idDELETE = function(connection_id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * create a connection
 * Creates a new connection and returns a representational object
 *
 * returns Connection
 **/
exports.connectionsPOST = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      "id" : uuidv1()
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

