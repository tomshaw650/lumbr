import type { NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import NavBar from "../../components/NavBar";
import { trpc } from "../../utils/trpc";
import { Formik, Form, Field } from "formik";
import { TRPCClientError } from "@trpc/client";

const CreateLog: NextPage = () => {
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data, isLoading } = trpc.user.getUser.useQuery();
  const createLog = trpc.log.createLog.useMutation();

  // if the user is not logged in, redirect to login page
  if (status === "unauthenticated") {
    router.push("/auth/login");
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <NavBar user={data} />
      <header className="mt-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold">Create a Log</h1>
      </header>
      <Formik
        initialValues={{ title: "", description: "" }}
        onSubmit={async (values: any, { setSubmitting }) => {
          if (values.title.length < 2 || values.title.length > 20) {
            setError("Log title must be between 2-20 characters");
            return;
          }
          // check for trpcerror and set error

          setSubmitting(false);
          await createLog
            .mutateAsync({
              title: values.title,
              description: values.description,
            })
            .then((response) => {
              const newLogId = response.log_id;
              router.push(`/log/${newLogId}`);
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
              <label className="label" htmlFor="title">
                <span className="label-text">Enter the name of the Log</span>
                <span
                  className="label-text-alt tooltip tooltip-primary text-lg"
                  data-tip="Log title must be between 2-20 characters"
                >
                  (?)
                </span>
              </label>
              <Field
                name="title"
                type="text"
                placeholder="Log Title"
                className="input-bordered input mb-4 bg-white"
              />
              <label className="label" htmlFor="description">
                <span className="label-text">Enter a short description</span>
                <span
                  className="label-text-alt tooltip tooltip-primary text-lg"
                  data-tip="Description is optional, with a maximum length of 60 characters"
                >
                  (?)
                </span>
              </label>
              <Field
                name="description"
                type="text"
                placeholder="Log Description"
                className="input-bordered input mb-4 bg-white"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary btn text-white"
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

export default CreateLog;
