import { Comment } from "../types/prisma";
import CommentComponent from "./Comment";

interface Props {
  comments: Comment[];
}

const Comments: React.FC<Props> = ({ comments }) => {
  return (
    <div>
      {comments?.length === 0 ? (
        <div>No comments yet. Why not start the discussion?</div>
      ) : (
        comments?.map((comment) => (
          <CommentComponent comment={comment} key={comment.comment_id} />
        ))
      )}
    </div>
  );
};

export default Comments;
