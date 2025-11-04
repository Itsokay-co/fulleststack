import type React from "react";

import clsx from "clsx";

import type { LinkProps } from "./button";

import { Button } from "./button";

type PaginationPrevNextProps = Omit<LinkProps, "color"> & { className?: string; children?: string | number };
type PaginationPageProps = Omit<LinkProps, "color"> & { className?: string; children?: string | number; current?: boolean };

export function Pagination({
  "aria-label": ariaLabel = "Page navigation",
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return <nav aria-label={ariaLabel} {...props} className={clsx(className, "flex gap-x-2")} />;
}

export function PaginationPrevious({
  className,
  to = ".",
  children = "Previous",
  ...props
}: PaginationPrevNextProps) {
  return (
    <span className={clsx(className, "grow basis-0")}>
      <Button plain to={to} {...props} aria-label="Previous page">
        <svg className="stroke-current" data-slot="icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M2.75 8H13.25M2.75 8L5.25 5.5M2.75 8L5.25 10.5"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {children}
      </Button>
    </span>
  );
}

export function PaginationNext({
  className,
  children = "Next",
  to = ".",
  ...props
}: PaginationPrevNextProps) {
  return (
    <span className={clsx(className, "flex grow basis-0 justify-end")}>
      <Button plain to={to} {...props} aria-label="Next page">
        {children}
        <svg className="stroke-current" data-slot="icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M13.25 8L2.75 8M13.25 8L10.75 10.5M13.25 8L10.75 5.5"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </span>
  );
}

export function PaginationList({ className, ...props }: React.ComponentProps<"span">) {
  return <span {...props} className={clsx(className, "hidden items-baseline gap-x-2 sm:flex")} />;
}

export function PaginationPage({
  className,
  current = false,
  children,
  to = ".",
  ...props
}: PaginationPageProps) {
  return (
    <Button
      to={to}
      {...props}
      plain
      aria-label={`Page ${children}`}
      aria-current={current ? "page" : undefined}
      className={clsx(
        className,
        "min-w-9 before:absolute before:-inset-px before:rounded-lg",
        current && "before:bg-zinc-950/10 dark:before:bg-white/10",
      )}
    >
      <span className="-mx-0.5">{children}</span>
    </Button>
  );
}

const DefaultGap = <>&hellip;</>;

export function PaginationGap({
  className,
  children = DefaultGap,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      {...props}
      className={clsx(
        className,
        "w-9 text-center text-sm/6 font-semibold text-zinc-950 select-none dark:text-white",
      )}
    >
      {children}
    </span>
  );
}
