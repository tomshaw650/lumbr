import type { Comment } from "../types/prisma";
import Image from "next/image";
import Link from "next/link";
import formatDate from "../utils/formatDate";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import { useSession } from "next-auth/react";

const CommentComponent = ({ comment }: { comment: Comment }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { data: session } = useSession();
  const ctx = trpc.useContext();

  const dlt = trpc.comment.delete.useMutation();

  const isAuthed = session?.user?.id === comment.user_id;

  const handleDelete = async () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    await dlt.mutateAsync({ comment_id: comment.comment_id }).then(() => {
      void ctx.comment.getAll.invalidate();
    });
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className="card mb-5 w-96 bg-white p-5">
      {isAuthed && (
        <>
          {showConfirm ? (
            <div>
              <p>Are you sure you want to delete this comment?</p>
              <button className="mr-3" onClick={confirmDelete}>
                Yes
              </button>
              <button onClick={cancelDelete}>No</button>
            </div>
          ) : (
            <button
              className="btn-sm btn w-fit bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </>
      )}
      <p className="italic">
        Posted on {formatDate(comment.created_at.toISOString())}
      </p>
      <div className="flex items-center gap-x-2">
        <Link
          href={`/u/${comment.user.username}`}
          className="btn-ghost btn-circle avatar btn hover:ring hover:ring-primary hover:ring-offset-base-100"
        >
          <Image
            priority={true}
            src={comment.user.image ? comment.user.image : "/user.png"}
            alt="Commenter's Profile Picture"
            width="40"
            height="40"
            className="rounded-full"
          />
        </Link>
        <p className="text-lg font-bold">
          {comment.user.username} <span className="font-light">said:</span>
        </p>
      </div>
      <p className="mt-4">{comment.body}</p>
    </div>
  );
};

export default CommentComponent;
