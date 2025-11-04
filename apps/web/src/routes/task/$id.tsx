import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button, RoutePending } from "@/web/components";
import dateFormatter from "@/web/lib/date-formatter";
import { getTaskQueryOptions } from "@/web/lib/queries/tasks";
import queryClient from "@/web/lib/query-client";

export const Route = createFileRoute("/task/$id")({
  loader: ({ params }) =>
    queryClient.ensureQueryData(getTaskQueryOptions(params.id)),
  component: RouteComponent,
  pendingComponent: RoutePending,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(getTaskQueryOptions(id));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex">
        <div className="mr-4 shrink-0 self-center">
          {data.done ? <CheckIcon aria-hidden="true" className="size-16 text-green-700" /> : <XMarkIcon aria-hidden="true" className="size-16 text-red-500" />}
        </div>
        <div>
          <h4 className="text-lg font-bold">{data.name}</h4>
          {data.dueDate && (
            <p className="mt-1 font-semibold text-gray-700">
              Due:
              {" "}
              {dateFormatter.format(data.dueDate)}
            </p>
          )}
          <p className="mt-1">
            Updated:
            {" "}
            {dateFormatter.format(data.updatedAt)}
          </p>
          <p className="mt-1">
            Created:
            {" "}
            {dateFormatter.format(data.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex">
        <Button
          role="button"
          to="/task/edit/$id"
          params={{ id }}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
