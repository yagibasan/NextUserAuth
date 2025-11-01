import { useState } from "react";
import { Search, UserX, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { User } from "@shared/schema";

interface UserManagementProps {
  users: User[];
  onDeleteUser: (userId: string) => Promise<void>;
  isLoading?: boolean;
}

export default function UserManagement({ users, onDeleteUser, isLoading = false }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">
          View and manage all users in the system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 h-32">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1" data-testid="stat-total-users">{users.length}</p>
          <p className="text-sm text-muted-foreground">Total Users</p>
        </Card>

        <Card className="p-6 h-32">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Mail className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1" data-testid="stat-verified-users">
            {users.filter(u => u.emailVerified).length}
          </p>
          <p className="text-sm text-muted-foreground">Verified Users</p>
        </Card>

        <Card className="p-6 h-32">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1" data-testid="stat-admin-users">
            {users.filter(u => u.role === 'admin').length}
          </p>
          <p className="text-sm text-muted-foreground">Admin Users</p>
        </Card>

        <Card className="p-6 h-32">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1" data-testid="stat-user-role">
            {users.filter(u => u.role === 'user').length}
          </p>
          <p className="text-sm text-muted-foreground">Standard Users</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users by username or email..."
              className="h-12 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-users"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.objectId} data-testid={`row-user-${user.objectId}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                            {user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.username}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.emailVerified ? 'default' : 'outline'}>
                        {user.emailVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-delete-user-${user.objectId}`}
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {user.username}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteUser(user.objectId)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              data-testid={`button-confirm-delete-${user.objectId}`}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No users found
            </div>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.objectId} className="p-6" data-testid={`card-user-${user.objectId}`}>
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{user.username}</h3>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? 'Admin' : 'User'}
                  </Badge>
                  <Badge variant={user.emailVerified ? 'default' : 'outline'}>
                    {user.emailVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-delete-user-mobile-${user.objectId}`}
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {user.username}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteUser(user.objectId)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
