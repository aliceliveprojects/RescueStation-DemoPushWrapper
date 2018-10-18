'use strict';

const https = require('https');

const FCMKEY = "AAAA2MBUecI:APA91bG4FOVHW4VDmlWud27Xh6hK5bGxcdfIl1cfGRETw-M24ElT1VvglHn3z3TSKUiGwzOquhDhE_1kgZHiBKFRF4SdH2bfKhU60OcRz8_yGAag6AJBqt4QSlkBRYInZhB7QksDKHa8"; // shhhhhh!

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
                        { }
                      ];

const ACTIVITY = { SHOW: 1,
					         SCAN: 2 };


/**
 * send a message
 * Send a message to a connection. Note: the message is sent to all parties on the connection. Use disambiguation to ensure you filter correctly.
 *
 * body MessageRequest 
 * no response value expected for this operation
 **/
exports.messagesPOST = function(body) {
  return new Promise(function(resolve, reject) {

    console.err("got a send request of ",body);

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
    if( data.hasOwnProperty('topic')) {
      fullPayload.to = "/topic/"+data.topic;
      delete data.topic;
    }
    if( data.message_type === MESSAGE_TYPE_ID.CONNECTION_REQUEST ) {
      // recipeitsn for connection request are set in payload
      fullPayload.to = data.payload;
    }
    if( NOTIFICATIONS[ data.message ]!==undefined ) {
      fullPayload.notification = NOTIFICATIONS[ data.message_type ];
    }
    delete data.message;

    console.err("!!! pulling data from "+fullPayload.data );

    if( fullPayload.payload_format_type === 2 ) {
      fullPayload.data = { "payload": JSON.stringify( fullPayload.data ) } ;
    } else {
      fullPayload.data = { "payload": String( fullPayload.data ) };
    }

    // set authorisation in headers
    var headers = {
      'Content-Type':'application/json',
      'Authorization':'key='+FCMKEY
    };

    console.log("------\nPOSTING:");
    console.log( JSON.stringify( fullPayload ) );
    console.log("-----------------\\n\n\n");

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
        console.log("Google Reponse: ", body);
        //var posted = {};
        //posted['application/json'] = body;
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

//    posted['application/json'] = {
//      //"thank": "you"
//    };

/*
  if(posted.hasOwnProperty('application/json')) {
      resolve(posted['application/json']);
    } else {
      resolve();
    }
*/
  });
}

