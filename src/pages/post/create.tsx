import type { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { Formik, Form, Field } from "formik";
import Head from "next/head";
import NavBar from "../../components/NavBar";
import MarkdownEditor from "../../components/MarkdownEditor";

interface inputValues {
  title: string;
  content: string;
  log_id: string;
}

const CreatePost: NextPage = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: userData, isLoading: userLoading } =
    trpc.user.getUser.useQuery();
  const { data: logsData, isLoading: logsLoading } =
    trpc.user.getAllLogs.useQuery();

  const createPost = trpc.post.createPost.useMutation();

  // if the user is not logged in, redirect to login page
  if (status === "unauthenticated") {
    router.push("/auth/login");
  }

  if (userLoading || logsLoading) return <div>Loading...</div>;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <Head>
        <title>Lumbr | Create a Post</title>
      </Head>
      <NavBar user={userData} />
      <header className="mt-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold">Create a Post</h1>
      </header>
      <Formik
        initialValues={{ title: "", content: "", log_id: "" }}
        onSubmit={async (values: inputValues, { setSubmitting }) => {
          if (values.title.length < 2 || values.title.length > 30) {
            setError("Post title must be between 2-30 characters");
            return;
          }
          if (!values.log_id) {
            setError("Please select a log");
            return;
          }

          console.log(values.content);

          setSubmitting(false);
          await createPost
            .mutateAsync({
              title: values.title,
              content: values.content,
              log_id: values.log_id,
            })
            .then((response) => {
              const newPostId = response.post_id;
              router.push(`/post/${newPostId}`);
            })
            .catch((err) => {
              const message = err.message;
              setError(message);
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form className="mt-20 flex flex-col items-center">
            {error && (
              <div className="alert alert-error absolute z-10 max-w-md shadow-lg">
                <p>
                  <span className="font-bold">Error:</span> {error}
                </p>
                <button
                  type="button"
                  className="btn-ghost btn-sm btn-circle btn text-lg font-extrabold"
                  onClick={() => setError(null)}
                >
                  X
                </button>
              </div>
            )}
            <div className="form-control">
              <label className="label" htmlFor="log">
                <span className="label-text">Select a Log:</span>
              </label>
              <Field
                name="log_id"
                as="select"
                className="input-bordered input mb-4 bg-white"
              >
                <option value="">Select a Log</option>
                {logsData?.map((log) => (
                  <option key={log.log_id} value={log.log_id}>
                    {log.title}
                  </option>
                ))}
              </Field>
              <label className="label" htmlFor="title">
                <span className="label-text">Enter the name of the Post</span>
                <span
                  className="label-text-alt tooltip tooltip-left tooltip-primary text-lg"
                  data-tip="Post title must be between 2-20 characters"
                >
                  (?)
                </span>
              </label>
              <Field
                name="title"
                type="text"
                placeholder="Post Title"
                className="input-bordered input mb-4 bg-white"
              />
              <label className="label" htmlFor="content">
                <span className="label-text">Start writing!</span>
                <span
                  className="label-text-alt tooltip tooltip-left tooltip-primary text-lg"
                  data-tip="Write like a blog post. Markdown is supported."
                >
                  (?)
                </span>
              </label>
              <div className="md-editor-wrapper">
                <Field
                  as={MarkdownEditor}
                  name="content"
                  type="text"
                  fieldOnChange={handleChange}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary btn my-10 text-white"
              >
                Create
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreatePost;
