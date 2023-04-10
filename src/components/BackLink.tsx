import React from "react";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

interface Props {
  href: string;
  text: string;
  current: boolean;
}

const BackLink: React.FC<Props> = React.memo(({ href, text, current }) => {
  return (
    <Link href={href}>
      <div className="flex max-w-sm items-center">
        <p className="text-md text-primary underline hover:font-bold">
          {text.length > 5 && !current ? "..." : text}
        </p>
        {current ? null : <IoIosArrowForward />}
      </div>
    </Link>
  );
});

BackLink.displayName = "BackLink";

export default BackLink;
