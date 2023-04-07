import { ImageResponse } from "@vercel/og";
import { NextApiHandler } from "next";
import type { NextApiRequest } from "next";

export const config = {
  runtime: "experimental-edge",
};

const handler: NextApiHandler = async (req: NextApiRequest) => {
  const { searchParams } = new URL(req.url!);

  const hasTitle = searchParams.has("title");
  const title = hasTitle ? searchParams.get("title") : undefined;

  const hasUsername = searchParams.has("username");
  const username = hasUsername ? searchParams.get("username") : undefined;

  const hasDesc = searchParams.has("desc");
  const desc = hasDesc ? searchParams.get("desc") : undefined;

  const hasPfp = searchParams.has("pfp");
  const pfp = hasPfp ? searchParams.get("pfp") : undefined;

  const content =
    hasTitle && hasDesc && hasPfp && hasUsername ? (
      <div tw="flex flex-col items-center justify-center bg-[#E3E2DC] h-screen w-full">
        <h1 tw="text-4xl font-bold">
          {title} by {username}
        </h1>
        <img src={pfp!} tw="w-20 h-20 rounded-full mt-8 mb-4" />
        <p tw="text-2xl font-bold">{title}</p>
        <p tw="text-xl font-bold">{desc}</p>
        <div tw="flex items-center justify-center">
          <p tw="text-md font-bold mt-10">Posted on Lumbr</p>
          <img
            src="https://i.imgur.com/IdSRF5O.png"
            tw="w-10 h-10 ml-2 mt-5"
            alt="Lumbr Logo"
          />
        </div>
      </div>
    ) : (
      <div tw="flex items-center justify-center h-screen w-full">
        <h1 tw="text-4xl font-bold">Log doesn&apos;t exist!</h1>
      </div>
    );

  try {
    return new ImageResponse(<>{content}</>, {
      width: 1200,
      height: 630,
    });
  } catch {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
};

export default handler;
