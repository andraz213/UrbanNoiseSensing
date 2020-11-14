const mongoose = require('mongoose');
const ObjectId = require("mongoose");
const dataModel = mongoose.model('data');
const sensorModel = mongoose.model('sensor');
const gatewayModel = mongoose.model('gateway');
const deploymentModel = mongoose.model('deployment');

const getAllDeployment = async (req, res) => {
    deploymentModel.find({}, async (err, data) => {
       if(err){
           return res.status(500).json(err);
       }else{

           let dataObj = JSON.parse(JSON.stringify(data));
           for(let i = 0; i<dataObj.length; i++){
               delete dataObj[i]['sensors'];
               delete dataObj[i]['gateways'];
               if(!dataObj[i]['measurement_num'] ){
                   dataObj[i]['measurement_num'] = await get_measurements(dataObj[i]["_id"]);
               }
           }
           return res.status(200).json(dataObj);
       }
    });
}


const postDeployment = (req, res) => {

    var newDep = new deploymentModel(req.body);
    newDep.save((err, data) => {
        if(err){
            console.log(err);
            return res.status(400).json(err);
        }
        return res.status(200).json(data);
    });
}


const finishDeployment  = async (req, res) => {

    let id = req.params.deployment_id;
    let deployment = await deploymentModel.findById(id).exec();
    let res_messages = [];
    console.log(deployment);
    if(deployment.status != 'deployed'){
        return res.status(400).json({'message': 'This deployment is not deployed!'});
    }

    // posodobi senzorje
    for(let sn of deployment.sensors){
        try {
            await sensorModel.updateOne({_id: sn.sensor_id}, {
                current_deployment: null,
                current_location: [],
                last_data: null
            });
        } catch (e){
            res_messages.push(e);
        }
    }

    // posodobi gatewaye
    for(let gw of deployment.gateways){
        try {
            await gatewayModel.updateOne({_id: gw.sensor_id}, {current_deployment: null, current_location: [], wifi_credentials: []});
        } catch (e) {
            res_messages.push(e);
        }
    }




    // posodobi deployment

    let get_n_measurements = [
        {
            '$match': {
                'deployment': mongoose.Types.ObjectId(id)
            }
        }, {
            '$unwind': {
                'path': '$data'
            }
        }, {
            '$match': {
                'data.measured_at': {
                    '$gt': new Date('Wed, 01 Jan 2020 00:00:00 GMT')
                }
            }
        }, {
            '$bucketAuto': {
                'groupBy': '$data.measured_at',
                'buckets': 1,
                'output': {
                    'num': {
                        '$sum': 1
                    }
                }
            }
        }
    ];



    deployment.status = 'finished';
    deployment.finish = Date.now();
    let numbers = JSON.parse(JSON.stringify(await dataModel.aggregate(get_n_measurements).allowDiskUse(true).exec()));
    let all_measurements = numbers[0].num;
    deployment.measurement_num = all_measurements;
    console.log(deployment);

    deployment.save((err, data)=>{
        if(err){
            return res.status(400).json({'message': 'Failed to finished deployment', 'err': err, 'res_messages': res_messages});
        }
        if(res_messages.length == 0){
            return res.status(200).json({'message': 'Finished deployment!','data': data, 'res_messages': res_messages});
        }
        return res.status(200).json({'message': 'Finished deployment, but there might be problems with sensors!','data': data, 'res_messages': res_messages});

    });


}


/*
This is the moneymaker

 */
