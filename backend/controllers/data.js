const mongoose = require('mongoose');
const {
    ObjectId
} = require('mongodb');
const dataModel = mongoose.model('data');
const sensorModel = mongoose.model('sensor');
const gatewayModel = mongoose.model('gateway');
const deploymentModel = mongoose.model('deployment');

const getAllDataByDeployment = async (req, res) => {
    let dep_id = req.params.deployment_id;


    let agregat = [
        {
            '$match': {
                'deployment': new ObjectId(dep_id)
            }
        }, {
        '$group': {
            '_id': '$sensor',
            'size': {
                '$sum': '$size'
            },
            'location': {
                '$first': '$location'
            },
            'deployment': {
                '$first': '$deployment'
            },
            'sensor': {
                '$first': '$sensor'
            },
            'first': {
                '$min': '$first'
            },
            'last': {
                '$max': '$last'
            },
            'data': {
                '$push': '$data'
            }
        }
    }
    ];

    let data = await dataModel.aggregate(agregat).exec();

    let processed_data = [];

    for(let i = 0; i<data.length; i++){
        let temp = data[i];

        let uhhh_gib = [];
        for(let j = 0; j<data[i].data.length; j++){
            console.log(j);
            let hju = data[i].data[j];
            for(let k = 0; k<data[i].data[j].length; k++) {
                uhhh_gib.push(hju[k]);
            }
        }
        temp.data = uhhh_gib;
        processed_data.push(temp);

    }





/*
    let deployment_arr = await deploymentModel.find({_id: dep_id}).exec();
    let result = [];
    if(deployment_arr.length == 1){
        let deployment = deployment_arr[0];
        console.log(deployment);
        console.log(deployment.sensors);
        let sensors = deployment.sensors;
        for(let i = 0; i<sensors.length; i++){
            let sens = sensors[i];
            console.log(sens);
            let curr_sens = sens.sensor_id;
            console.log(curr_sens);

            let sens_data = await dataModel.find({deployment: dep_id, sensor: curr_sens}).sort({first: 'asc'}).exec();
            console.log(sens_data);

        }
    }

*/

    /*let hmmm = await dataModel.aggregate(
        [
            { $match: { "deployment": dep_id } },
            { $group: {
                    "_id": "$sensor"

                }}
        ]).exec();

    console.log(hmmm);*/

    /*let data = await dataModel.find({deployment: dep_id}).exec();

    console.log(data);*/


    return res.status(200).json(processed_data);
}
const getSpeceficDataByDeployment = (req, res) => {}
const getLastnNyDeployment = (req, res) => {}


module.exports = {
    getAllDataByDeployment,
    getSpeceficDataByDeployment,
    getLastnNyDeployment
};