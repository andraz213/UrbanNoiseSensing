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
           this.deployment = dep;

           updateSensors(dep, res);
           //updateGateways(dep.gateways);
       }
    });

    // udpate all the sensors



    // update all the gateways

    // create all the data buckets

    // update the deployment to deployed





}
/*
const updateGateways = (dep, res) => {
    for(let sen of dep.sensors){
        sensorModel.findById(sen.sensor_id, (err, sens)=> {
            if(err){
                return res.status(404).json({'message': 'Could not find the senosr'});
            } else {
                console.log(sens);
                sens.current_deployment = dep._id;
                sens.current_location = sens.current_location;
                if(sens.deployments.indexOf(dep._id) === -1) {
                    sens.deployments.push(dep._id);
                }
                // @@@ še data bucket je treba ustvarit
                sens.save((err, data) => {
                    if(err){
                        return res.status(500).json({'message': 'could not update sensor'});
                    }
                    console.log(data);

                });

            }
        });


    }

}*/


const updateSensors = (dep, res) => {
    for(let sen of dep.sensors){
        sensorModel.findById(sen.sensor_id, (err, sens)=> {
            if(err){
                return res.status(404).json({'message': 'Could not find the senosr'});
            } else {

                sens.current_deployment = dep._id;
                sens.current_location = sen.location;
                if(sens.deployments.indexOf(dep._id) === -1) {
                    sens.deployments.push(dep._id);
                }
                // @@@ še data bucket je treba ustvarit
                console.log(sens);
                sens.save((err, data) => {
                    if(err){
                        return res.status(500).json({'message': 'could not update sensor'});
                    }
                    console.log(data);
                });
            }
        });
    }
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
const getDeploymentById = (req, res) => {
    let id = req.params.deployment_id;;
    deploymentModel.findById(id, (error, deployment) => {
        if (error) {
            return res.status(500).json(error);
        } else if (!deployment || deployment.length === 0 || deployment.length > 1)
            return res.status(404).json({'message': 'No such deployment!'});
        else if (deployment.length > 1)
            return res.status(404).json({'message': 'More than one gateway with this id!'});
        else {
            let deploymentObj = JSON.parse(JSON.stringify(deployment));
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