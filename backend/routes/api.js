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

router.get('/deployment', deploymentController.getAllDeployment);

router.get('/deployment/deploy/:deployment_id', deploymentController.deployDeployment);

router.get('/deployment/finish/:deployment_id', deploymentController.finishDeployment);

router.get('/deployment/interval/:deployment_id/:interval', deploymentController.updateDeploymentInterval);

router.post('/deployment', deploymentController.postDeployment);

router.put('/deployment/:deployment_id', deploymentController.updateDeployment);

router.get('/deployment/:deployment_id', deploymentController.getDeploymentById);

router.get('/deployment/interval/:deployment_id', deploymentController.getIntervalByDeployment);

router.delete('/deployment/:deployment_id', deploymentController.deleteDeployment);



/*
GET /api/data/deployment/{deployment.id}
GET /api/data/deployment/{deployment.id}/{last_n}
POST /api/data/deployment/{deployment.id}/
 */

router.get('/data/deployment/interesting/:deployment_id/:interval/:count', dataController.GetInterestingIntervalsManuallyDataDeployment);

router.get('/data/deployment/interesting/:deployment_id', dataController.GetInterestingIntervalsDataDeployment);

router.get('/data/deployment/average/:deployment_id', dataController.GetAcerageOverAllSensors);

router.get('/data/deployment/:deployment_id', dataController.getAllDataByDeployment);

router.get('/data/stream/deployment/:deployment_id', dataController.streamAllDataByDeployment);


router.post('/data/deployment/:deployment_id', dataController.getSpeceficDataByDeployment);

router.get('/data/deployment/:deployment_id/:last_n', dataController.getLastNByDeployment);

router.get('/data/deployment/:deployment_id/seconds/:last_seconds', dataController.getLastNSecondsByDeployment);




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

router.put('/gateway/:gateway_id', gatewayController.updateGateway);

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

router.put('/sensor/:sensor_id', sensorController.putSensor);

router.post('/sensor/telemetry/', sensorController.postTelemetrySensor);

router.post('/sensor/data', sensorController.postDataSensorSensor);

module.exports = router;
