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

    dataModel.aggregate(agregat, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }
        return res.status(200).json(data);
    });

}
const getSpeceficDataByDeployment = (req, res) => {
}

const getLastNByDeployment = (req, res) => {

    let dep_id = req.params.deployment_id;
    let n = parseInt(req.params.last_n);
    let n_limit = parseInt(Math.min(90000, n * 20));

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
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    });

}


const getLastNSecondsByDeployment = async (req, res) => {

    let n = req.params.last_seconds * 1000;
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
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(data);

    })

}


const GetInterestingIntervalsDataDeployment = async (req, res) => {

    let dep_id = req.params.deployment_id;

    let get_n_seconds = [
        {
            '$match': {
                'deployment': new ObjectId(dep_id)
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
                '_id': '$data.measured_at',
                'measured': {
                    '$first': '$data.measured_at'
                }
            }
        }, {
            '$bucketAuto': {
                'groupBy': '$measured',
                'buckets': 1,
                'output': {
                    'num': {
                        '$sum': 1
                    }
                }
            }
        }
    ];


    let num_data = await dataModel.aggregate(get_n_seconds).exec();
    let num = num_data[0].num;
    console.log(num);

    let intervali = Math.ceil(num / 30);
    let limit = Math.ceil(Math.sqrt(intervali));
    console.log(intervali);


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
            '$match': {
                'data.measured_at': {
                    '$gt': new Date('Wed, 01 Jan 2020 00:00:00 GMT')
                }
            }
        }, {
            '$group': {
                '_id': '$data.measured_at',
                'timestamp': {
                    '$first': '$data.measured_at'
                },
                'average': {
                    '$avg': '$data.decibels'
                },
                'deviation': {
                    '$stdDevPop': '$data.decibels'
                }
            }
        }, {
            '$sort': {
                'timestamp': 1
            }
        }, {
            '$bucketAuto': {
                'groupBy': '$timestamp',
                'buckets': intervali,
                'output': {
                    'first': {
                        '$min': '$timestamp'
                    },
                    'last': {
                        '$max': '$timestamp'
                    },
                    'average': {
                        '$avg': '$average'
                    },
                    'deviation_average': {
                        '$avg': '$deviation'
                    },
                    'decibel_average_deviation': {
                        '$stdDevPop': '$average'
                    }
                }
            }
        }, {
            '$addFields': {
                'multi': {
                    '$multiply': ['$deviation_average', '$deviation_average']
                }
            }
        }, {
            '$addFields': {
                'estimator': {
                    '$add': [
                        '$multi', '$decibel_average_deviation'
                    ]
                }
            }
        },
        {
            '$sort': {
                'estimator': -1
            }
        }, {
            '$limit': limit
        }

    ];

    dataModel.aggregate(agregat, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }
        return res.status(200).json(data);
    })


}


const GetAcerageOverAllSensors = async (req, res) => {

    let dep_id = req.params.deployment_id;

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
            '$match': {
                'data.measured_at': {
                    '$gt': new Date('Wed, 01 Jan 2020 00:00:00 GMT')
                }
            }
        }, {
            '$group': {
                '_id': '$data.measured_at',
                'timestamp': {
                    '$first': '$data.measured_at'
                },
                'average': {
                    '$avg': '$data.decibels'
                },
                'deviation': {
                    '$stdDevPop': '$data.decibels'
                }
            }
        }, {
            '$sort': {
                'timestamp': 1
            }
        }

    ];


    dataModel.aggregate(agregat, (err, data) => {
        if (err) {
            return res.status(400).json(err);
        }
        return res.status(200).json(data);
    });


}


module.exports = {
    getAllDataByDeployment,
    getSpeceficDataByDeployment,
    getLastNByDeployment,
    getLastNSecondsByDeployment,
    GetInterestingIntervalsDataDeployment,
    GetAcerageOverAllSensors
};