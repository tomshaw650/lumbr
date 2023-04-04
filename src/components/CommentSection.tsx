import { Formik, Form, Field } from "formik";
import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import Comments from "./Comments";
import { LoadingSpinner } from "./loading";

const CommentSection: React.FC = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const id = router.query.id as string | undefined;

  const user = trpc.user.getUser.useQuery();
  const create = trpc.comment.create.useMutation();

  const isLogSection = router.pathname.startsWith("/log/");

  // get the comments from the query, if it's a log section, get the log comments, otherwise get the post comments
  const { data: comments = [], isLoading: commentsLoading } =
    trpc.comment.getAll.useQuery({
      logId: isLogSection ? id : undefined,
      postId: !isLogSection ? id : undefined,
    });

  if (commentsLoading) return <LoadingSpinner />;

  return (
    <div className="mt-8">
      <div className="mb-8 flex flex-col items-center">
        <h3 className="mb-2 text-lg font-medium">Add a comment:</h3>
        <Formik
          initialValues={{ body: "" }}
          onSubmit={async (values, { setSubmitting, resetForm, setErrors }) => {
            setSubmitting(false);
            await create
              .mutateAsync({
                body: values.body,
                userId: user.data?.id as string,
                logId: isLogSection ? id : undefined,
                postId: !isLogSection ? id : undefined,
              })
              .then(() => {
                resetForm();
                router.reload();
              });
          }}
        >
          {({ isSubmitting, errors }) => (
            <Form className="form-control flex flex-col items-center">
              <Field
                className="textarea-bordered textarea textarea-lg mb-2 resize-none bg-white"
                name="body"
                as="textarea"
                placeholder="Write your comment here..."
              />
              <button
                className="btn-primary btn py-2 px-4 text-white"
                type="submit"
                disabled={isSubmitting}
              >
                Comment
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <Comments comments={comments} />
    </div>
  );
};

export default CommentSection;
