// import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
"use client";
import {
  Calendar,
  ChevronUp,
  Gift,
  Home,
  LogIn,
  LogOut,
  Settings,
  ShoppingCart,
  Ticket,
  User2,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

import { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";

type SidebarItem = {
  title: string;
  url?: string;
  icon: LucideIcon;
  children?: {
    title: string;
    url: string;
  }[];
};

// Menu items.
// const items = [
//   {
//     title: "Dashboard",
//     url: "/",
//     icon: Home,
//   },
//   {
//     title: "Orders",
//     url: "/orders",
//     icon: ShoppingCart,
//   },
//   {
//     title: "All events",
//     url: "/all-events",
//     icon: Calendar,
//   },
//   {
//     title: "Tickets",
//     url: "/tickets",
//     icon: Ticket,
//   },
//   {
//     title: "Vouchers",
//     url: "/vouchers",
//     icon: Gift,
//   },
//   {
//     title: "Settings",
//     url: "/settings",
//     icon: Settings,
//   },
// ];

const items: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/dashboard",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    children: [
      { title: "Order", url: "/dashboard/orders" },
      { title: "Manual Payment", url: "/dashboard/orders/manual" },
      { title: "Transactions", url: "/dashboard/orders/transactions" },
    ],
  },
  {
    title: "Events",
    icon: Calendar,
    children: [
      { title: "All Event", url: "/dashboard/all-events" },
      { title: "Create Event", url: "/dashboard/all-events/create" },
    ],
  },
  {
    title: "Tickets",
    icon: Ticket,
    children: [
      { title: "Ticket", url: "/dashboard/tickets" },
      { title: "Create Ticket", url: "/dashboard/tickets/create" },
    ],
  },
  {
    title: "Vouchers",
    icon: Gift,
    children: [
      { title: "Voucher", url: "/dashboard/vouchers" },
      { title: "Create Voucher", url: "/dashboard/vouchers/create" },
    ],
  },
  {
    title: "Settings",
    // url: "/settings",
    icon: Settings,
    children: [
      { title: "Setting", url: "/dashboard/settings" },
      // { title: "Bank Detail", url: "/dashboard/settings/bank-detail" },
      { title: "Change Password", url: "/dashboard/settings/change-password" },
    ],
  },
];

export function AppSidebar() {
  const session = useSession();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <img
            src="/logoevent.png"
            alt="logo"
            className="w-[140px] h-[30px] md:h-[30px] md:w-[160px] mb-8 mt-5"
          />

          <SidebarGroupLabel className="text-xl mb-5">
            Platform
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.children ? (
                    <Collapsible className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex items-center">
                          <item.icon />
                          <span className="text-lg">{item.title}</span>

                          {/* ARROW */}
                          <ChevronDown
                            className="
            ml-auto h-4 w-4
            transition-transform duration-200
            group-data-[state=open]/collapsible:rotate-180
          "
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((sub) => (
                            <SidebarMenuSubItem key={sub.title}>
                              <Link href={sub.url}>{sub.title}</Link>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    // === ITEM TANPA SUB MENU (DASHBOARD) ===
                    <SidebarMenuButton asChild>
                      <Link href={item.url!}>
                        <item.icon />
                        <span className="text-lg">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* <SidebarMenuButton>
              <User2 />
              username
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton> */}

            <SidebarMenuButton>
              <User2 />

              <div className="flex flex-col text-left leading-tight">
                <span className="text-sm font-medium">
                  {session.data?.user?.name ?? "Guest"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {session.data?.user?.email ?? "Not signed in"}
                </span>
              </div>

              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            className="w-[--radix-popper-anchor-width]"
          >
            {session.status === "unauthenticated" ? (
              <DropdownMenuItem asChild>
                <Link href="/login" className="flex items-center gap-2">
                  <LogIn size={16} />
                  Sign In
                </Link>
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => signOut()}
                >
                  <LogOut size={16} />
                  Sign Out
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
