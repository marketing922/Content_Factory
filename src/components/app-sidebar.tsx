"use client"

import * as React from "react"
import {
  BookOpen,
  LayoutDashboard,
  PenTool,
  Settings,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const data = {
    user: {
      name: "Admin",
      email: "admin@calebasse.com",
      avatar: "",
    },
    navMain: [
      {
        title: "Tableau de bord",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Créer un article",
        url: "/create",
        icon: PenTool,
      },
      {
        title: "Bibliothèque",
        url: "/library",
        icon: BookOpen,
      },
      {
        title: "Paramètres",
        url: "/settings",
        icon: Settings,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
              <Image src="/images/logo512.png" alt="Calebasse Logo" width={32} height={32} className="object-contain" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold font-heading">Calebasse</span>
              <span className="truncate text-xs">Content Factory</span>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
         {/* User info and theme toggle */}
         <SidebarMenu>
            <SidebarMenuItem>
                <div className="flex items-center justify-between gap-2 px-2">
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground stroke-current">
                          <User className="size-4" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">{data.user.name}</span>
                          <span className="truncate text-xs">{data.user.email}</span>
                      </div>
                  </SidebarMenuButton>
                  <ThemeToggle />
                </div>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