const deployDeployment = async (req, res) =>{
    let id = req.params.deployment_id;

    let deployment;

    await deploymentModel.findById(id, async (err, dep) => {
       if(err){
           return res.status(404).json({'message': 'Couldnt find the deployment'});
       } else {
           console.log(dep);
           if (dep.status != 'pending') {
               return res.status(400).json({'message': 'Deployment already deployed!'});
           } else {
               this.deployment = dep;
               if (await updateSensors(dep, res) == 0) {
                   console.log("DEPLOYED SENSORS");
                   if (await updateGateways(dep, res) == 0) {

                       console.log("DEPLOYED GATEWAYS")
                       dep.status = 'deployed';
                       dep.measurement_interval = 1;

                       dep.save((err, data) => {
                           if (err) {
                               console.log(err);
                               return res.status(400).json({'message': 'could not deploy it'});
                           }
                           console.log(data);
                           return res.status(200).json({'message': 'Deployed the deployment.', 'data': data});
                       });
                   } else {
                       return res.status(400).json({'message': 'could not deploy it and gateways'});
                   }
               } else {
                   return res.status(400).json({'message': 'could not deploy it and sensors and gateways'});
               }

           }
       }
    });

}


const updateGateways = async (dep, res) => {
    for(let gw of dep.gateways){
        console.log(gw);
        await gatewayModel.findById(gw.sensor_id, async (err, gwy)=> {
            if(err){
                console.log(err);
                return -1;// res.status(404).json({'message': 'Could not find the gateway'});
            } else {
                gwy.current_deployment = dep._id;
                gwy.current_location = [0,0];
                console.log(gwy);
                // @@@ še data bucket je treba ustvarit
                await gwy.save((err, data) => {
                    if(err){
                        console.log(err);
                        return -1;
                    }
                    console.log(data);

                });
            }
        });
    }
    return 0;
}


const updateSensors = async (dep, res) => {
    for(let sen of dep.sensors){
        await sensorModel.findById(sen.sensor_id, async(err, sens)=> {
            if(err){
                console.log(err);
                return -1;//res.status(404).json({'message': 'Could not find the senosr'});
            } else {

                sens.current_deployment = dep._id;
                sens.current_location = sen.location;

               await sens.save((err, data) => {
                    if(err){
                        console.log(err);
                        return -1; //res.status(500).json({'message': 'could not update sensor'});
                    }
                    console.log(data);
                });
            }
        });
    }
    return 0;
}



const updateDeploymentInterval = (req, res) => {

    let id = req.params.deployment_id;
    let interval = req.params.interval;

    deploymentModel.findById(id, (err, deployment) => {
        if(err){
            console.log(err);
            return res.status(400).json(err);
        } else{
            console.log(deployment);
            if(!deployment || deployment.length == 0){
                return res.status(204).json({'message': `Deployment ${id} dose not exist!`});
            }
            deployment.measurement_interval = interval
            console.log(deployment);
            deployment.save((err, deployment_sv) => {
                if(err){
                    return res.status(500).json(err);
                }else{
                    return res.status(200).json(deployment_sv);
                }
            })

        }
    });
}


const updateDeployment = (req, res) => {

    let id = req.params.deployment_id;
    let new_d = req.body;

    deploymentModel.findById(id, (err, deployment) => {
        if(err){
            console.log(err);
            return res.status(400).json(err);
        } else{
            console.log(deployment);
            if(!deployment || deployment.length == 0){
                return res.status(204).json({'message': `Deployment ${id} dose not exist!`});
            }
            for(let element in new_d){
                deployment[element] = new_d[element];
            }
            console.log(deployment);
            console.log(new_d);
            deployment.save((err, deployment_sv) => {
                if(err){
                    return res.status(500).json(err);
                }else{
                    return res.status(200).json(deployment_sv);
                }
            })

        }

    });
}



const isInArraySensor = (array, sensor) =>{
for(let i = 0; i<array.length; i++){
    console.log(array[i].sensor, sensor);
    if(array[i].sensor == sensor){
        return i;
    }
}

return -1;

}


