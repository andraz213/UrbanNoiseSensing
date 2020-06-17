var express = require('express');
var router = express.Router();
var dataController = require('../controllers/data');


router.get('/measurements', dataController.getMeasurements);
router.get('/measurements/:nLast', dataController.getLastNMeasurements);
router.get('/measurements/:idSensor', dataController.getMeasurementsById);
router.post('/measurements', dataController.newMeasurement);

module.exports = router;

