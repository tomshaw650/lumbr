import type {
  Log as PrismaLog,
  Post as PrismaPost,
  Comment as PrismaComment,
} from "@prisma/client";

// extend the log with user and post info
export interface Log extends PrismaLog {
  user: User;
  posts: PostInfo[];
}

interface PostInfo {
  post_id: string;
  title: string;
  created_at: DateTime;
}

interface User {
  username: string | null;
  image: string | null;
}

// extend the post with user and log info
export interface Post extends PrismaPost {
  user: User;
  logs: LogInfo[];
  created_at: string;
}

interface LogInfo {
  log_id: string;
  title: string;
}

// extend the comment with user info
export interface Comment extends PrismaComment {
  user: User;
}
