'use strict';

const https = require('https');

var FCMKEY = undefined;

const ROLE_STRINGS = [ "Rescuer",
						           "Rescuee" ];
const MESSAGE_TYPE_ID = { ACK : 0,
						              NACK : 1,
						              CONNECTION_REQUEST: 2,
						              CONNECTION_RESPONSE: 3,
						              MESSAGE: 4 };
const NOTIFICATIONS = [ { },
                        { },
                        undefined /* {
                          "title": "Connection Request",
                          "text": "You have a connection request from another user",
                          "sound": "default",
                          "badge": "0"
                          }*/ , 
                        undefined /* {
                          'title': 'Connection confirmaion',
                          'text': 'Another user has confirmed your connection request',
                          'sound': 'default'
                        }*/ ,
                        { 'title': 'RescueStation',
                          'body': 'There is a message waiting for you',
                          'sound': 'default'
                        }
                      ];

const ACTIVITY = { SHOW: 1,
					         SCAN: 2 };


exports.initialise = function(fcm_secret_key){
  FCMKEY = fcm_secret_key;
}


/**
 * send a message
 * Send a message to a connection. Note: the message is sent to all parties on the connection. Use disambiguation to ensure you filter correctly.
 *
 * body MessageRequest 
 * no response value expected for this operation
 **/
exports.messagesPOST = function(body) {

  console.log("\n\n------------------------------------------------");
  console.log("→ Got a send request of ",body);

  // See:  https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages


  return new Promise(function(resolve, reject) {

		var data = {};
		data = Object.assign( body, data );
		var fullPayload = {
      'foreground': 'false',
      'coldstart': 'true',
      'content-available': '1',
      priority: 'high',
		};
    // massage payload items around
		if (data.hasOwnProperty('recipient_id')) {
      fullPayload.to = data.recipient_id;
      delete data.recipient_id;
		}
    if( data.message_type === MESSAGE_TYPE_ID.CONNECTION_REQUEST ) {
      // recipeitsn for connection request are set in payload
      fullPayload.to = data.payload;
    }
    if( NOTIFICATIONS[ parseInt(data.message_type) ]!==undefined ) {
      fullPayload.notification = NOTIFICATIONS[ parseInt(data.message_type) ];
    }
    delete data.message;
   

    var notification = {};
    
    notification.title = process.env.NOTIFICATION_TITLE;
    notification.body = process.env.NOTIFICATION_BODY;
    
    if(notification.title && notification.body){
      fullPayload.notification = notification;
    }

    fullPayload.data = { "payload": JSON.stringify(data) };
    // set authorisation in headers
    var headers = {
      'Content-Type':'application/json',
      'Authorization':'key='+FCMKEY
    };

    // construct http request object
    var httpRequest = https.request({
      method: 'POST',
      port:443,
      hostname: 'fcm.googleapis.com',
      path: '/fcm/send',
       headers: headers
    }, function(res){
      res.setEncoding('utf8');
      res.on('data',function(body){
        console.log("Success posting, FCM says: ", body);
        resolve( body );
      });
    });
    httpRequest.on('error',function(err){
      console.log('error posting to FCM:',err);
      reject(err);
    });
    console.log("sending to FCM:",fullPayload );
    httpRequest.write( JSON.stringify( fullPayload ) );
    httpRequest.end();

  });
};

