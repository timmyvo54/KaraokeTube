export interface Room {
  roomId: string;
  roomName: string;
  host: User;
  password: string;
  users: User[];
  currentVideo: Video | null;
  queue: Video[];
  createdAt: Date;
}

export interface Video {
  title: string;
  addedBy: string;
  videoId: string;
  thumbnailUrl: string;
}

export interface User {
  name: string;
  userId: number;
}
