var express = require('express');
var router = express.Router();
var sensorController = require('../controllers/sensor');
var gatewayController = require('../controllers/gateway');
var dataController = require('../controllers/data');
var deploymentController = require('../controllers/deployment');
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('api');
});


/*
GET /api/deployment/{deployment.id}
GET /api/deployment
*/

router.get('/deployment', function (req, res){
    res.send("hej tole je deppp");
});

router.get('/deployment/:deploymant_id', function (req, res){
    let id = req.params.deploymant_id;
    res.send(id);
});

/*
GET /api/data/deployment/{deployment.id}
GET /api/data/deployment/{deployment.id}/{last_n}
POST /api/data/deployment/{deployment.id}/
 */

router.get('/data/deployment/:deployment_id', dataController.getAllDataByDeployment);

router.post('/data/deployment/:deployment_id', dataController.getSpeceficDataByDeployment);

router.get('/data/deployment/:deployment_id/:last_n', dataController.getLastnNyDeployment);


/*
GET /api/gateway
GET /api/gateway/{gateway.id}
POST /api/gateway/
POST /api/gateway/telemetry/{gateway_id}
 */

router.get('/gateway', gatewayController.getAllGateway);

router.get('/gateway/:gateway_id', gatewayController.getAllByIdGateway);

router.post('/gateway', gatewayController.postGateway);

router.post('/gateway/telemetry/:gateway_id', gatewayController.postTelemetryGateway);


/*
GET /api/sensor
POST /api/sensor/
GET /api/sensor/{sensor.id}
POST /api/sensor/telemitry/{sensor.id}
POST /api/sensor/data/
*/

router.get('/sensor', sensorController.getAllSensor);

router.get('/sensor/:sensor_id', sensorController.getAllByIdSensor);

router.post('/sensor', sensorController.postSensor);

router.post('/sensor/telemetry/:sensor_id', sensorController.postTelemetrySensor);

router.post('/sensor/data', sensorController.postDataSensorSensor);

module.exports = router;
