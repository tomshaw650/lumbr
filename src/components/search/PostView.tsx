import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const PostView = (posts: any) => {
  return (
    <div className="pl-10">
      {posts.posts.length === 0 && (
        <div className="mt-10 text-center text-2xl">No posts found</div>
      )}
      {posts.posts.map((post: any) => (
        <Link
          href={`/post/${post.post_id}`}
          key={post.post_id}
          className="mb-10 flex max-w-xs items-center gap-x-2 rounded border-2 border-primary bg-white py-5 hover:shadow-md sm:max-w-lg"
        >
          <Image
            priority={true}
            src={post.user.image ? post.user.image : "/user.png"}
            alt="Log Author's Profile Picture"
            width="60"
            height="60"
            className="ml-5 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-xl">
              {post.title} by {post.user.username}
            </span>
            <span className="text-md">{`Created ${dayjs(
              post.created_at
            ).fromNow()}`}</span>
            <span className="font-semibold">{post.description}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostView;
