export class Sensor {
  name: string;
  mac: [number];
  deployments: [string];
  current_deployment: string;
  current_location: [number];
  last_telemetry: Date;
  last_data: string;
  all_data: [string];
  firmware_version: string;
  battery_voltage: number;
}
