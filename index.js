'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http');
    
var cors = require('cors');
var app = require('connect')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var data = require('./utils/data');
var messageService = require('./service/MessageService');


var getConfig = function(){
  var result = {};
  if(!process.env.FIREBASE_SERVER_SECRET) throw new Error("undefined in environment: FIREBASE_SERVER_SECRET");
  result.serverSecret = process.env.FIREBASE_SERVER_SECRET;
  return result;
}




app.use(cors());
messageService.initialise(getConfig().serverSecret);

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

var consumerApiAddress = process.env.CONSUMER_API_ADDRESS;
var consumerApiPort = swaggerDoc.host.split(':')[1];  //WILL THROW IF PORT NOT DEFINED IN DOC
var consumerApiScheme = swaggerDoc.schemes[0];  //WILL THROW IF SCHEMES NOT DEFINED IN DOC
data.initialise(consumerApiScheme, consumerApiAddress, consumerApiPort);


// change the standard definition to suit the server environment
var hostAddrPort = data.getConsumerApiAddress() + ":" + data.getConsumerApiPort(); 
var serverPort = process.env.PORT || data.getConsumerApiPort();
swaggerDoc.host = hostAddrPort;


// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    var address = data.getConsumerApiAddress();
    var scheme = data.getConsumerApiScheme();
    console.log('SERVER: listening on %s , port %d ', address, serverPort);
    console.log('Swagger-ui is available on %s://%s:%d/docs', scheme, address, serverPort);
  });

});
