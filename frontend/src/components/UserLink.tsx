import { routeStrings } from "@/utils/routeStrings";
import Link from "next/link";
import { Lang } from "@/features/language/utils/types";

const UserLink = ({
  id,
  children,
  locale,
  className,
  target = "_self",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  locale: Lang;
  target?: string;
}) => {
  return (
    <Link
      href={routeStrings.userPage(id) + `?lang=${locale}`}
      className={className || ""}
      target={target}
    >
      {children}
    </Link>
  );
};

export default UserLink;
