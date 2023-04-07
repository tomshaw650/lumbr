import React from "react";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import closeModal from "../utils/closeModal";

interface Props {
  userId: string;
}

const FollowersModal: React.FC<Props> = ({ userId }) => {
  const { data: followers = [] } = trpc.user.getFollowers.useQuery({ userId });

  return (
    <div className="box">
      {followers.map((followers) => (
        <div
          className="flex items-center gap-x-2"
          key={followers.followed_user_id}
        >
          <Link
            href={`/u/${followers.following_user.username}`}
            className="btn-ghost btn-circle avatar btn hover:ring hover:ring-primary hover:ring-offset-base-100"
            onClick={() => closeModal()}
          >
            <Image
              priority={true}
              src={
                followers.following_user.image
                  ? followers.following_user.image
                  : "/user.png"
              }
              alt="Followed User's Profile Picture"
              width="40"
              height="40"
              className="rounded-full"
            />
          </Link>
          <p className="text-lg font-bold">
            {followers.following_user.username}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FollowersModal;
