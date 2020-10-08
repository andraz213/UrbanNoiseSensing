const mongoose = require('mongoose');
const dataModel = mongoose.model('data');
const sensorModel = mongoose.model('sensor');
const gatewayModel = mongoose.model('gateway');
const deploymentModel = mongoose.model('deployment');
const nameGenerator = require('../misc/names');

const getAllSensor = async (req, res) => {

    try {
        let sensors = await sensorModel.find().select({
            _id: 1,
            name: 1,
            current_location: 1,
            last_telemetry: 1,
            firmware_version: 1,
            battery_voltage: 1,
            current_deployment: 1
        });
        return res.status(200).json(sensors);
    } catch (err) {
        return res.status(500).json(err);
    }
}
const getAllByIdSensor = async (req, res) => {

    let id = req.params.sensor_id;


    try {
        let sensors = await sensorModel.find({_id: id});
        return res.status(200).json(sensors);
    } catch (err) {
        return res.status(500).json(err);
    }

}


/*
This function checks whether the sensor with the mac address exists or not. If there is no such sensor, it creates a new sensor and returns the data.

Still have to figure out how exactly to get the gateway mac addresses.
 */

const postSensor = async (req, res) => {

    let {mac} = req.body;

    sensorModel.find({mac: mac}, async (error, sensor) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        } else {
            if (sensor.length == 0) {
                let novSensor = new sensorModel({
                    name: nameGenerator.newRandomName(),
                    mac: mac
                });
                novSensor.save(novSensor).then(data => {
                    console.log(data);
                    res.send(data);
                });
            }

            if (sensor.length == 1) {

                let gw_macs = [];
                console.log(sensor[0].current_deployment);
                if (sensor[0].current_deployment != null) {
                    gw_macs = await getGWMacs(sensor[0].current_deployment);
                }

                let sensorObj = JSON.parse(JSON.stringify(sensor));
                sensorObj[0]["gateways"] = gw_macs;
                console.log(sensorObj);
                return res.status(200).json(sensorObj);

            }


        }
    });


}

const postTelemetrySensor = async (req, res) => {
    res.status(200);
    res.send();
    res.end();

    let dataObj = JSON.parse(JSON.stringify(req.body));

    for(let data of dataObj) {

        let sensorMac = data.mac;
        let currentSensor = await sensorModel.find({mac: sensorMac}).limit(1).exec();
        await sensorModel.updateOne({_id: currentSensor[0].id}, {battery_voltage: data.battery_voltage, last_telemetry: Date.now()}).exec();

      /*  currentSensor.save((err, sens)=>{
            if(err) {
                console.log(err);
            }
        });*/
        /*
        sensorModel.findById(id, (err, sensor) => {
            if (err) {
                return res.status(500).json(err);
            } else {
                if (!sensor || sensor.length == 0) {
                    console.log(`Could not find sensor with id: ${id}}`);
                    return res.status(404).json({'message': `Could not find sensor with id: ${id}`});
                } else {
                    if (voltage) {
                        sensor.battery_voltage = voltage;
                    }
                    if (version) {
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

        });*/

    }


}

const postDataSensorSensor = async (req, res) => {

    res.status(200);
    res.send();
    res.end();

    let dataObj = JSON.parse(JSON.stringify(req.body));
    let statusreport = {"success": 0, "failure": 0, "messages": []};

    for (let jk = 0; jk < 1; jk++) {

        for (let data of dataObj) {
            console.log(data);

            // najdi senzor
            let sensorMac = data.mac;
            let currentSensor = await sensorModel.find({mac: sensorMac}).select({
                _id: 1,
                current_deployment: 1,
                last_data: 1,
                current_location: 1,
                name: 1
            }).limit(1).exec();
            let newSize = 1;
            console.log(currentSensor);

            if (currentSensor != null && currentSensor.length == 1) {
                let oneSensor = currentSensor[0];
                if (oneSensor.current_deployment != null && oneSensor.current_deployment != '') {
                    let currentData;
                    if (oneSensor.last_data != null) {
                        currentData = await dataModel.findById(oneSensor.last_data).select({
                            _id: 1,
                            size: 1,
                            last: 1,
                            first: 1
                        }).exec();
                    }
                    if (currentData == null || currentData.length == 0 || currentData.size >= 10) {
                        currentData = new dataModel();
                        currentData.deployment = oneSensor.current_deployment;
                        currentData.location = oneSensor.current_location;
                        currentData.sensor = oneSensor._id;
                        currentData.size = 1;
                        let oo = await currentData.save();
                        // oneSensor.all_data.push(currentData._id);
                        oneSensor.last_data = currentData._id;
                        let res = await oneSensor.save();
                    } else {
                        //newSize = (await dataModel.aggregate([{$match: {_id: currentData._id}}, {$project: {data: {$size: '$data'}}}]))[0].data + 1;
                        newSize = currentData.size + 1;
                    }
                    console.log(currentData);


                    let measurement = {
                        frequencyRange: data.fft_range,
                        fftValues: data.fft_values,
                        decibels: data.decibels,
                        measured_at: new Date(data.timestamp * 1000),
                    };

                    console.log(measurement);

                    if (currentData.last < measurement.measured_at) {
                        currentData.last = measurement.measured_at;
                    }
                    if (currentData.first > measurement.measured_at) {
                        currentData.first = measurement.measured_at;
                    }
                    await sensorModel.updateOne({_id: oneSensor._id}, {latest_measurement: measurement});
                    await dataModel.updateOne({_id: currentData._id}, {
                        size: newSize,
                        last: currentData.last,
                        first: currentData.first,
                        $addToSet: {data: measurement}
                    }, (err, data) => {
                        if (err) {
                            statusreport.failure += 1;
                            statusreport.messages.push({"messge": `could not save data`, 'data': measurement});
                        }

                        statusreport.success += 1;
                    });


                } else {
                    statusreport.failure += 1;
                    statusreport.messages.push({
                        "messge": `sensor ${oneSensor.name} is not deployed`,
                        'data': data.data
                    });
                }
            } else {
                statusreport.failure += 1;
                statusreport.messages.push({"messge": `could not find sensor ${data.mac}`, 'data': data.data});
            }

        }
    }

    statusreport.success = dataObj.length - statusreport.failure;
    console.log(statusreport);
    // res.status(200).json(statusreport);

}

