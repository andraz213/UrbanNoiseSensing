export class Sensor {
  _id: string;
  name: string;
  mac: [number];
  deployments: [string];
  current_deployment: string;
  current_location: [number];
  last_telemetry: Date;
  latest_measurement: Measurement;
  last_data: string;
  all_data: [string];
  firmware_version: string;
  battery_voltage: number;
}

export class Measurement {
  decibels: number;
  frequencyRange: number;
}
