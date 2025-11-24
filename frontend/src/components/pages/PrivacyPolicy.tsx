import Container from "@/components/Container";
import { getDictionaryFromSubdomain } from "@/features/language/helpers/helpersServer";
import { interpolateReact } from "@/features/language/lib/i18n";
import { routeStrings } from "@/utils/routeStrings";
import Link from "next/link";
import OpenCookieConsentPopupButton from "../OpenCookieConsentPopupButton";

const PrivacyPolicy = async () => {
  const dictionary = await getDictionaryFromSubdomain();
  return (
    <Container className="py-10">
      {" "}
      <h1 className="text-3xl font-bold mb-6">{dictionary.privacyPolicy}</h1>
      <p className="mb-4">
        {interpolateReact(dictionary.privacyPolicyPage.welcome, {
          title: <strong>WordBattles</strong>,
        })}
      </p>
      <h2 className="text-2xl font-semibold mb-3">
        {dictionary.privacyPolicyPage.infoWeCollect}
      </h2>
      <p className="mb-4">{dictionary.privacyPolicyPage.breakdown.title}</p>
      <h3 className="text-xl font-semibold mb-2">
        {dictionary.privacyPolicyPage.breakdown.essentials.title}
      </h3>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>
            {dictionary.privacyPolicyPage.breakdown.essentials.auth.title}
          </strong>{" "}
          {dictionary.privacyPolicyPage.breakdown.essentials.auth.explanation}
        </li>
        <li>
          <strong>
            {dictionary.privacyPolicyPage.breakdown.essentials.preference.title}
          </strong>{" "}
          {
            dictionary.privacyPolicyPage.breakdown.essentials.preference
              .explanation
          }
        </li>
        <li>
          <strong>
            {dictionary.privacyPolicyPage.breakdown.essentials.game.title}
          </strong>{" "}
          {dictionary.privacyPolicyPage.breakdown.essentials.game.explanation}
        </li>
      </ul>
      <h3 className="text-xl font-semibold mb-2">
        {dictionary.privacyPolicyPage.breakdown.analytics.title}
      </h3>
      <p className="mb-4">
        {dictionary.privacyPolicyPage.breakdown.analytics.explanation}
      </p>
      <h2 className="text-2xl font-semibold mb-3">
        {dictionary.privacyPolicyPage.howWeUseInfo.title}
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>{dictionary.privacyPolicyPage.howWeUseInfo.l1}</li>
        <li>{dictionary.privacyPolicyPage.howWeUseInfo.l2}</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-3">
        {dictionary.privacyPolicyPage.choice.title}
      </h2>
      <p className="mb-4">
        {dictionary.privacyPolicyPage.choice.l1}
        {dictionary.privacyPolicyPage.choice.l2.toChange}{" "}
        <OpenCookieConsentPopupButton />
      </p>
      <h2 className="text-2xl font-semibold mb-3">
        {" "}
        {dictionary.privacyPolicyPage.contact.title}
      </h2>
      <p>
        {interpolateReact(dictionary.privacyPolicyPage.contact.if, {
          link: (
            <Link href={routeStrings.contact} className="hover:underline">
              {" "}
              {dictionary.header.contact}
            </Link>
          ),
        })}
      </p>
    </Container>
  );
};

export default PrivacyPolicy;
