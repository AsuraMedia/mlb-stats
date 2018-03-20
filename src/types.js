export interface DateType {
  year: string,
  month: string,
  day: string
}

export interface ZoneData {
  pitches: string;
  player_id: number;
  player_name: string;
  ba: string;
  slg: string;
  hits: string;
  whiffs: string;
  so: string;
  exit_velocity: string;
  spin_rate: string;
  release_pos_x: string;
  release_pos_y: string;
  release_pos_z: string;
  pfx_x: string;
  pfx_z: string;
  zone: string;
}

export interface ZoneDataPitcher extends ZoneData {
  pitcher: string
}

export interface ZoneDataBatter extends ZoneData {
  player_at_bat: string
}