const putSensor = (req, res) => {
    let id = req.params.sensor_id;
    let new_s = req.body;

    sensorModel.findById(id, (err, sensor) => {
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        } else {
            console.log(sensor);
            if (!sensor || sensor.length == 0) {
                return res.status(204).json({'message': `Sensor ${id} dose not exist!`});
            }
            for (let element in new_s) {
                sensor[element] = new_s[element];
            }
            sensor.save((err, sensor_sv) => {
                if (err) {
                    return res.status(500).json(err);
                } else {
                    return res.status(200).json(sensor_sv);
                }
            })

        }

    });
}

const getGWMacs = async (deploymentid) => {
    let gw_macs = [];

    await deploymentModel.findById(deploymentid, (err, dep) => {
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

const postDataSensorWebsocket = async (JSNdata) => {

    let data = JSON.parse(JSNdata);


    // najdi senzor
    let sensorMac = data.mac;
    console.log(sensorMac);
    let currentSensor = await sensorModel.find({mac: sensorMac}).select({
        _id: 1,
        current_deployment: 1,
        last_data: 1,
        current_location: 1,
        name: 1
    }).limit(1).exec();
    let newSize = 1;
    console.log(currentSensor);

    if (currentSensor != null && currentSensor.length == 1) {
        let oneSensor = currentSensor[0];
        if (oneSensor.current_deployment != null && oneSensor.current_deployment != '') {
            let currentData;
            if (oneSensor.last_data != null) {
                currentData = await dataModel.findById(oneSensor.last_data).select({
                    _id: 1,
                    size: 1,
                    last: 1,
                    first: 1
                }).exec();
            }
            if (currentData == null || currentData.length == 0 || currentData.size >= 1000) {
                currentData = new dataModel();
                currentData.deployment = oneSensor.current_deployment;
                currentData.location = oneSensor.current_location;
                currentData.sensor = oneSensor._id;
                currentData.size = 1;
                let oo = await currentData.save();
                // oneSensor.all_data.push(currentData._id);
                oneSensor.last_data = currentData._id;
                let res = await oneSensor.save();
            } else {
                //newSize = (await dataModel.aggregate([{$match: {_id: currentData._id}}, {$project: {data: {$size: '$data'}}}]))[0].data + 1;
                newSize = currentData.size + 1;
            }
            console.log(currentData);


            let measurement = {
                frequencyRange: data.fft_range,
                fftValues: data.fft_values,
                decibels: data.decibels,
                measured_at: new Date(data.timestamp * 1000),
                //measured_at: Date.now()
            };
            //console.log(Date(data.timestamp));
            console.log(currentData.last);
            console.log(measurement.measured_at);
            console.log(currentData.last < measurement.measured_at);

            if (currentData.last < measurement.measured_at) {
                currentData.last = measurement.measured_at;
            }
            if (currentData.first > measurement.measured_at) {
                currentData.first = measurement.measured_at;
            }
            await sensorModel.updateOne({_id: oneSensor._id}, {latest_measurement: measurement});
            await dataModel.updateOne({_id: currentData._id}, {
                size: newSize,
                last: currentData.last,
                first: currentData.first,
                $addToSet: {data: measurement}
            }, (err, data) => {
                if (err) {
                }

            });


        } else {
        }
    } else {

    }


    return "ok";
}

const PostSensorTelemetryWebsockets = async (JSNdata) => {


    let data = JSON.parse(JSNdata);


    // najdi senzor
    let sensorMac = data.mac;
    console.log(sensorMac);


    let currentSensor = await sensorModel.find({mac: sensorMac}).limit(1).exec();
    console.log(currentSensor);

    if (currentSensor != null && currentSensor.length == 1) {
        let oneSensor = currentSensor[0];
        console.log(oneSensor);

        await sensorModel.updateOne({_id: oneSensor._id}, {
            battery_voltage: data.battery_voltage,
            last_telemetry: Date.now()
        });

    }


    sensorModel.find({mac: sensorMac}, async (err, sensor) => {
        if (err) {
            return res.status(500).json(err);
        } else {
            if (!sensor || sensor.length == 0) {
                console.log(`Could not find sensor with id: ${id}}`);
                return res.status(404).json({'message': `Could not find sensor with id: ${id}`});
            } else {
                console.log(sensor);
                if (data.voltage) {
                    sensor.battery_voltage = data.voltage;
                }
                if (data.version) {
                    sensor.firmware_version = data.version;
                }
                sensor.last_telemetry = Date.now();
                console.log(sensor);

                await sensorModel.updateOne({_id: sensor._id}, {
                    battery_voltage: data.voltage,
                    last_telemetry: Date.now()
                });
                /*sensor.save((err, sensor_sv) => {
                    if (err) {
                        return res.status(500).json(err);
                    } else {
                        return res.status(200).json(sensor_sv);
                    }
                })*/

            }
        }

    });

}

module.exports = {
    getAllSensor,
    getAllByIdSensor,
    postSensor,
    postTelemetrySensor,
    postDataSensorSensor,
    putSensor,
    postDataSensorWebsocket,
    PostSensorTelemetryWebsockets
};