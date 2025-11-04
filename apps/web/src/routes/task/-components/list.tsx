import type { selectTasksSchema } from "@fulleststack/api/schema";

import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Link } from "@tanstack/react-router";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function TaskList({ tasks }: { tasks: selectTasksSchema[] }) {
  return (
    <div className="my-12">
      <ul role="list" className="-mb-8">
        {tasks.map(({ id, name, done, createdAt, dueDate }, taskIdx) => (
          <li key={id}>
            <div className="relative pb-8">
              {taskIdx !== tasks.length - 1
                ? (
                    <span aria-hidden="true" className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" />
                  )
                : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={classNames(
                      done ? "bg-green-700" : "bg-gray-400",
                      "flex size-8 items-center justify-center rounded-full ring-8 ring-white",
                    )}
                  >
                    {done ? <CheckIcon aria-hidden="true" className="size-5 text-white" /> : <XMarkIcon aria-hidden="true" className="size-5 text-white" />}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <Link to="/task/$id" params={{ id: id.toString() }} className="text-sm text-gray-900">
                      {name}
                    </Link>
                    {dueDate && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        Due:
                        {" "}
                        <time dateTime={dueDate.toISOString()}>{dueDate.toLocaleDateString()}</time>
                      </p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={createdAt.toISOString()}>{createdAt.toLocaleString()}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
