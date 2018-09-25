'use strict';

var supportedMessageTypes = [

  {
    name : "ACK",
    value : 0
  },
  { name : "NACK",
    value : 1
  },
  { name : "Connection Request",
    value : 2
  },
  { name : "Connection Response",
    value : 3
  },
  { name : "Message",
    value : 4
  }

];

var supportedRoleTypes = [

  {
    name : "Rescuer",
    value : 0
  },
  { name : "Rescuee",
    value : 1
  }

];


/**
 * list message types
 * returns a list of the supported message types 
 *
 * returns List
 **/
exports.message_typesGET = function() {
  return new Promise(function(resolve, reject) {
      resolve(supportedMessageTypes);
  });
}


/**
 * list user roles
 * returns a list of the supported user roles
 *
 * returns List
 **/
exports.user_rolesGET = function() {
  return new Promise(function(resolve, reject) {
    resolve(supportedRoleTypes);
  });
}

