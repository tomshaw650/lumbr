import Image from "next/image";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { LoadingPage } from "./loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const ExploreView = () => {
  const { data, isLoading } = trpc.home.explore.useQuery();

  if (isLoading) return <LoadingPage />;

  if (!data) return null;

  console.log(data);

  return (
    <div className="ml-4">
      {data.map((log) => (
        <div key={log.log_id} className="mb-10 flex items-center gap-x-2">
          <Link
            href={`/u/${log.user.username}`}
            className="btn-ghost btn-circle avatar btn hover:ring hover:ring-primary hover:ring-offset-base-100"
          >
            <Image
              priority={true}
              src={log.user.image ? log.user.image : "/user.png"}
              alt="Log Author's Profile Picture"
              width="40"
              height="40"
              className="rounded-full"
            />
          </Link>
          <Link
            href={`/log/${log.log_id}`}
            className="w-full max-w-xl hover:shadow-lg"
          >
            <div
              key={log.log_id}
              className="flex flex-col rounded border-2 border-solid border-primary p-2"
            >
              <span className="text-xl font-bold">{log.title}</span>
              <span className="font-semibold">{log.description}</span>
              <span>{`Created ${dayjs(log.created_at).fromNow()}`}</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ExploreView;
