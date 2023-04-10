import type { NextPage, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import NavBar from "../../components/NavBar";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "../../server/trpc/router/_app";
import { prisma } from "../../server/db/client";
import type { User } from "@prisma/client";
import superjson from "superjson";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { LoadingPage, LoadingSpinner } from "../../components/loading";
import { SiAddthis } from "react-icons/si";
import formatDate from "../../utils/formatDate";
import { Formik, Form, Field } from "formik";
import { toast } from "react-hot-toast";
import FollowersModal from "../../components/FollowersModal";
import FollowingModal from "../../components/FollowingModal";
import FourOhFour from "../404";

const EditProfileModal = (user: any) => {
  const router = useRouter();
  const tags = trpc.auth.getAllTags.useQuery();
  const {
    data: interests,
    isLoading,
    isSuccess,
  } = trpc.user.getInterests.useQuery({
    userId: user.user.id,
  });
  const addTags = trpc.user.addTagToUser.useMutation();
  const removeTags = trpc.user.removeTagFromUser.useMutation();

  const edit = trpc.profile.edit.useMutation({
    onSuccess: () => {
      if (isSuccess) {
        router.reload();
      }
    },
  });

  const name = user.user.name?.split(" ");

  if (isLoading) return <LoadingSpinner />;
  if (!interests) return null;

  return (
    <div className="overflow-x-hidden">
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      <Formik
        initialValues={{
          firstName: name?.[0],
          lastName: name?.[1],
          username: user.user.username,
          image: user.user.image,
          bio: user.user.bio,
          interests: interests.map((tag) => tag.tag_id) || [],
        }}
        onSubmit={async (values: any, { setSubmitting }) => {
          values.firstName = values.firstName.replace(/\s/g, "");
          values.lastName = values.lastName.replace(/\s/g, "");

          // if first name or last name is empty, set error
          if (values.firstName === "" || values.lastName === "") {
            toast.error("Name cannot be empty!");
            return;
          }

          setSubmitting(false);

          // Create an array of tag IDs that were selected in the form
          const selectedTagIds = values.interests;

          // Create an array of tag IDs that are currently associated with the log
          const currentTagIds = interests.map((interests) => interests.tag_id);

          // Create an array of tag IDs that need to be removed from the log
          const tagsToRemove = currentTagIds?.filter(
            (tagId) => !selectedTagIds.includes(tagId)
          );

          if (tagsToRemove) {
            await Promise.all(
              tagsToRemove.map(async (tagId) => {
                await removeTags.mutateAsync({
                  userId: user.user.id,
                  tagId: tagId,
                });
              })
            );
          }

          // Create an array of tag objects that need to be added to the log
          const tagsToAdd = selectedTagIds
            .filter((tagId: any) => !currentTagIds?.includes(tagId))
            .map((tagId: any) => ({ tag_id: tagId }));

          // Add the tags that need to be added to the log
          await edit
            .mutateAsync({
              name: values.firstName + " " + values.lastName,
              username: values.username,
              bio: values.bio,
              image: values.image,
            })
            .then(() => {
              if (tagsToAdd) {
                addTags.mutateAsync({
                  userId: user.user.id,
                  interests: tagsToAdd,
                });
              }
            })
            .catch((err) => {
              const errorMessage = err.data?.zodError?.fieldErrors.content;
              if (errorMessage && errorMessage[0]) {
                toast.error(errorMessage[0]);
              } else {
                toast.error("Failed to update! Please try again later.");
              }
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex items-center justify-around">
            <div className="form-control max-w-xs lg:max-w-md">
              <label className="label" htmlFor="name">
                <span className="label-text">What is your name?</span>
              </label>
              <div className="flex">
                <Field
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  className="input-bordered input mb-4 mr-2 w-32 bg-white"
                />
                <Field
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  className="input-bordered input mb-4 ml-2 w-32 bg-white"
                />
              </div>
              <label className="label" htmlFor="username">
                <span className="label-text">Please enter a username</span>
                <span
                  className="text-md label-text-alt tooltip tooltip-primary"
                  data-tip="Username must be between 2-20 characters and contain no whitespace."
                >
                  (?)
                </span>
              </label>
              <Field
                name="username"
                type="text"
                placeholder="Username"
                className="input-bordered input mb-4 bg-white"
              />
              <label className="label" htmlFor="image">
                <span className="label-text">Upload a profile picture</span>
                <span
                  className="text-md label-text-alt tooltip tooltip-primary"
                  data-tip="Profile picture must be a valid image URL."
                >
                  (?)
                </span>
              </label>
              <Field
                name="image"
                type="text"
                placeholder="Image URL"
                className="input-bordered input mb-4 bg-white"
              />
              <label className="label" htmlFor="bio">
                <span className="label-text">Tell us about yourself</span>
                <span
                  className="text-md label-text-alt tooltip tooltip-primary"
                  data-tip="Bio can be up to 60 characters."
                >
                  (?)
                </span>
              </label>
              <Field
                name="bio"
                type="text"
                placeholder="Bio"
                className="input-bordered input mb-4 bg-white"
              />
              <label className="label" htmlFor="interests">
                <span className="label-text">Update your interests:</span>
                <span
                  className="text-md label-text-alt tooltip tooltip-primary"
                  data-tip="Select as many interests as you like!"
                >
                  (optional)
                </span>
              </label>
              <Field
                name="interests"
                as="select"
                multiple
                className="select-bordered select mb-4 bg-white py-12 pt-2 text-lg"
              >
                {tags.data?.map((tag) => (
                  <option key={tag.tag_id} value={tag.tag_id}>
                    {tag.tag_name}
                  </option>
                ))}
              </Field>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary btn text-white"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const FollowCount = ({ user }: { user: User }) => {
  const { data: followers } = trpc.user.getFollowers.useQuery({
    userId: user.id,
  });
  const { data: following } = trpc.user.getFollowing.useQuery({
    userId: user.id,
  });

  return (
    <div className="ml-5 flex items-center gap-x-2">
      <div className="flex items-center">
        <label
          htmlFor="following"
          className="text-md cursor-pointer text-slate-500 hover:underline"
        >
          {following?.length} following
        </label>
        <input type="checkbox" id="following" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">
              Users {user.username} follows:
            </h3>
            <FollowingModal userId={user.id} />
            <div className="modal-action">
              <label htmlFor="following" className="btn-circle btn">
                X
              </label>
            </div>
          </div>
        </div>
      </div>
      <span className="text-xl text-slate-500">·</span>
      <label
        htmlFor="followers"
        className="text-md cursor-pointer text-slate-500 hover:underline"
      >
        {followers?.length} followers
      </label>
      <input type="checkbox" id="followers" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            {user.username}&apos;s Followers:
          </h3>
          <FollowersModal userId={user.id} />
          <div className="modal-action">
            <label htmlFor="followers" className="btn-circle btn">
              X
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const ctx = trpc.useContext();
  const { data: session } = useSession();

  const { data: user } = trpc.profile.getUserByUsername.useQuery({ username });
  const { data: navUser, isLoading: userIsLoading } =
    trpc.user.getUser.useQuery();
  const follow = trpc.user.follow.useMutation({
    onSuccess: () => {
      void ctx.user.getFollowers.invalidate();
      void ctx.user.isFollowing.invalidate();
    },
    onError: (err) => {
      if (err.data?.zodError?.formErrors && err.data?.zodError?.formErrors[0]) {
        toast.error(err.data?.zodError?.formErrors[0]);
      } else {
        toast.error("Failed to follow user! Please try again later.");
      }
    },
  });
  const unfollow = trpc.user.unfollow.useMutation({
    onSuccess: () => {
      void ctx.user.getFollowers.invalidate();
      void ctx.user.isFollowing.invalidate();
    },
    onError: (err) => {
      if (err.data?.zodError?.formErrors && err.data?.zodError?.formErrors[0]) {
        toast.error(err.data?.zodError?.formErrors[0]);
      } else {
        toast.error("Failed to unfollow user! Please try again later.");
      }
    },
  });

  const followUser = (userId: string) => {
    follow.mutateAsync({ userId: userId });
  };

  const unfollowUser = (userId: string) => {
    unfollow.mutateAsync({ userId: userId });
  };

  if (!user) return <FourOhFour />;
  const { data: logs, isLoading } = trpc.log.getLogsByUserId.useQuery({
    userId: user?.id,
  });
  const { data: isFollowing, isLoading: isFollowingLoading } =
    trpc.user.isFollowing.useQuery({
      userId: user?.id,
    });

  if (isLoading || userIsLoading || isFollowingLoading) return <LoadingPage />;

  return (
    <div>
      <Head>
        <title>{user.username} | Lumbr</title>
        <meta name="description" content="Lumbr" />
      </Head>

      <NavBar user={navUser} />
      <div className="grid grid-cols-1 sm:grid-cols-10">
        <section className="sticky col-span-2 flex flex-col border-r-2 border-neutral border-opacity-50 sm:h-screen">
          <div className="mt-16 p-2">
            <Image
              priority={true}
              src={user.image ? user.image : "/user.png"}
              alt="Commenter's Profile Picture"
              width="220"
              height="220"
              className="mx-auto rounded-full border-4 border-black"
            />
            <h1 className="ml-5 mt-3 text-3xl font-bold">{user.name}</h1>
            <h2 className="ml-5 text-xl">{user.username}</h2>
            <FollowCount user={user} />
            {user.bio !== null && (
              <p className="mt-5 rounded border-2 border-neutral p-2">
                {user.bio}
              </p>
            )}
            {session?.user?.id === user.id && (
              <>
                <label
                  htmlFor="edit-profile"
                  className="btn-primary btn mt-5 text-white"
                >
                  Edit Profile
                </label>
                <input
                  type="checkbox"
                  id="edit-profile"
                  className="modal-toggle"
                />
                <div className="modal">
                  <div className="modal-box">
                    <EditProfileModal user={user} />
                    <div className="modal-action">
                      <label htmlFor="edit-profile" className="btn-circle btn">
                        X
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
            {session && session?.user?.id !== user.id && (
              <>
                {!isFollowing && (
                  <button
                    className="btn-primary btn mt-5 text-white"
                    onClick={() => followUser(user.id)}
                  >
                    Follow
                  </button>
                )}
                {isFollowing && (
                  <button
                    className="btn-error btn mt-5 text-white"
                    onClick={() => unfollowUser(user.id)}
                  >
                    Unfollow
                  </button>
                )}
              </>
            )}
          </div>
        </section>
        <section className="col-span-8 p-10">
          <div className="flex items-center gap-x-2">
            <h3 className="mb-5 p-2 text-3xl">{user.username}&apos;s logs</h3>
            {session?.user?.id === user.id && (
              <Link href="/log/create">
                <SiAddthis className="mb-5 text-xl hover:text-primary" />
              </Link>
            )}
          </div>
          {logs?.map((log) => (
            <div key={log.log_id} className="mb-5 flex items-center gap-x-2">
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
                  <span className="mt-1 text-primary">
                    Created on {formatDate(log.created_at.toISOString())}
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const username = context.params?.username as string;

  if (typeof username !== "string") throw new Error("no username");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
