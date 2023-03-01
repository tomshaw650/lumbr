import type { Log as PrismaLog } from "@prisma/client";

export interface Log extends PrismaLog {
  user: User;
  posts: Post[];
}

interface User {
  username: string;
}

interface Post {
  post_id: string;
  title: string;
  created_at: DateTime;
}
