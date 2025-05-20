function ErrorComponent(errorMessage?: string) {
  return (
    <div className="flex flex-col gap-3 items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl">404</h1>
      <p className="text-gray-700 text-lg font-semibold">
        {errorMessage ||
          "Oops! Something went wrong while loading the reviews."}
      </p>
      <button
        className="mt-4 px-6 py-2 bg-primary-1 text-white rounded-md shadow-md hover:bg-primary-dark transition"
        onClick={() => window.location.reload()}
      >
        Reload Page
      </button>
    </div>
  );
}

export default ErrorComponent;
