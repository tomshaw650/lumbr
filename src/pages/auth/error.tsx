import { NextPage, GetServerSideProps } from "next";
import { useRouter } from "next/router";

interface ErrorProps {
  error: string;
}

const ErrorPage: NextPage<ErrorProps> = ({ error }) => {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col place-items-center justify-center gap-y-5">
      <h1 className="text-4xl">Error logging in:</h1>
      <p className="text-2xl">{error}</p>
      <button className="btn-primary btn" onClick={() => router.push("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default ErrorPage;

export const getServerSideProps: GetServerSideProps<ErrorProps> = async (
  context
) => {
  const { error } = context.query;
  if (typeof error !== "string") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      error,
    },
  };
};
