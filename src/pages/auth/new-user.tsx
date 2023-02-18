import type { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Formik, Form, Field, FieldArray } from "formik";
import { trpc } from "../../utils/trpc";

// TODO:
// the page obv needs styles
// the page neesd proper error handling

const NewUser: NextPage = () => {
  const router = useRouter();
  const user = trpc.user.getUser.useQuery();
  const update = trpc.user.update.useMutation();
  const tags = trpc.auth.getAllTags.useQuery();

  const { data: session } = useSession();

  // if the user has set a username (has been here before)
  // redirect them to the home page
  useEffect(() => {
    if (user.data?.username !== undefined) {
      router.push("/home");
      console.log(user.data?.username);
    }
  }, []);

  // loading state until user is loaded
  // checking user as its important to fill out the form
  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen w-screen">
      <Formik
        initialValues={{ name: user.data?.name, username: "", interests: [] }}
        onSubmit={async (values: any, { setSubmitting }) => {
          setSubmitting(false);
          const interests = values.interests.map((tag: String) => ({
            user_id: user.data?.id,
            tag_id: tag,
          }));

          console.log(interests);
          await update.mutateAsync({
            name: values.name,
            username: values.username,
            interests: interests,
          });
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex items-center rounded-lg border-gray-300 p-4">
            <div className="form-control flex w-full max-w-xs flex-col">
              <label className="label" htmlFor="name">
                <span className="label-text">What is your name?</span>
              </label>
              <Field
                name="name"
                type="text"
                placeholder="Name"
                className="input-bordered input mb-4 bg-white"
              />
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
                  What are your developer interests?
                </span>
              </label>
              <Field
                name="interests"
                as="select"
                multiple
                className="select-bordered select mb-4 bg-white pt-2 text-lg"
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
