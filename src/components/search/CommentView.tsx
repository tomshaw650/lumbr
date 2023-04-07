import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CommentView = (comments: any) => {
  return (
    <div className="pl-10">
      {comments.comments.length === 0 && (
        <div className="mt-10 text-center text-2xl">No comments found</div>
      )}
      {comments.comments.map((comment: any) => (
        <Link
          href={
            comment.post_id
              ? `/post/${comment.post_id}`
              : `/log/${comment.log_id}`
          }
          key={
            comment.post_id
              ? `/post/${comment.post_id}`
              : `/log/${comment.log_id}`
          }
          className="mb-10 flex max-w-xs items-center gap-x-2 rounded border-2 border-primary bg-white py-5 hover:shadow-md sm:max-w-lg"
        >
          <Image
            priority={true}
            src={comment.user.image ? comment.user.image : "/user.png"}
            alt="Log Author's Profile Picture"
            width="60"
            height="60"
            className="ml-5 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-xl">Comment by {comment.user.username}</span>
            <span className="italic">&quot;{comment.body}&quot;</span>
            <span className="text-md">{`Created ${dayjs(
              comment.created_at
            ).fromNow()}`}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CommentView;
