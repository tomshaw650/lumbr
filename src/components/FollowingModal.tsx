import React from "react";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import closeModal from "../utils/closeModal";

interface Props {
  userId: string;
}

const FollowingModal: React.FC<Props> = ({ userId }) => {
  const { data: following = [] } = trpc.user.getFollowing.useQuery({ userId });

  return (
    <div className="box">
      {following.map((following) => (
        <div
          className="flex items-center gap-x-2"
          key={following.following_user_id}
        >
          <Link
            href={`/u/${following.followed_user.username}`}
            className="btn-ghost btn-circle avatar btn hover:ring hover:ring-primary hover:ring-offset-base-100"
            onClick={() => closeModal()}
          >
            <Image
              priority={true}
              src={
                following.followed_user.image
                  ? following.followed_user.image
                  : "/user.png"
              }
              alt="Following User's Profile Picture"
              width="40"
              height="40"
              className="rounded-full"
            />
          </Link>
          <p className="text-lg font-bold">
            {following.followed_user.username}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FollowingModal;
