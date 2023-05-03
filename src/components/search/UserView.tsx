import Link from "next/link";
import Image from "next/image";

const UserView = (users: any) => {
  return (
    <div className="mx-auto w-72 sm:mx-0 sm:w-96 sm:pl-10">
      {users.users.length === 0 && (
        <div className="mt-10 text-center text-2xl">No users found</div>
      )}
      {users.users.map((user: any) => (
        <Link
          href={`/u/${user.username}`}
          key={user.id}
          className="mb-10 flex max-w-xs items-center gap-x-2 rounded border-2 border-primary bg-white py-5 hover:shadow-md sm:max-w-lg"
        >
          <Image
            priority={true}
            src={user.image ? user.image : "/user.png"}
            alt="User's Profile Picture"
            width="60"
            height="60"
            className="ml-5 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-xl">{user.username}</span>
            <span className="text-md">{user.name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UserView;
