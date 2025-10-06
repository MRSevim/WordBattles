import Container from "@/components/Container";
import Spinner from "@/components/Spinner";

export default function Loading() {
  return (
    <Container className="mt-20 flex flex-col items-center justify-center text-center p-6">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-12 h-12" />
        <p className="text-base font-medium text-gray-700 animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </Container>
  );
}
