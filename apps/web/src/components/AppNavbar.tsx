import {
  ArrowRightStartOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { useLocation } from "@tanstack/react-router";

import { Avatar, Button, Dropdown, DropdownButton, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu, Link, Navbar, NavbarItem, NavbarSection, NavbarSpacer } from "@/web/components";
import { useAuth } from "@/web/hooks/useAuth";
import { signOut } from "@/web/lib/auth-client";

import type { FileRouteTypes } from "../route-tree.gen";

import { Logo } from "./Logo";

type NavRoute = {
  path: FileRouteTypes["to"];
  label: string;
};

export function AppNavbar() {
  const { pathname } = useLocation();
  const { isLoggedIn, isAdmin, user } = useAuth();

  const authenticatedRoutes: NavRoute[] = [];
  const adminRoutes: NavRoute[] = [
    {
      path: "/admin-dashboard",
      label: "Admin Dashboard",
    },
  ];

  return (
    <Navbar className="px-4">
      <Link to="/" aria-label="Home">
        <Logo text="@fulleststack" className="size-10 sm:size-8" />
      </Link>
      <NavbarSection>

        {isLoggedIn && authenticatedRoutes.map(route => (
          <NavbarItem key={route.path} to={route.path} current={pathname === route.path}>
            {route.label}
          </NavbarItem>
        ))}

        {isAdmin && adminRoutes.map(route => (
          <NavbarItem key={route.path} to={route.path} current={pathname === route.path}>
            {route.label}
          </NavbarItem>
        ))}

      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        {isLoggedIn && (
          <Dropdown>
            <DropdownButton as={NavbarItem} aria-label="Account menu">
              <Avatar className="bg-gray-200" src={user?.image} initials={!user?.image ? user?.name?.charAt(0) : undefined} square />
            </DropdownButton>
            <DropdownMenu className="min-w-64" anchor="bottom end">
              <DropdownItem to="/profile">
                <UserIcon />
                <DropdownLabel>My profile</DropdownLabel>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem onClick={() => signOut()}>
                <ArrowRightStartOnRectangleIcon />
                <DropdownLabel>Sign out</DropdownLabel>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
        {!isLoggedIn && (
          <NavbarItem to="/signin">
            <Button>Sign in</Button>
          </NavbarItem>
        )}
      </NavbarSection>
    </Navbar>
  );
}
