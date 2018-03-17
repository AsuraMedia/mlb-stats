// @flow

export type Inning = {
    $: InningHeader;
    top: Array<InningHalf>;
    bottom: Array<InningHalf>;  
}

export type InningHeader = {
    num: string,
    away_team: string,
    home_team: string
}

export type InningHalf = {
    atbat: Array<AtBat>
}

export type AtBat = {
    $: AtBatHeader,
    pitch: Array<Pitch>,
    runner?: Array<Runner>
}

export type AtBatHeader = {
    num: string;
    b: string;
    s: string;
    o: string;
    start_tfs: string;
    start_tfs_zulu: Date;
    end_tfs_zulu: Date;
    batter: string;
    stand: string;
    b_height: string;
    pitcher: string;
    p_throws: string;
    des: string;
    des_es: string;
    event_num: string;
    event: string;
    event_es: string;
    play_guid: string;
    home_team_runs: string;
    away_team_runs: string;
}

export type Pitch = {
    $: PitchHeader
}

export type PitchHeader = {
    des: string;
    des_es: string;
    id: string;
    type: string;
    code: string;
    tfs: string;
    tfs_zulu: Date;
    x: string;
    y: string;
    event_num: string;
    sv_id: string;
    play_guid: string;
    start_speed: string;
    end_speed: string;
    sz_top: string;
    sz_bot: string;
    pfx_x: string;
    pfx_z: string;
    px: string;
    pz: string;
    x0: string;
    y0: string;
    z0: string;
    vx0: string;
    vy0: string;
    vz0: string;
    ax: string;
    ay: string;
    az: string;
    break_y: string;
    break_angle: string;
    break_length: string;
    pitch_type: string;
    type_confidence: string;
    zone: string;
    nasty: string;
    spin_dir: string;
    spin_rate: string;
    cc: string;
    mt: string;
}

export type Runner = {
    $: RunnerHeader
}

export type RunnerHeader = {
    id: string;
    start: string;
    end: string;
    event: string;
    event_num: string;
    score: string;
    rbi: string;
    earned: string;
}

export interface PitchZonePitcher {
    pitches: string;
    player_id: string;
    player_name: string;
    total_pitches: string;
    pitch_percent: string;
    ba: string;
    slg: string;
    slg_total: string;
    babip: string;
    babip_total_numerator: string;
    babip_total_denominator: string;
    iso: string;
    iso_total: string;
    hits: string;
    abs: string;
    singles: string;
    fouls: string;
    whiffs: string;
    swings: string;
    takes: string;
    woba: string;
    woba_value: string;
    xwoba: string;
    xwoba_value: string;
    wobadiff: string;
    pa: string;
    hrs: string;
    dbls: string;
    triples: string;
    so: string;
    launch_speed: string;
    exit_velocity: string;
    launch_angle: string;
    effective_speed: string;
    velocity: string;
    spin_rate: string;
    bbdist: string;
    eff_min_vel: string;
    swing_speed: string;
    release_extension: string;
    start_distance: string;
    pos1_int_start_distance: string;
    pos2_int_start_distance: string;
    pos3_int_start_distance: string;
    pos4_int_start_distance: string;
    pos5_int_start_distance: string;
    pos6_int_start_distance: string;
    pos7_int_start_distance: string;
    pos8_int_start_distance: string;
    pos9_int_start_distance: string;
    xba: string;
    xbadiff: string;
    xba_value: string;
    release_pos_x: string;
    release_pos_y: string;
    release_pos_z: string;
    pfx_x: string;
    pfx_z: string;
    px: string;
    pz: string;
    plate_x: string;
    plate_z: string;
    pitcher: number;
    zone: string;
}

export interface PitchZoneBatter extends PitchZonePitcher = {
    player_at_bat: string
}

export interface PitchBreakdownPitcher {
    pitches: string;
    player_id: string;
    player_name: string;
    total_pitches: string;
    pitch_percent: string;
    ba: string;
    slg: string;
    slg_total: string;
    babip: string;
    babip_total_numerator: string;
    babip_total_denominator: string;
    iso: string;
    iso_total: string;
    hits: string;
    abs: string;
    singles: string;
    fouls: string;
    whiffs: string;
    swings: string;
    takes: string;
    woba: string;
    woba_value: string;
    xwoba: string;
    xwoba_value: string;
    wobadiff: string;
    pa: string;
    hrs: string;
    dbls: string;
    triples: string;
    so: string;
    launch_speed: string;
    exit_velocity: string;
    launch_angle: string;
    effective_speed: string;
    velocity: string;
    spin_rate: string;
    bbdist: string;
    eff_min_vel: string;
    swing_speed: string;
    release_extension: string;
    start_distance: string;
    pos1_int_start_distance: string;
    pos2_int_start_distance: string;
    pos3_int_start_distance: string;
    pos4_int_start_distance: string;
    pos5_int_start_distance: string;
    pos6_int_start_distance: string;
    pos7_int_start_distance: string;
    pos8_int_start_distance: string;
    pos9_int_start_distance: string;
    xba: string;
    xbadiff: string;
    xba_value: string;
    release_pos_x: string;
    release_pos_y: string;
    release_pos_z: string;
    pfx_x: string;
    pfx_z: string;
    px: string;
    pz: string;
    plate_x: string;
    plate_z: string;
    pitcher: string;
    pitch_type: string;
}

export interface PitchBreakdownBatter extends PitchBreakdownPitcher {
    player_at_bat: string;
}