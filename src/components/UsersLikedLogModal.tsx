import React from "react";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "../utils/trpc";

interface Props {
  logId: string;
}

const UsersLikedLogModal: React.FC<Props> = ({ logId }) => {
  const { data: likes = [] } = trpc.log.getAllLikes.useQuery({ logId });

  return (
    <div className="box">
      {likes.map((like) => (
        <div className="flex items-center gap-x-2" key={like.user_id}>
          <Link
            href={`/u/${like.user_id}`}
            className="btn-ghost btn-circle avatar btn hover:ring hover:ring-primary hover:ring-offset-base-100"
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

export default UsersLikedLogModal;
