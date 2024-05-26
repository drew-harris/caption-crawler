import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div>
      <h1>Todos</h1>
      <div className="mb-4 text-sm">
        All HTML is server rendered btw (no loading necessary) WHATR
      </div>
    </div>
  );
}
