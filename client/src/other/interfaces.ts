export interface RoomData {
  room_name: string;
  host_name: string;
  create_room_password: string;
}

export interface JoinData {
  user_name: string;
  room_code: string;
  join_room_password: string;
}
