
import { DataDeployment } from './data-deployment';

export class Deployment{
    _id: string;
    name: string;
    description: string;
    sensors: [DataDeployment];
    gateways: [DataDeployment];
    start: Date;
    finish: Date;
    measurement_num: number;
    tags: [string];
}
