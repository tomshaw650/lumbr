import type { Comment } from "../types/prisma";
import CommentComponent from "./CommentComponent";

interface Props {
  comments: Comment[];
}

const Comments: React.FC<Props> = ({ comments }) => {
  return (
    <div>
      {comments?.length === 0 ? (
        <div className="text-center">
          No comments yet. Why not start the discussion?
        </div>
      ) : (
        comments?.map((comment) => (
          <CommentComponent comment={comment} key={comment.comment_id} />
        ))
      )}
    </div>
  );
};

export default Comments;
