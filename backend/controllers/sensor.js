const mongoose = require('mongoose');
const dataModel = mongoose.model('data');
const sensorModel = mongoose.model('sensor');
const gatewayModel = mongoose.model('gateway');
const deploymentModel = mongoose.model('deployment');
const nameGenerator = require('../misc/names');

const getAllSensor = (req, res) => {
    sensorModel.find({}, (error, sensors) => {
        if (error) {
            return res.status(500).json(error);
        } else if (!sensors || sensors.length === 0)
            return res.status(404).json({'message': 'No sensors existing'});
        else {
            let sensorsObj = JSON.parse(JSON.stringify(sensors));
            for (let i = 0; i < sensorsObj.length; ++i) {
                delete sensorsObj[i]['mac'];
                delete sensorsObj[i]['deployments'];
                delete sensorsObj[i]['last_data'];
                delete sensorsObj[i]['all_data'];
                delete sensorsObj[i]['firmware_version'];
            }
            return res.status(200).json(sensorsObj);
        }
    });
}
const getAllByIdSensor = (req, res) => {

    let id = req.params.sensor_id;
    sensorModel.findById(id, (error, sensor) => {
        if (error) {
            return res.status(500).json(error);
        } else if (!sensor || sensor.length === 0 || sensor.length > 1)
            return res.status(404).json({'message': 'No sensor existing'});
        else {
            let sensorObj = JSON.parse(JSON.stringify(sensor));
            return res.status(200).json(sensorObj);
        }
    });

}


/*
This function checks whether the sensor with the mac address exists or not. If there is no such sensor, it creates a new sensor and returns the data.


 */

const postSensor = (req, res) => {

    let {mac} = req.body;
    sensorModel.find({mac: mac}, (error, sensor) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        } else {
            if (sensor.length == 0) {
                var novSensor = new sensorModel({
                    name: nameGenerator.newRandomName(),
                    mac: mac
                });
                novSensor.save(novSensor).then(data => {
                    console.log(data);
                    res.send(data);
                });
            }

            if (sensor.length == 1) {

                var gw_macs = [];

                /* get macs for deployment data */
                /*if(sensor.current_deployment != null){
                    deploymentModel.findById(sensor.current_deployment, (error, deployment) => {
                        if(error){
                            console.log(error);
                            return res.status(500).json(error);
                        }
                        else{
                            for (var i = 0; i< deployment.gateways.length; i++){
                                gw_macs.push(deployment.gateways[i]["mac"]);
                            }




                        }



                    })


                }*/
                console.log("hejj");
                console.log(sensor);
                let sensorObj = JSON.parse(JSON.stringify(sensor));
                res.send(sensor);

            }


        }
    });


}
const postTelemetrySensor = (req, res) => {
}
const postDataSensorSensor = (req, res) => {
}


module.exports = {
    getAllSensor,
    getAllByIdSensor,
    postSensor,
    postTelemetrySensor,
    postDataSensorSensor
};