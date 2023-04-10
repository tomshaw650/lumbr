/**
 *
 * This page shows when the use registers for the first time
 * It allows them to alter their name, set a username
 * and add interests optionally.
 *
 */

import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

import { Formik, Form, Field } from "formik";
import { toast } from "react-hot-toast";
import { LoadingPage } from "../../components/loading";

import dynamic from "next/dynamic";
const SwitchTheme = dynamic(() => import("../../components/SwitchTheme"), {
  ssr: false,
});

const NewUser: NextPage = () => {
  // initialise the router and trpc queries
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = trpc.user.getUser.useQuery();
  const update = trpc.user.update.useMutation();
  const tags = trpc.auth.getAllTags.useQuery();

  // if the user is not logged in, redirect to login page
  if (status === "unauthenticated") {
    router.push("/auth/login");
  }

  // if username is set and user is logged in, redirect to home page
  if (user.data?.username && status === "authenticated") {
    router.push("/home");
  }

  // loading state until user is loaded
  // checking user as its important to fill out the form
  if (user.isLoading) {
    return <LoadingPage />;
  }

  // for use in splitting the name into first and last
  const name = user?.data?.name?.split(" ");

  return (
    <div className="flex w-full flex-col">
      <Head>
        <title>Lumbr | Account Setup</title>
      </Head>
      <nav className="navbar flex">
        <div className="flex-none">
          <Link href="/" className="btn-ghost btn-circle btn ml-10">
            <Image src="/lumbr.png" alt="Lumbr logo" width="100" height="100" />
          </Link>
        </div>
        <div className="navbar-end mr-10 flex-1">
          <SwitchTheme />
        </div>
      </nav>
      <header className="flex flex-col place-items-center">
        <h1 className="text-4xl font-bold sm:text-5xl">Almost there...</h1>
        <ul className="steps steps-vertical lg:mt-10">
          <li className="step-primary step font-bold" />
          <li className="step-primary step font-bold" />
          <li className="step font-bold" data-content="✓" />
        </ul>
      </header>
      <Formik
        initialValues={{
          firstName: name?.[0],
          lastName: name?.[1],
          username: "",
          interests: [],
        }}
        onSubmit={async (values: any, { setSubmitting }) => {
          // remove any whitespace from firstname and lastname
          values.firstName = values.firstName.replace(/\s/g, "");
          values.lastName = values.lastName.replace(/\s/g, "");

          // if first name or last name is empty, set error
          if (values.firstName === "" || values.lastName === "") {
            toast.error("First name and last name cannot be empty.");
            return;
          }

          setSubmitting(false);
          const interests = values.interests.map((tag: string) => ({
            user_id: user.data?.id,
            tag_id: tag,
          }));
          await update
            .mutateAsync({
              name: values.firstName + " " + values.lastName,
              username: values.username,
              interests: interests,
            })
            .then(() => {
              router.push("/home");
            })
            .catch((err) => {
              const message = err.message;
              const error = JSON.parse(message);
              toast.error(error[0]?.message);
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
                  className="label-text-alt tooltip tooltip-primary text-lg"
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
              <label className="label" htmlFor="interests">
                <span className="label-text">
                  What are your developer interests?{" "}
                  <span
                    className="tooltip tooltip-primary italic"
                    data-tip="Select as many interests as you like!"
                  >
                    (optional)
                  </span>
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

export default NewUser;
