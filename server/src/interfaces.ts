export interface Room {
  roomId: string;
  roomName: string;
  hostName: string;
  password: string;
  users: string[];
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
