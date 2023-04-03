import React, { useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field } from "formik";
import { trpc } from "../utils/trpc";

interface Props {
  logId: string;
}

const AddTagsModal: React.FC<Props> = ({ logId }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const tags = trpc.auth.getAllTags.useQuery();
  const addTags = trpc.log.addTagsToLog.useMutation();
  const removeTags = trpc.log.removeTagFromLog.useMutation();
  const currentTags = trpc.log.getLogTags.useQuery({ logId: logId });

  return (
    <div>
      <Formik
        initialValues={{
          log_tags: currentTags.data?.map((tag) => tag.tag_id) || [],
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(false);

          if (values.log_tags.length > 5) {
            setError("You can only select up to 5 tags.");
            return;
          }

          // Create an array of tag IDs that were selected in the form
          const selectedTagIds = values.log_tags;

          // Create an array of tag IDs that are currently associated with the log
          const currentTagIds = currentTags.data?.map(
            (logTag) => logTag.tag.tag_id
          );

          // Create an array of tag IDs that need to be removed from the log
          const tagsToRemove = currentTagIds?.filter(
            (tagId) => !selectedTagIds.includes(tagId)
          );

          if (tagsToRemove) {
            await Promise.all(
              tagsToRemove.map(async (tagId) => {
                await removeTags.mutateAsync({ logId, tagId });
              })
            );
          }

          // Create an array of tag objects that need to be added to the log
          const tagsToAdd = selectedTagIds
            .filter((tagId) => !currentTagIds?.includes(tagId))
            .map((tagId) => ({ tag_id: tagId }));

          // Add the tags that need to be added to the log
          if (tagsToAdd.length > 0) {
            await addTags
              .mutateAsync({
                logId,
                log_tags: tagsToAdd,
              })
              .then(() => {
                router.reload();
              })
              .catch((err) => {
                const message = err.message;
                const error = JSON.parse(message);
                setError(error[0]?.message);
              });
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col">
            {error !== "" && (
              <div className="alert alert-error absolute z-10 max-w-md shadow-lg">
                <p>
                  <span className="font-bold">Error:</span> {error}
                </p>
                <button
                  type="button"
                  className="btn-ghost btn-sm btn-circle btn text-lg font-extrabold"
                  onClick={() => setError("")}
                >
                  <span className="sr-only">Close alert</span>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
            <label className="label" htmlFor="log_tags">
              <span className="label-text">Please select up to 5 tags.</span>
            </label>
            <Field
              name="log_tags"
              as="select"
              multiple
              className="select-bordered select mb-4 bg-white py-12 pt-2 text-center text-lg"
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
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddTagsModal;
