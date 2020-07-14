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

Still have to figure out how exactly to get the gateway mac addresses.
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
                if (sensor.current_deployment != null) {
                    gw_macs = getGWMacs(se);

                }

                console.log("hejj");
                console.log(sensor);
                let sensorObj = JSON.parse(JSON.stringify(sensor));
                sensorObj[0]["gateways"] = gw_macs;
                console.log(sensorObj);
                return res.status(200).json(sensorObj);

            }


        }
    });


}
const postTelemetrySensor = (req, res) => {
    let id = req.params.sensor_id;
    let {voltage, version} = req.body;

    sensorModel.findById(id, (err, sensor) => {
        if (err) {
            return res.status(500).json(err);
        } else {
            if (!sensor || sensor.length == 0) {
                console.log(`Could not find sensor with id: ${id}}`);
                return res.status(404).json({'message': `Could not find sensor with id: ${id}`});
            } else {
                if(voltage) {
                    sensor.battery_voltage = voltage;
                }
                if(version) {
                    sensor.firmware_version = version;
                }
                sensor.last_telemetry = Date.now();
                sensor.save((err, sensor_sv) => {
                    if (err) {
                        return res.status(500).json(err);
                    } else {
                        return res.status(200).json(sensor_sv);
                    }
                })

            }
        }

    });


}
/*
let createNewData = new Promise(resolve => {
    let NewData = new dataSchema();
    NewData.save((err, res)=>{
        resolve(res);
    });


});*/

const postDataSensorSensor = async (req, res) => {
    let dataObj = JSON.parse(JSON.stringify(req.body));
    let statusreport = {"success": 0, "failure": 0, "messages": []};
    for(let data of dataObj){

        // najdi senzor
        let sensorMac = data.mac;
        let currentSensor = await sensorModel.find({mac: sensorMac}).limit(1).exec();
        if(currentSensor != null && currentSensor.length == 1){
            let oneSensor = currentSensor[0];
            let currentData;
            if(oneSensor.last_data != null){
                currentData = await dataModel.findById(oneSensor.last_data).exec();
            }
            if(currentData == null || currentData.length == 0 || currentData.size >= 10){
                currentData = new dataModel();
                currentData.deployment = oneSensor.current_deployment;
                currentData.location = oneSensor.current_location;
                currentData.sensor = oneSensor._id;
                currentData.size = 0;
                oneSensor.last_data = currentData._id;
                oneSensor.save();
            }

            currentData.size += 1;
            currentData.data.push({
                frequencyRange: data.data.frequencyRange,
                fftValues: data.data.fftValues,
                decibels: data.data.decibels,
                measured_at: data.data.measured_at,
            });
            currentData.save();

            console.log(currentData);
            console.log(currentSensor);
        } else {
            statusreport.failure +=1;
            statusreport.messages.push({"messge": `could not find sensor ${data.mac}`});
        }

        /*

        sensorModel.find({"mac": data.mac}, (err, sensor) => {
            if(err){
                return res.status(404).json({"message": "could not find sensor"});
            }

            if(sensor){
                if(sensor.last_data){
                    dataModel.findById(sensor.last_data, (err, data) =>{
                        if(err){
                            return res.status(404).json(err);
                        }else{
                            if(data.size < 1000){
                                data.
                            }
                        }



                    });
                }
            }

        });*/

        // poglej če ma last data

        // poglej če ma last data mn k 1000 vpisov

        // če nima last data al pa ma una že 1000 vpisov nared novo

        // shran podatke v last data

        // save
    }

    res.status(200).json(statusreport);

}

const putSensor = (req, res) => {
    let id = req.params.sensor_id;
    let new_s = req.body;

    sensorModel.findById(id, (err, sensor) => {
        if(err){
            console.log(err);
            return res.status(400).json(err);
        } else{
            console.log(sensor);
            if(!sensor || sensor.length == 0){
                return res.status(204).json({'message': `Sensor ${id} dose not exist!`});
            }
            for(let element in new_s){
                sensor[element] = new_s[element];
            }
            sensor.save((err, sensor_sv) => {
                if(err){
                    return res.status(500).json(err);
                }else{
                    return res.status(200).json(sensor_sv);
                }
            })

        }

    });
}


const getGWMacs = (deploymentid) => {
    let gw_macs = [];

    deploymentModel.findById(deploymentid, (err, dep) => {
        if (err) {
            return [];
        } else {
            let gws = dep.gateways;
            for (let i = 0; i < gws.length; i++) {
                gw_macs.push(gws[i].mac);
            }
        }


    });
    return gw_macs;
}


module.exports = {
    getAllSensor,
    getAllByIdSensor,
    postSensor,
    postTelemetrySensor,
    postDataSensorSensor,
    putSensor
};