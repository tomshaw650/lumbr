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
  if (user.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Formik
      initialValues={{ name: user.data?.name, username: "", interests: [] }}
      onSubmit={async (values: any, { setSubmitting }) => {
        setSubmitting(false);
        await update.mutateAsync({
          name: values.name,
          username: values.username,
          interests: values.interests,
        });
        if (update.error) {
          console.log(update.error);
        } else {
          router.push("/home");
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="name" type="text" placeholder="Name" />
          <Field name="username" type="text" placeholder="Username" />
          <Field name="interests" as="select" multiple>
            {tags.data?.map((tag) => (
              <option key={tag.tag_id} value={tag.tag_id}>{tag.tag_name}</option>
            ))}
          </Field>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default NewUser;
