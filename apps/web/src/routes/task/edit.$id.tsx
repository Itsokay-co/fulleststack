import { patchTasksSchema } from "@fulleststack/api/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";

import { Button, Checkbox, CheckboxField, Description, Field, Input, Label, RoutePending } from "@/web/components";
import { deleteTask, getTaskQueryOptions, queryKeys, updateTask } from "@/web/lib/queries/tasks";
import queryClient from "@/web/lib/query-client";

export const Route = createFileRoute("/task/edit/$id")({
  loader: ({ params }) =>
    queryClient.ensureQueryData(getTaskQueryOptions(params.id)),
  component: RouteComponent,
  pendingComponent: RoutePending,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data } = useSuspenseQuery(getTaskQueryOptions(id));

  const {
    control,
    handleSubmit,
    register,
    formState: { isDirty },
  } = useForm<patchTasksSchema>({
    defaultValues: data,
    resolver: zodResolver(patchTasksSchema),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries(queryKeys.LIST_TASKS);
      navigate({ to: "/" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          ...queryKeys.LIST_TASKS.queryKey,
          ...queryKeys.LIST_TASK(id).queryKey,
        ],
      });
      navigate({ to: "/task/$id", params: { id } });
    },
  });

  const pending = deleteMutation.isPending || updateMutation.isPending;
  // const error = deleteMutation.error?.message || updateMutation.error?.message;

  return (
    <form onSubmit={handleSubmit(data => updateMutation.mutate({ id, task: data }))}>
      <div className="space-y-12">
        <div className="pb-6">
          <h2 className="text-base/7 font-semibold text-gray-900">{data.name}</h2>

          <div className="mt-2">
            <Controller
              control={control}
              name="done"
              render={({ field: { onChange, value, onBlur } }) => (
                <CheckboxField>
                  <Checkbox onChange={onChange} checked={value} onBlur={onBlur} />
                  <Label>Done</Label>
                  <Description>Mark the task as done</Description>
                </CheckboxField>
              )}
            />
          </div>

          <div className="mt-4">
            <Field>
              <Label>Due Date</Label>
              <Input
                type="date"
                {...register("dueDate", {
                  setValueAs: value => value ? new Date(value) : null,
                })}
                defaultValue={data.dueDate?.toISOString().split("T")[0] ?? ""}
              />
              <Description>Optional due date for this task</Description>
            </Field>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-start gap-x-2">
        <Button plain to="/task/$id" params={{ id }}>Cancel</Button>
        <Button onClick={() => deleteMutation.mutate(id)} disabled={pending}>Delete</Button>
        <Button type="submit" disabled={pending || !isDirty}>Save</Button>
      </div>
    </form>
  );
}
