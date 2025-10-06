import Container from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="mt-20 flex flex-col items-center justify-center text-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 flex items-center justify-center rounded-full bg-primary">
            <i className="bi bi-search text-2xl text-primary-foreground"></i>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">
            Page not found
          </h1>
          <p className="text-gray-600 text-sm">
            The page you are looking for doesn’t exist or may have been moved.
          </p>

          <a
            href="/"
            className="mt-6 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow hover:opacity-90 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    </Container>
  );
}
