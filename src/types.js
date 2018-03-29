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

export interface PitchBreakdownData {
  pitches: string;
  player_id: number;
  player_name: string;
  pa: string;
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
  pitch_type: string;
}

export interface PlayerItemType {
  id: string,
  value: { id: string, playerType: string }
}
