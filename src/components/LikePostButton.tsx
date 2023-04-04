import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";

interface Props {
  postId: string;
}

const LikePostButton: React.FC<Props> = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const ctx = trpc.useContext();
  const router = useRouter();
  const { data: session } = useSession();
  const likeMutation = trpc.post.like.useMutation({
    onSuccess: () => {
      void ctx.post.getAllLikes.invalidate();
    },
  });
  const unlikeMutation = trpc.post.unlike.useMutation({
    onSuccess: () => {
      void ctx.post.getAllLikes.invalidate();
    },
  });
  const userLikeQuery = trpc.post.getUserLike.useQuery({ postId: postId });

  // Fetch user's like status for this log
  const userLike = userLikeQuery.data;

  useEffect(() => {
    if (userLike) {
      // Set liked state based on user's like status
      setLiked(true);
    }
  }, [userLike]);

  const handleClick = async () => {
    if (!session) {
      // redirect to login page if user is not logged in
      router.push("/auth/login");
      return;
    }

    if (liked) {
      // Unlike the log
      unlikeMutation.mutate({ postId });
      setLiked(false);
    } else {
      // Like the log
      likeMutation.mutate({ postId });
      setLiked(true);
    }
  };

  return (
    <button
      className="btn-ghost btn text-xl hover:bg-transparent"
      onClick={handleClick}
    >
      {liked ? <BsHandThumbsUpFill /> : <BsHandThumbsUp />}
    </button>
  );
};

export default LikePostButton;
