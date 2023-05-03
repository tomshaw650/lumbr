import Image from "next/image";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { LoadingPage } from "./loading";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const ExploreView = () => {
  const { data, isLoading } = trpc.home.following.useQuery();

  if (isLoading) return <LoadingPage />;

  if (!data) return null;

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
            className="w-full max-w-sm hover:shadow-md"
          >
            <div
              key={log.log_id}
              className="flex w-60 flex-col rounded border-2 border-solid border-primary p-2 sm:w-96"
            >
              <span className="text-xl font-bold">{log.title}</span>
              <span className="font-semibold">{log.description}</span>
              <ul className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                {log.log_tags.map((log_tag) => (
                  <li
                    className="badge-primary badge text-white"
                    key={log_tag.tag_id}
                  >
                    {log_tag.tag.tag_name}
                  </li>
                ))}
              </ul>
              <span className="mt-1">{`Created ${dayjs(
                log.created_at
              ).fromNow()}`}</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ExploreView;
