import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import NavBar from "../components/NavBar";
import { Formik, Form, Field } from "formik";

import { LoadingPage } from "../components/loading";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface modalProps {
  userId: string;
  logId: string;
}

const SuspendUserModal = ({ userId, logId }: modalProps) => {
  const router = useRouter();

  const suspend = trpc.admin.suspend.useMutation({
    onSuccess: () => {
      toast.success("User suspended");
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

  return (
    <Formik
      initialValues={{
        userId: userId,
        logId: logId,
        suspendDate: "",
        suspendReason: "",
      }}
      onSubmit={async (values) => {
        await suspend.mutateAsync(values).then(() => {
          console.log(values);
        });
      }}
    >
      <Form className="flex flex-col">
        <label className="label" htmlFor="suspendDate">
          <span className="label-text">
            How long should this user be suspended for?
          </span>
          <span
            className="tooltip tooltip-left tooltip-primary"
            data-tip="The date you select will be the date the user is unsuspended."
          >
            (?)
          </span>
        </label>
        <Field
          className="input-bordered input w-min"
          name="suspendDate"
          type="date"
        />
        <label className="label" htmlFor="suspendReason">
          <span className="label-text">
            How long should this user be suspended for?
          </span>
          <span
            className="tooltip tooltip-left tooltip-primary"
            data-tip="Give a reason for suspension. Maximum 60 characters."
          >
            (optional)
          </span>
        </label>
        <Field
          className="input-bordered input bg-white"
          name="suspendReason"
          type="text"
          placeholder="Reason..."
        />
        <button
          className="btn-error btn my-5 w-fit text-white hover:bg-red-800"
          type="submit"
        >
          Suspend User
        </button>
        <span className="font-bold text-error">
          Please note: suspending a user also deletes the offending log, and all
          reports associated with the user.
        </span>
      </Form>
    </Formik>
  );
};

const Admin = () => {
  const router = useRouter();
  const ctx = trpc.useContext();
  const { data: user, isLoading: userIsLoading } = trpc.user.getUser.useQuery();
  const {
    data: reports,
    isLoading: reportsIsLoading,
    isError,
  } = trpc.admin.getAllReports.useQuery();

  const ignore = trpc.admin.ignoreReport.useMutation({
    onSuccess: () => {
      toast.success("Report ignored");
      void ctx.admin.getAllReports.invalidate();
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

  const handleIgnore = async (reportId: string) => {
    await ignore.mutateAsync({ reportId: reportId });
  };

  if (userIsLoading || reportsIsLoading) {
    return <LoadingPage />;
  }

  if (!user || user.role !== "ADMIN") {
    router.push("/");
  }

  if (!reports || isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <Head>
        <title>Lumbr | Admin</title>
      </Head>
      <NavBar user={user} />
      <div className="flex flex-col place-items-center">
        <h1 className="mt-10 text-3xl font-bold">Admin Dashboard</h1>
        <div className="pt-10">
          <h2 className="text-2xl">View Reports</h2>
          <div className="my-2 w-[32rem] border border-base-300 bg-white">
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <section
                  tabIndex={index}
                  className="border-b-2 border-black p-3 last:border-none"
                  key={report.report_id}
                >
                  <h2 className="text-2xl underline">{report.log?.title}</h2>
                  <div className="dark:text-black">
                    <ul className="text-lg">
                      <li className="font-bold">
                        Reporter:{" "}
                        <span className="font-normal">
                          {report.reporter.username}
                        </span>
                      </li>
                      <li className="font-bold">
                        Reported:{" "}
                        <span className="font-normal">
                          {report.user.username}
                        </span>
                      </li>
                      <li className="font-bold">
                        When:{" "}
                        <span className="font-normal">{`${dayjs(
                          report.created_at
                        ).fromNow()}`}</span>
                      </li>
                      <li className="font-bold">
                        Reason:{" "}
                        <span className="font-normal">{report.reason}</span>
                      </li>
                    </ul>
                    <div className="mt-3 flex gap-x-5">
                      <button
                        onClick={() => handleIgnore(report.report_id)}
                        className="btn-primary btn text-white"
                      >
                        Ignore
                      </button>
                      <label
                        htmlFor="suspend"
                        className="btn-error btn text-white"
                      >
                        Suspend User
                      </label>
                      <input
                        type="checkbox"
                        id="suspend"
                        className="modal-toggle"
                      />
                      <div className="modal">
                        <div className="modal-box">
                          <h3 className="text-lg font-bold">
                            Suspend {report.user.username}?
                          </h3>
                          <SuspendUserModal
                            userId={report.user_id}
                            logId={report.log_id}
                          />
                          <div className="modal-action">
                            <label htmlFor="suspend" className="btn-circle btn">
                              X
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              ))
            ) : (
              <div className="py-5 text-center">No reports. Hurray!</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
