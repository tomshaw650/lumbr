import { useEffect, useState } from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { prisma } from "../../server/db/client";
import { trpc } from "../../utils/trpc";
import { Log } from "../../types/prisma";
import { Formik, Form, Field } from "formik";
import NavBar from "../../components/NavBar";
import BackLink from "../../components/BackLink";
import { Post } from "@prisma/client";
import CommentSection from "../../components/CommentSection";
import LikeLogButton from "../../components/LikeLogButton";
import UsersLikedLogModal from "../../components/UsersLikedLogModal";
import AddTagsModal from "../../components/AddTagsModal";
import DeleteLogModal from "../../components/DeleteLogModal";
import { LoadingPage } from "../../components/loading";
import FourOhFour from "../404";

interface reportProps {
  logId: string;
  userId: string;
}

const ReportModal = ({ logId, userId }: reportProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const report = trpc.log.report.useMutation({
    onSuccess: () => {
      toast.success("Report sent.");
      router.reload();
    },
    onError: (err) => {
      const message = err.data?.zodError?.fieldErrors.content;
      if (message && message[0]) {
        toast.error(message[0]);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  if (!session?.user) {
    return <FourOhFour />;
  }

  return (
    <Formik
      initialValues={{
        logId: logId,
        reporterId: session.user?.id,
        userId: userId,
        reason: "",
      }}
      onSubmit={async (values) => {
        await report.mutateAsync(values);
      }}
    >
      <Form className="flex flex-col">
        <label className="label" htmlFor="reason">
          <span className="label-text">
            Why do you want to report this log?
          </span>
          <span
            className="tooltip tooltip-left tooltip-primary"
            data-tip="Please add a reason for the report. Minimum 2 characters; maximum 60 charaters."
          >
            (?)
          </span>
        </label>
        <Field
          className="input-bordered input bg-white"
          name="reason"
          type="text"
        />
        <button
          className="btn my-5 w-fit bg-red-600 text-white hover:bg-red-700"
          type="submit"
        >
          Send Report
        </button>
      </Form>
    </Formik>
  );
};

const Log = (props: { log: Log }) => {
  const { data: session } = useSession();
  const [likeCount, setLikeCount] = useState(0);
  const { data, isLoading } = trpc.user.getUserPublic.useQuery();
  const allLikes = trpc.log.getAllLikes.useQuery({ logId: props.log.log_id });
  const logTags = trpc.log.getLogTags.useQuery({ logId: props.log.log_id });

  useEffect(() => {
    setLikeCount(allLikes.data?.length || 0);
  }, [allLikes.data, likeCount]);

  // wait until we have the user data before rendering the page
  if (isLoading) return <LoadingPage />;

  // if the log doesn't exist, return a 404 page (TODO)
  if (!props.log) return <div>Log not found</div>;

  const links = [
    { href: "/home", text: "Home", current: false },
    {
      href: `/u/${props.log.user.username}`,
      text: props.log.user.username,
      current: false,
    },
    { href: window.location.href, text: props.log.title, current: true },
  ];

  return (
    <div>
      <Head>
        <meta
          property="og:image"
          content={`https://www.lumbr.dev/api/og?title=${props.log.title}&username=${props.log.user.username}&desc=${props.log.description}&pfp=${props.log.user.image}`}
        />
        <title>
          Lumbr | {props.log.user.username} - {props.log.title}
        </title>
      </Head>
      <NavBar user={data} />
      <div className="ml-5 mt-2 flex">
        {links.map((link, index) => {
          return (
            <BackLink
              key={index}
              href={link.href}
              text={link.text || ""}
              current={link.current}
            />
          );
        })}
      </div>
      <div className="mx-auto mt-10 flex w-72 flex-col items-center rounded-md border-2 border-black border-opacity-20 py-2 sm:w-96">
        <h1 className="text-2xl font-bold">{props.log.title}</h1>
        <p className="text-sm text-gray-500">
          by{" "}
          <Link
            className="underline hover:font-bold"
            href={`/u/${props.log.user.username}`}
          >
            {props.log.user.username}
          </Link>
        </p>
        <div className="mt-2 flex flex-col place-items-center">
          {data?.username === props.log.user.username && (
            <>
              <label
                htmlFor="add-tags"
                className="cursor-pointer text-sm text-gray-500 hover:underline"
              >
                Add tags?
              </label>
            </>
          )}
          <ul className="flex flex-wrap justify-center gap-x-2 gap-y-1">
            {logTags.data?.map((tag) => (
              <li
                className="badge-primary badge text-white"
                key={tag.tag.tag_id}
              >
                {tag.tag.tag_name}
              </li>
            ))}
          </ul>
          <input type="checkbox" id="add-tags" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <h3 className="text-lg font-bold">Add some tags</h3>
              <AddTagsModal logId={props.log.log_id} />
              <div className="modal-action">
                <label htmlFor="add-tags" className="btn-circle btn bg-white">
                  X
                </label>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-5 max-w-sm text-center">{props.log.description}</p>
        {session && data?.username !== props.log.user.username && (
          <>
            <label
              htmlFor="report"
              className="btn mt-2 bg-red-600 text-white hover:bg-red-700"
            >
              Report
            </label>
            <input type="checkbox" id="report" className="modal-toggle" />
            <div className="modal">
              <div className="modal-box">
                <h3 className="text-lg font-bold">Report {props.log.title}</h3>
                <ReportModal
                  logId={props.log.log_id}
                  userId={props.log.user_id}
                />
                <div className="modal-action">
                  <label htmlFor="report" className="btn-circle btn">
                    X
                  </label>
                </div>
              </div>
            </div>
          </>
        )}
        {session && data?.username === props.log.user.username && (
          <>
            <label
              htmlFor="delete"
              className="btn mt-2 bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </label>
            <input type="checkbox" id="delete" className="modal-toggle" />
            <div className="modal">
              <div className="modal-box">
                <h3 className="text-lg font-bold">Delete {props.log.title}?</h3>
                <DeleteLogModal logId={props.log.log_id} />
                <div className="modal-action">
                  <label htmlFor="delete" className="btn-circle btn">
                    X
                  </label>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="divider mt-5" />
      {data?.username === props.log.user.username && (
        <div className="flex justify-center">
          <Link href={`/post/create`}>
            <button className="btn-primary btn text-white">Add Post</button>
          </Link>
        </div>
      )}
      <div className="mt-5 flex flex-col items-center">
        {props.log.posts.map((post) => (
          <Link
            key={post.post_id}
            className="w-72 max-w-md sm:w-96 md:max-w-lg"
            href={`/post/${post.post_id}`}
          >
            <div className="mt-5 rounded-md border-2 border-black border-opacity-20 bg-white p-5 hover:shadow-md dark:hover:drop-shadow-[0_4px_3px_rgba(255,255,255,0.2)]">
              <h2 className="text-xl font-bold dark:text-primary">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500">
                on {formatDate(post.created_at)}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="divider mt-5" />
      <div className="mb-5 flex flex-col items-center">
        <div className="mb-5 flex items-center gap-x-5">
          <label
            className="cursor-pointer text-lg underline hover:text-primary"
            htmlFor="likes-modal"
          >
            {likeCount === 1 ? likeCount + " like" : likeCount + " likes"}
          </label>
          <input type="checkbox" id="likes-modal" className="modal-toggle" />
          <div className="modal" id="likes-modal">
            <div className="modal-box">
              <h3 className="text-lg font-bold">Users who liked this log:</h3>
              <UsersLikedLogModal logId={props.log.log_id} />
              <div className="modal-action">
                <label htmlFor="likes-modal" className="btn-circle btn">
                  X
                </label>
              </div>
            </div>
          </div>
          <LikeLogButton logId={props.log.log_id} />
        </div>
        <h2 className="text-2xl font-bold">Comment Section</h2>
        <CommentSection />
      </div>
    </div>
  );
};

// take the ISOString and format it to a readable date (UK format)
const formatDate = (date: string) => {
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return dateFormatter.format(new Date(date));
};

// get the log id from the url and prepare the data prop for the page
export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.id || typeof params.id !== "string") {
    return {
      notFound: true,
      revalidate: 60,
    };
  }
  const id = params.id;

  const logInfo = await prisma.log.findFirst({
    where: {
      log_id: {
        equals: id,
      },
    },
    include: {
      user: true, // bring in the related user
      posts: true, // bring in the related posts
    },
  });

  if (!logInfo) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const logWithSerializedData = {
    ...logInfo,
    created_at: logInfo?.created_at.toISOString(),
    updated_at: logInfo?.updated_at.toISOString(),
    posts: logInfo.posts.map((post: Post) => ({
      ...post,
      created_at: post.created_at.toISOString(),
      updated_at: post.updated_at.toISOString(),
    })),
  };

  return { props: { log: logWithSerializedData }, revalidate: 60 };
};

// tell nextjs to generate the page for each log id
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export default Log;
