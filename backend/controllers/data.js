const mongoose = require('mongoose');
const JSONStream = require("JSONStream");
const stringify = require('JSONStream').stringify

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
            '$group': {
                '_id': '$_id',
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

    let agg = dataModel.aggregate(agregat);
    agg.options = {allowDiskUse: true};
    agg.exec((err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }
        return res.status(200).json(data);
    });

}



const streamAllDataByDeployment = async (req, res) => {
    let dep_id = req.params.deployment_id;

    /*
    *  {
            '$match': {
                'deployment': new ObjectId(dep_id)
            }
        },
    *
    * */

    let agregat = [
        {
            '$match': {
                'deployment': new ObjectId(dep_id)
            }
        },
       {
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
                '_id': '$_id',
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
    //res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});

    let aggr = dataModel.aggregate(agregat);
    aggr.options = {allowDiskUse: true};
    var strm = await aggr.cursor({ batchSize: 1000 }).exec().pipe(JSONStream.stringify()).pipe(res.type('json'));
    //res.end();
    return;
    var strm = dataModel.aggregate(agregat);
    strm.options = {allowDiskUse: true};
    strm = strm.cursor({ batchSize: 500 }).exec();

    let doc;

    //res.statusCode = 200;
    //res.setHeader('Content-Type', 'application/json');
    await strm.eachAsync(function (doc, i) {
        //console.log(i);
        res.write(JSON.stringify(doc));
        res.write(',\n');
        // use doc
    });
    res.end();
    return;

    //var strm = dataModel.find({'deployment': new ObjectId(dep_id)}).stream();
    console.log(dep_id);
    strm.on('data', function (doc) {
        res.write(JSON.stringify(doc));
    });
    strm.on('end', function() {
        console.log("yolo");
        res.end();
    });
    return;

    /*
    var strm = dataModel.aggregate(agregat).stream();
    strm.on('data', function (doc) {
        res.write(JSON.stringify(doc));
    });
    strm.on('end', function() {
        res.end();
    });*/

    /*

    let aggr = dataModel.aggregate(agregat);
    aggr.options = {allowDiskUse: true};
    var strm = aggr.cursor().exec().pipe(JSONStream.stringify()).pipe(res);
    strm.on('end', function() {
        console.log("yolo");
        res.end();
    });
    return res;

    let agg = dataModel.aggregate(agregat, { cursor: { batchSize: 0 }});
    agg.options = {allowDiskUse: true};


    let stream = agg.cursor();

    stream.next(function(error, doc) {
        console.log(doc);
    });

    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});

    let op = '{"documents":['
    let cl = '],"count":0,"total":0}'
    stream.pipe(stringify(op, ',', cl)).pipe(res)

    */

    /*
    agg.options = {allowDiskUse: true};
    agg.exec((err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }
        return res.status(200).json(data);
    });*/

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


    let agg = dataModel.aggregate(agregat);
    agg.options = {allowDiskUse: true};
    agg.exec((err, data) => {
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

    let agg = dataModel.aggregate(agregat);
    agg.options = {allowDiskUse: true};
    agg.exec((err, data) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(data);

    })

}

const GetInterestingIntervalsManuallyDataDeployment = async (req, res) => {
    let dep_id = req.params.deployment_id;

    let interval_len = parseInt(req.params.interval);
    let count = parseInt(req.params.count);

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

    let num_data = await dataModel.aggregate(get_n_seconds).allowDiskUse(true).exec();
    let num = num_data[0].num;
    console.log(num);
    interval_len = Math.max(1, interval_len);
    let intervali = Math.max(Math.ceil(num / interval_len), 1);
    let limit = Math.max(count, 1);
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

    let interests = await dataModel.aggregate(agregat).allowDiskUse(true).exec();


    let oragregat = [];

    for (let int in interests) {


        let mini = {
            'data.measured_at': {
                '$gte': interests[int].first,
                '$lte': interests[int].last,
            }
        }
        oragregat.push(mini)
    }

    let interes_data_agregat = [
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
                '$or': oragregat
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


    let agg = dataModel.aggregate(interes_data_agregat);
    agg.options = {allowDiskUse: true};
    agg.exec((err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json(err);
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


    let num_data = await dataModel.aggregate(get_n_seconds).allowDiskUse(true).exec();
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

    let interests = await dataModel.aggregate(agregat).allowDiskUse(true).exec();


    let oragregat = [];

    for (let int in interests) {


        let mini = {
            'data.measured_at': {
                '$gte': interests[int].first,
                '$lt': interests[int].last,
            }
        }
        oragregat.push(mini)
        console.log(mini);
        console.log(oragregat);
    }

    let interes_data_agregat = [
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
                '$or': oragregat
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

    console.log(interes_data_agregat);


    let agg = dataModel.aggregate(interes_data_agregat);
    agg.options = {allowDiskUse: true};
    agg.exec((err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json(err);
        }
        return res.status(200).json(data);
    })


}


const GetAcerageOverAllSensors = async (req, res) => {

    let dep_id = req.params.deployment_id;

    let razlika_milisekunde = [
        {
            '$match': {
                'deployment': new ObjectId(dep_id)
            }
        }, {
            '$unset': [
                'data.fftValues', 'data._id', 'data.frequencyRange', 'location', 'first', 'last', 'deployment', 'size', '_id', 'sensor'
            ]
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
                '_id': null,
                'max': {
                    '$max': '$data.measured_at'
                },
                'min': {
                    '$min': '$data.measured_at'
                }
            }
        }, {
            '$set': {
                'delta': {
                    '$subtract': [
                        '$max', '$min'
                    ]
                }
            }
        }
    ];


    let agg_milis = dataModel.aggregate(razlika_milisekunde);
    agg_milis.options = {allowDiskUse: true};
    agg_milis.exec((err, data) => {
        if (err) {
            return res.status(400).json(err);
        }

        let razlika = data[0].delta;
        let interval = Math.floor(razlika / 333);

        let agregat = [
            {
                '$match': {
                    'deployment': new ObjectId(dep_id)
                }
            }, {
                '$unset': [
                    'data.fftValues', 'data._id', 'data.frequencyRange', 'location', 'first', 'last', 'deployment', 'size', '_id', 'sensor'
                ]
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
                    '_id': {
                        '$toDate': {
                            '$subtract': [
                                {
                                    '$toLong': '$data.measured_at'
                                }, {
                                    '$mod': [
                                        {
                                            '$toLong': '$data.measured_at'
                                        }, interval
                                    ]
                                }
                            ]
                        }
                    },
                    'timestamp_min': {
                        '$min': '$data.measured_at'
                    },
                    'timestamp_max': {
                        '$max': '$data.measured_at'
                    },
                    'timestamp': {
                        '$min': '$data.measured_at'
                    },
                    'time': {
                        '$min': '$data.measured_at'
                    },
                    'average': {
                        '$avg': '$data.decibels'
                    },
                    'num': {
                        '$sum': 1
                    }
                }
            }, {
                '$sort': {
                    'timestamp': 1
                }
            }
        ];


        let agg = dataModel.aggregate(agregat);
        agg.options = {allowDiskUse: true};
        agg.exec((err, data) => {
            if (err) {
                return res.status(400).json(err);
            }
            return res.status(200).json(data);
        });
    });

}


module.exports = {
    getAllDataByDeployment,
    streamAllDataByDeployment,
    getSpeceficDataByDeployment,
    getLastNByDeployment,
    getLastNSecondsByDeployment,
    GetInterestingIntervalsDataDeployment,
    GetAcerageOverAllSensors,
    GetInterestingIntervalsManuallyDataDeployment
};