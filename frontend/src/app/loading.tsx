import Container from "@/components/Container";
import Spinner from "@/components/Spinner";
import { getDictionaryFromSubdomain } from "@/features/language/helpers/helpersServer";

export default async function Loading() {
  const dictionary = await getDictionaryFromSubdomain();
  return (
    <Container className="mt-20 flex flex-col items-center justify-start text-center p-6">
      <div className="flex flex-col items-center gap-4">
        <Spinner dictionary={dictionary} />
        <p className="text-base font-medium text-gray-700 animate-pulse">
          {dictionary.loading}
        </p>
      </div>
    </Container>
  );
}
