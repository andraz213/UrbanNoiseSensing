export class Gateway {
  _id: string;
  name: string;
  mac: [number];
  deployments: [string];
  current_deployment: string;
  wifi_credentials: [string];
  current_location: [number];
  last_telemetry: Date;
  firmware_version: string;
  telemetry: any;

}
