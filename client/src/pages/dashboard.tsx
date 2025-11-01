import { Shield, Users, UserCheck, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardProps {
  user?: {
    username: string;
    email: string;
    role: string;
    emailVerified?: boolean;
    createdAt: string;
  };
  stats?: {
    totalUsers?: number;
    activeUsers?: number;
    adminUsers?: number;
  };
}

export default function Dashboard({ user, stats }: DashboardProps) {
  const userStats = [
    {
      icon: Shield,
      label: "Account Status",
      value: user?.emailVerified ? "Verified" : "Unverified",
      color: user?.emailVerified ? "text-green-600" : "text-yellow-600",
    },
    {
      icon: UserCheck,
      label: "Role",
      value: user?.role === 'admin' ? 'Admin' : 'User',
      color: user?.role === 'admin' ? "text-primary" : "text-muted-foreground",
    },
    {
      icon: Activity,
      label: "Member Since",
      value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
      color: "text-muted-foreground",
    },
  ];

  const adminStats = stats ? [
    {
      icon: Users,
      label: "Total Users",
      value: stats.totalUsers || 0,
      trend: "+12%",
    },
    {
      icon: UserCheck,
      label: "Active Users",
      value: stats.activeUsers || 0,
      trend: "+8%",
    },
    {
      icon: Shield,
      label: "Admin Users",
      value: stats.adminUsers || 0,
      trend: "+2",
    },
  ] : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, <span className="font-medium text-foreground">{user?.username}</span>
        </p>
      </div>

      {/* User Info Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Account Overview</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'} data-testid="badge-role">
            {user?.role === 'admin' ? 'Admin' : 'User'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userStats.map((stat, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-semibold" data-testid={`text-${stat.label.toLowerCase().replace(' ', '-')}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Admin Stats (only for admin users) */}
      {user?.role === 'admin' && stats && (
        <>
          <div>
            <h2 className="text-2xl font-semibold mb-4">System Statistics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adminStats.map((stat, index) => (
              <Card key={index} className="p-6 h-32">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-3xl font-bold mb-1" data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/profile"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover-elevate active-elevate-2"
            data-testid="link-edit-profile"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <UserCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Edit Profile</p>
              <p className="text-sm text-muted-foreground">Update your account information</p>
            </div>
          </a>

          {user?.role === 'admin' && (
            <a
              href="/admin/users"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover-elevate active-elevate-2"
              data-testid="link-manage-users"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Manage Users</p>
                <p className="text-sm text-muted-foreground">View and manage all users</p>
              </div>
            </a>
          )}
        </div>
      </Card>
    </div>
  );
}
