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
                'deployment': new ObjectId('5f5b6b7da74e82002305bba2')
            }
        }, {
            '$unwind': {
                'path': '$data'
            }
        }, {
            '$sort': {
                'data.measured_at': -1
            }
        }, {
            '$sample': {
                'size': 10
            }
        }, {
            '$group': {
                '_id': '$sensor',
                'size': {
                    '$sum': 1
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
                    '$min': '$data.measured_at'
                },
                'last': {
                    '$max': '$data.measured_at'
                },
                'data': {
                    '$push': '$data'
                }
            }
        }
    ];





        /*[
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
    ];*/

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


    return res.status(200).json(data);
}
const getSpeceficDataByDeployment = (req, res) => {}
const getLastNByDeployment = (req, res) => {

    let dep_id = req.params.deployment_id;
    let n = parseInt(req.params.last_n);
    let n_limit = parseInt(Math.min(90000, n*20));

    let agregat = [
        {
            '$match': {
                'deployment': new ObjectId(dep_id)
            }
        }, {
            '$unwind': {
                'path': '$data'
            }
        }, {
            '$sort': {
                'data.measured_at': -1
            }
        }, {
            '$limit': n_limit
        }, {
            '$group': {
                '_id': '$sensor',
                'location': {
                    '$first': '$location'
                },
                'deployment': {
                    '$first': '$deployment'
                },
                'sensor': {
                    '$first': '$sensor'
                },
                'data': {
                    '$push': '$data'
                }
            }
        }, {
            '$project': {
                '_id': 1,
                'location': 1,
                'deployment': 1,
                'sensor': 1,
                'sliced_data': {
                    '$slice': [
                        '$data', n
                    ]
                }
            }
        }, {
            '$unwind': {
                'path': '$sliced_data'
            }
        }, {
            '$group': {
                '_id': '$sensor',
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
                    '$min': '$sliced_data.measured_at'
                },
                'last': {
                    '$max': '$sliced_data.measured_at'
                },
                'data': {
                    '$push': '$sliced_data'
                }
            }
        }
    ];



    dataModel.aggregate(agregat, (err, data) => {
        if(err){
            console.log(err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    });

}


const getLastNSecondsByDeployment = async (req, res) => {

    let n  = req.params.last_seconds * 1000;
    let dep_id = req.params.deployment_id;
    console.log(n);
    console.log(dep_id);
    console.log(new Date(Date.now()));
    console.log(new Date(Date.now() - n));



    let agregat = [
        {
            '$match': {
                'deployment': new ObjectId(dep_id),
                'data.measured_at': {
                    '$gt': new Date(Date.now() - n)
                }
            }
        }, {
            '$unwind': {
                'path': '$data'
            }
        }, {
            '$match': {
                'data.measured_at': {
                    '$gt': new Date(Date.now() - n)
                }
            }
        }, {
            '$sort': {
                'data.measured_at': -1
            }
        }, {
            '$group': {
                '_id': '$sensor',
                'size': {
                    '$sum': 1
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
                    '$min': '$data.measured_at'
                },
                'last': {
                    '$max': '$data.measured_at'
                },
                'data': {
                    '$push': '$data'
                }
            }
        }
    ];
    console.log(agregat);

    dataModel.aggregate(agregat, (err, data) => {
        if(err){
            return res.status(500).json(err);
        }
        return res.status(200).json(data);

    })

}


module.exports = {
    getAllDataByDeployment,
    getSpeceficDataByDeployment,
    getLastNByDeployment,
    getLastNSecondsByDeployment
};