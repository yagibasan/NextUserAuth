import { Home, Users, UserCog, LogOut, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  user?: {
    username: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}

export function AppSidebar({ user, onLogout }: AppSidebarProps) {
  const [location] = useLocation();

  const userMenuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: UserCog,
    },
  ];

  const adminMenuItems = [
    {
      title: "User Management",
      url: "/admin/users",
      icon: Users,
    },
  ];

  const menuItems = user?.role === 'admin' 
    ? [...userMenuItems, ...adminMenuItems] 
    : userMenuItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">SecureAuth</h2>
            <p className="text-xs text-muted-foreground">Authentication Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {user && (
          <SidebarGroup>
            <SidebarGroupLabel>Profile</SidebarGroupLabel>
            <div className="px-4 py-3 mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}
                    className={location === item.url ? "bg-sidebar-accent" : ""}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={onLogout}
          data-testid="button-logout"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
