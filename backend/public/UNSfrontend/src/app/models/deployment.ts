
import { DataDeployment } from './data-deployment';

export class Deployment{
    _id: string;
    name: string;
    description: string;
    sensors: [DataDeployment];
    gateways: [DataDeployment];
    number_agregate: [any];
    status: string;
    start: Date;
    finish: Date;
    measurement_num: number;
    tags: [string];
    measurement_interval: number;
}
