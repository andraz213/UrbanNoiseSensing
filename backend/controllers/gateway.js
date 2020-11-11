const mongoose = require('mongoose');
const dataModel = mongoose.model('data');
const sensorModel = mongoose.model('sensor');
const gatewayModel = mongoose.model('gateway');
const deploymentModel = mongoose.model('deployment');

const nameGenerator = require('../misc/names');


/*
Returns partial data about all the gateways
 */
const getAllGateway = (req, res) => {
    gatewayModel.find({}, (err, gateways) => {
        console.log(gateways);
            if (err) {
                return res.status(500).json(err);
            }
            else {
                let gatewaysObj = JSON.parse(JSON.stringify(gateways));
                for (let i = 0; i < gatewaysObj.length; ++i) {
                    delete gatewaysObj[i]['deployments'];
                    delete gatewaysObj[i]['wifi_credentials'];
                    delete gatewaysObj[i]['firmware_version'];
                }
                return res.status(200).json(gatewaysObj);

            }
        }
    );
}


/*
Returns all the information about a gateway with a specified id
 */
const getAllByIdGateway = (req, res) => {

    let id = req.params.gateway_id;
    gatewayModel.findById(id, (error, gateway) => {
        if (error) {
            return res.status(500).json(error);
        } else if (!gateway || gateway.length === 0 || gateway.length > 1)
            return res.status(404).json({'message': 'No sensor existing'});
        else if (gateway.length > 1)
            return res.status(404).json({'message': 'More than one gateway with this id!'});
        else {
            let gatewayObj = JSON.parse(JSON.stringify(gateway));
            return res.status(200).json(gatewayObj);
        }
    });

}

/*
Creates a new gateway, this is the same method as the one used in sensor where it only gets the mac address and then either returns useful information or creates a new gateway.
 */
const postGateway = (req, res) => {

    let {mac} = req.body;
    gatewayModel.find({mac: mac}, (error, gateway) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        } else {
            if (gateway.length == 0) {
                var newGateway = new gatewayModel({
                    name: nameGenerator.newRandomName(),
                    mac: mac,
                    current_location: [0.01, 0.01]
                });
                newGateway.save(newGateway).then(data => {
                    console.log(data);
                    res.send(data);
                });
            }

            if (gateway.length >= 1) {
                let gatewayObj = JSON.parse(JSON.stringify(gateway));

                console.log(gatewayObj);
                return res.status(200).json(gatewayObj);

            }


        }
    });


}

/*
Posts gateway telemetry to the server
 */
const postTelemetryGateway = (req, res) => {
}

const updateGateway = (req, res) => {
    let id = req.params.gateway_id;
    gatewayModel.updateOne({_id: id}, req.body).then(res => {
        return res.status(200).json();
    })
        .catch(err => {
            return res.status(400).json(err);
        });
}


module.exports = {
    getAllGateway,
    getAllByIdGateway,
    postGateway,
    postTelemetryGateway,
    updateGateway
};