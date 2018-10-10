'use strict';

const http = require('http');

const FCMKEY = "AAAA2MBUecI:APA91bG4FOVHW4VDmlWud27Xh6hK5bGxcdfIl1cfGRETw-M24ElT1VvglHn3z3TSKUiGwzOquhDhE_1kgZHiBKFRF4SdH2bfKhU60OcRz8_yGAag6AJBqt4QSlkBRYInZhB7QksDKHa8"; // shhhhhh!

/**
 * send a message
 * Send a message to a connection. Note: the message is sent to all parties on the connection. Use disambiguation to ensure you filter correctly.
 *
 * body MessageRequest 
 * no response value expected for this operation
 **/
exports.messagesPOST = function(body) {
  return new Promise(function(resolve, reject) {

    console.log("got a send request of ",body);

		var data = {};
		Object.assign( body, data );
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
    if( fullPayload.hasOwnProperty('notification'))  {
      fullPayload.notification = data.notification;
      delete data.notification;
    }
    // set authorisation in headers
    var headers = {
      'Content-Type':'application/json',
      'Authorization':'key='+FCMKEY
    };
    // construct http request object
    var httpRequest = http.request({
      method: 'POST',
      port:443,
      hostname: 'fcm.googleapis.com',
      path: '/fcm/send',
      headers: headers
    }, function(res){
      res.setEncoding('utf8');
      res.on('data',function(body){
        // did not expect this!
      });
    });
    httpRequest.on('error',function(err){
      console.log('error posting to FCM:',err);
      reject(err);
    });
    httpRequest.write( JSON.stringify(data) );
    httpRequest.end();

    var posted = {};
    posted['application/json'] = {
      "thank": "you"
    };

    if(posted.hasOwnProperty('application/json')) {
      resolve(posted['application/json']);
    } else {
      resolve();
    }
  });
}