const get_measurements = async (id) => {

    let get_n_measurements = [
        {
            '$match': {
                'deployment': mongoose.Types.ObjectId(id)
            }
        }, {
            '$unwind': {
                'path': '$data'
            }
        }, {
            '$match': {
                'data.measured_at': {
                    '$gt': new Date('Wed, 01 Jan 2020 00:00:00 GMT')
                }
            }
        }, {
            '$bucketAuto': {
                'groupBy': '$data.measured_at',
                'buckets': 1,
                'output': {
                    'num': {
                        '$sum': 1
                    }
                }
            }
        }
    ];
    let all_measurements = 0;
    let numberes = JSON.parse(JSON.stringify(await dataModel.aggregate(get_n_measurements).allowDiskUse(true).exec()));
    if(numberes != null){
        if(numberes[0] != null && numberes[0].num){
            all_measurements = numberes[0].num;
        }
    }

    return all_measurements;

}




const getDeploymentById = async (req, res) => {

    let id = await req.params.deployment_id;

    console.log(id);

    let number_agregation = [
        {
            '$match': {
                'deployment': mongoose.Types.ObjectId(id)
            }
        }, {
            '$unwind': {
                'path': '$data'
            }
        }, {
            '$match': {
                'data.measured_at': {
                    '$gt': new Date('Wed, 01 Jan 2020 00:00:00 GMT')
                }
            }
        }, {
            '$group': {
                '_id': '$sensor',
                'num': {
                    '$sum': 1
                }
            }
        }
    ];
    let numbers = await dataModel.aggregate(number_agregation).allowDiskUse(true).exec();
    console.log(numbers);
    let number_agregate = [];
    for(let nnum of numbers){
        number_agregate.push({sensor: nnum._id, num: nnum.num});
    }

    console.log(number_agregate);

    for(let numm of number_agregate){
        let sens = await sensorModel.findById(numm.sensor).limit(1).exec();
        console.log(sens);
        if(sens.name) {
            numm.name = sens.name;
        }


    }



    deploymentModel.findById(id, async (error, deployment) => {
        if (error) {
            return res.status(500).json(error);
        } else if (!deployment || deployment.length === 0 || deployment.length > 1)
            return res.status(404).json({'message': 'No such deployment!'});
        else if (deployment.length > 1)
            return res.status(404).json({'message': 'More than one gateway with this id!'});
        else {
            let deploymentObj = JSON.parse(JSON.stringify(deployment));

            deploymentObj.numbers = numbers;
            deploymentObj.number_agregate = number_agregate;

            return res.status(200).json(deploymentObj);
        }
    });
}

const getIntervalByDeployment = async (req, res) => {
    let id = await req.params.deployment_id;
    try {
        let deployment = await deploymentModel.findById(id).select({
            _id: 1,
            measurement_interval: 1
        }).limit(1).exec();

        if(deployment) {
            return res.status(200).json(deployment);
        }
    }
    catch (err){
        return res.status(400).json(err);
    }


}


const deleteDeployment = async (req, res) => {
    let id = await req.params.deployment_id;
    try {
        let deployment = await deploymentModel.findById(id).exec();
        let res = "";

        // posodobi senzorje
        for(let sn of deployment.sensors){
            try {
                await sensorModel.updateOne({_id: sn.sensor_id, current_deployment: id}, {
                    current_deployment: null,
                    current_location: [],
                    last_data: null
                });
            } catch (e){
                return res.status(400).json(err);
            }
        }

        // posodobi gatewaye
        for(let gw of deployment.gateways){
            try {
                await gatewayModel.updateOne({_id: gw.sensor_id, current_deployment: id}, {current_deployment: null, current_location: [], wifi_credentials: []});
            } catch (e) {
                return res.status(400).json(err);
            }
        }


                console.log(await dataModel.deleteMany({deployment: id}).exec());
                console.log("deleted data");
                console.log(await deploymentModel.deleteMany({_id: id}).exec());
                console.log("deleted dep");
                return res.status(200).json();

    }
    catch (err){
        return res.status(400).json(err);
    }


}



module.exports = {
    getAllDeployment,
    postDeployment,
    updateDeployment,
    getDeploymentById,
    deployDeployment,
    finishDeployment,
    updateDeploymentInterval,
    getIntervalByDeployment,
    deleteDeployment
};