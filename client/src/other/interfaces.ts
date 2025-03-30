export interface CreateRoomData {
  room_name: string;
  host_name: string;
  create_room_password: string;
}

export interface JoinRoomData {
  user_name: string;
  room_code: string;
  join_room_password: string;
}

export interface User {
  name: string;
  user_id: number;
}
