import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import { toast } from "react-hot-toast";

const DeleteLogModal = (logId: any) => {
  const router = useRouter();
  const dlt = trpc.log.delete.useMutation({
    onSuccess: () => {
      toast.success("Log deleted.");
      router.push("/home");
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

  const deleteItem = async () => {
    dlt.mutate(logId);
  };

  return (
    <div>
      <h2>Are you sure you want to delete this?</h2>
      <button onClick={deleteItem} className="btn-error btn text-white">
        Confirm
      </button>
    </div>
  );
};

export default DeleteLogModal;
