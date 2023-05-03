import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const LogView = (logs: any) => {
  return (
    <div className="mx-auto w-72 pl-10 sm:mx-0 sm:w-96 sm:pl-10">
      {logs.logs.length === 0 && (
        <div className="mt-10 text-center text-2xl">No logs found</div>
      )}
      {logs.logs.map((log: any) => (
        <Link
          href={`/log/${log.log_id}`}
          key={log.log_id}
          className="mb-10 flex max-w-xs items-center gap-x-2 rounded border-2 border-primary bg-white py-5 hover:shadow-md sm:max-w-lg"
        >
          <Image
            priority={true}
            src={log.user.image ? log.user.image : "/user.png"}
            alt="Log Author's Profile Picture"
            width="60"
            height="60"
            className="ml-5 rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-xl">
              {log.title} by {log.user.username}
            </span>
            <span className="text-md">{`Created ${dayjs(
              log.created_at
            ).fromNow()}`}</span>
            <span className="font-semibold">{log.description}</span>
            <ul className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
              {log.log_tags.map((log_tag: any) => (
                <li
                  className="badge-primary badge text-white"
                  key={log_tag.tag_id}
                >
                  {log_tag.tag.tag_name}
                </li>
              ))}
            </ul>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LogView;
