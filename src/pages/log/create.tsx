import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import NavBar from "../../components/NavBar";
import { trpc } from "../../utils/trpc";
import { Formik, Form, Field } from "formik";
import { toast } from "react-hot-toast";
import { LoadingPage } from "../../components/loading";

interface inputValues {
  title: string;
  description: string;
}

const CreateLog: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data, isLoading } = trpc.user.getUser.useQuery();
  const createLog = trpc.log.createLog.useMutation();

  // if the user is not logged in, redirect to login page
  if (status === "unauthenticated") {
    router.push("/auth/login");
  }

  if (isLoading) return <LoadingPage />;

  return (
    <div>
      <NavBar user={data} />
      <header className="mt-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold">Create a Log</h1>
      </header>
      <Formik
        initialValues={{ title: "", description: "" }}
        onSubmit={async (values: inputValues, { setSubmitting }) => {
          if (values.title.length < 2 || values.title.length > 30) {
            toast.error("Log title must be between 2-20 characters");
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
              toast.error(message);
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form className="mt-20 flex flex-col items-center">
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
