const mongoose = require('mongoose');
const dataModel = mongoose.model('data');
const sensorModel = mongoose.model('sensor');
const gatewayModel = mongoose.model('gateway');
const deploymentModel = mongoose.model('deployment');

const getAllDeployment = (req, res) => {
    deploymentModel.find({}, (err, data) => {
       if(err){
           return res.status(500).json(err);
       }else{

           let dataObj = JSON.parse(JSON.stringify(data));
           for(let i = 0; i<dataObj.length; i++){
               delete dataObj[i]['sensors'];
               delete dataObj[i]['gateways'];
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


/*
This is the moneymaker

 */
const deployDeployment = (req, res) =>{
    let id = req.params.deployment_id;

    let deployment;

    deploymentModel.findById(id, (err, dep) => {
       if(err){
           return res.status(404).json({'message': 'Couldnt find the deployment'});
       } else {
           console.log(dep);
           if(dep.status != 'pending'){
               return res.status(400).json({'message': 'Deployment already deployed!'});
           }
           this.deployment = dep;
            if(updateSensors(dep, res) == 0){
                console.log("DEPLOYED SENSORS");
                if (updateGateways(dep, res) == 0){

                    console.log("DEPLOYED GATEWAYS")
                    dep.status = 'deployed';

                    dep.save((err, data) => {
                        if(err){
                            console.log(err);
                            return res.status(400).json({'message': 'could not deploy it'});
                        }
                        console.log(data);
                            return res.status(200).json(data);
                    });
                }
                else {
                    return res.status(400).json({'message': 'could not deploy it and gateways'});
                }
            } else {
                return res.status(400).json({'message': 'could not deploy it and sensors and gateways'});
            }

       }
    });

    // udpate all the sensors



    // update all the gateways

    // create all the data buckets

    // update the deployment to deployed





}


const updateGateways = (dep, res) => {
    for(let gw of dep.gateways){
        console.log(gw);
        gatewayModel.findById(gw.sensor_id, (err, gwy)=> {
            if(err){
                console.log(err);
                return -1;// res.status(404).json({'message': 'Could not find the gateway'});
            } else {
                gwy.current_deployment = dep._id;
                if(gwy.deployments.indexOf(dep._id) === -1) {
                    gwy.deployments.push(dep._id);
                }
                gwy.current_location = [0,0];
                console.log(gwy);
                // @@@ še data bucket je treba ustvarit
                gwy.save((err, data) => {
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


const updateSensors = (dep, res) => {
    for(let sen of dep.sensors){
        sensorModel.findById(sen.sensor_id, (err, sens)=> {
            if(err){
                console.log(err);
                return -1;//res.status(404).json({'message': 'Could not find the senosr'});
            } else {

                sens.current_deployment = dep._id;
                sens.current_location = sen.location;
                if(sens.deployments.indexOf(dep._id) === -1) {
                    sens.deployments.push(dep._id);
                }
                // @@@ še data bucket je treba ustvarit

                sens.save((err, data) => {
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


const getDeploymentById = async (req, res) => {
    let id = await req.params.deployment_id;
    let numbers = JSON.parse(JSON.stringify(await dataModel.aggregate([{$match: {deployment: mongoose.Types.ObjectId(id)}}, {$project: {data: {$size: '$data'}, sensor: "$sensor"}}])));
    let number_agregate = [];
    for(let nnum of numbers){
        let index = isInArraySensor(number_agregate, nnum.sensor);
        if(index == -1){
            number_agregate.push({sensor: nnum.sensor, num: nnum.data});
        }else{
            number_agregate[index].num += nnum.data;
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





module.exports = {
    getAllDeployment,
    postDeployment,
    updateDeployment,
    getDeploymentById,
    deployDeployment
};