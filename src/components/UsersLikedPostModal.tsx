import React from "react";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import closeModal from "../utils/closeModal";

interface Props {
  postId: string;
}

const UsersLikedPostModal: React.FC<Props> = ({ postId }) => {
  const { data: likes = [] } = trpc.post.getAllLikes.useQuery({ postId });

  return (
    <div className="box">
      {likes.map((like) => (
        <div className="flex items-center gap-x-2" key={like.user_id}>
          <Link
            href={`/u/${like.user.username}`}
            className="btn-ghost btn-circle avatar btn hover:ring hover:ring-primary hover:ring-offset-base-100"
            onClick={() => closeModal()}
          >
            <Image
              priority={true}
              src={like.user.image ? like.user.image : "/user.png"}
              alt="Commenter's Profile Picture"
              width="40"
              height="40"
              className="rounded-full"
            />
          </Link>
          <p className="text-lg font-bold">{like.user.username}</p>
        </div>
      ))}
    </div>
  );
};

export default UsersLikedPostModal;
