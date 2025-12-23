export interface Comment {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  avatar?: string;
  parentId?: string;
  replies?: Comment[];
  likes: number;
  likedBy: string[];
}