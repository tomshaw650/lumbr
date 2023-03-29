import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";

interface Props {
  logId: string;
}

const LikeLogButton: React.FC<Props> = ({ logId }) => {
  const [liked, setLiked] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const likeMutation = trpc.log.like.useMutation();
  const unlikeMutation = trpc.log.unlike.useMutation();
  const userLikeQuery = trpc.log.getUserLike.useQuery({ logId: logId });

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
      unlikeMutation.mutate({ logId });
      setLiked(false);
    } else {
      // Like the log
      likeMutation.mutate({ logId });
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

export default LikeLogButton;
