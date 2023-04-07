import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { trpc } from "../../utils/trpc";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  console.log(req.body);

  const { data: log, error: logError } = trpc.log.getLogById.useQuery({
    logId: "1",
  });

  if (logError) {
    return new ImageResponse(<>Error: {req.body}</>, {
      width: 1200,
      height: 630,
    });
  }

  return new ImageResponse(<>{req.body}</>, {
    width: 1200,
    height: 630,
  });
}
