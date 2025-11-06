export interface User {
    player_id: number;
    url: string;
    username: string;
    joined: number;
    country: string;
    last_online: number;
    status: string;
    streamer: boolean;
    verified: boolean;
    league: string;
    "@id"?: string; // optional
}
