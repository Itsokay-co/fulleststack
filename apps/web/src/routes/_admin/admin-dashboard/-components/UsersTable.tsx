import type { UserWithRole } from "better-auth/plugins/admin";

import { useMemo } from "react";

import { Avatar, Badge, Pagination, PaginationGap, PaginationList, PaginationNext, PaginationPage, PaginationPrevious, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/web/components";
import { generatePaginationItems } from "@/web/lib/pagination";

export function UsersTable(
  { users, page, totalPages, usersPerPage }:
  { users: UserWithRole[]; page: number; totalPages: number; usersPerPage: number },
) {
  const paginationItems = useMemo(() => generatePaginationItems({ currentPage: page, totalPages }), [page, totalPages]);
  return (
    <>
      <Table className="[--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]" style={{ minHeight: `${41 + usersPerPage * 81}px` }}>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Role</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Avatar src={user.image} initials={!user.image ? user.name?.charAt(0) : undefined} className="size-12" />
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-zinc-500">
                      <a href="#" className="hover:text-zinc-700">
                        {user.email}
                      </a>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-500">{user.role}</TableCell>
              <TableCell>
                {Math.random() > 0.5 ? <Badge color="lime">Online</Badge> : <Badge color="zinc">Offline</Badge>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-6">
        <PaginationPrevious search={{ page: Math.max(1, page - 1) }} disabled={page <= 1} preload="intent" />

        <PaginationList>
          {paginationItems.map((item, index) => {
            if (item.type === "gap") {
              return <PaginationGap key={`gap-${index}`} />;
            }
            return (
              <PaginationPage
                preload="intent"
                key={`page-${item.pageNumber}`}
                search={{ page: item.pageNumber }}
                current={item.pageNumber === page}
              >
                {item.pageNumber}
              </PaginationPage>
            );
          })}
        </PaginationList>
        <PaginationNext search={{ page: Math.min(totalPages, page + 1) }} disabled={page >= totalPages} preload="intent" />
      </Pagination>
    </>
  );
}
