import { GetStaticProps } from "next";
import { prisma } from "../../server/db/client";
import { trpc } from "../../utils/trpc";
import type { Log } from "@prisma/client";
import NavBar from "../../components/NavBar";

const Log = (props: { log: Log }) => {
  const { data } = trpc.user.getUserPublic.useQuery();

  if (!props.log) return <div>Log not found</div>;
  return (
    <div>
      <NavBar user={data} />
      <h1>{props.log.title}</h1>
      <p>{props.log.description}</p>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.id || typeof params.id !== "string") {
    return {
      notFound: true,
      revalidate: 60,
    };
  }
  const id = params.id;

  const logInfo = await prisma.log.findFirst({
    where: {
      log_id: {
        equals: id,
      },
    },
  });

  if (!logInfo) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  const logWithSerializedDate = {
    ...logInfo,
    created_at: logInfo?.created_at.toISOString(),
    updated_at: logInfo?.updated_at.toISOString(),
  };

  return { props: { log: logWithSerializedDate }, revalidate: 60 };
};

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export default Log;
