import Link from "next/link";
import { routeStrings } from "@/utils/routeStrings";
import Container from "./Container";
import { getDictionaryFromSubdomain } from "@/features/language/utils/helpersServer";

export const Footer = async () => {
  const currentYear = new Date().getFullYear();
  const dictionary = await getDictionaryFromSubdomain();

  return (
    <footer className="bg-primary text-white">
      <Container
        isMain={false}
        className="py-4 flex justify-between items-center text-sm"
      >
        <span>&copy; {currentYear} WordBattles</span>
        <Link href={routeStrings.privacyPolicy} className="hover:underline">
          {dictionary.privacyPolicy}
        </Link>
      </Container>
    </footer>
  );
};
