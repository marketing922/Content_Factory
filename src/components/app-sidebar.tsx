"use client"

import * as React from "react"
import {
  BookOpen,
  LayoutDashboard,
  PenTool,
  Settings,
  User,
  LogOut,
  HelpCircle,
} from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { useTranslation } from "@/hooks/use-translation"

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
  const { profile, fetchProfile, signOut } = useProfile()
  const { t } = useTranslation()

  React.useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const user = {
    name: profile?.full_name || t.nav.admin,
    email: profile?.email || "",
    avatar: profile?.avatar_url || "",
  }

  const data = {
    navMain: [
      {
        title: t.nav.dashboard,
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: t.nav.factory,
        url: "/create",
        icon: PenTool,
      },
      {
        title: t.nav.library,
        url: "/library",
        icon: BookOpen,
      },
      {
        title: t.nav.settings,
        url: "/settings",
        icon: Settings,
      },
      {
        title: t.nav.faq,
        url: "/faq",
        icon: HelpCircle,
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
          <SidebarGroupLabel>{t.nav.menuLabel}</SidebarGroupLabel>
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
                          <span className="truncate font-semibold">{user.name}</span>
                          <span className="truncate text-xs">{user.email}</span>
                      </div>
                  </SidebarMenuButton>
                  <ThemeToggle />
                </div>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={signOut}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t.nav.logout}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
