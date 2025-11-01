import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserCog, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { updateUserSchema, type UpdateUserInput } from "@shared/schema";

interface ProfileProps {
  user?: {
    objectId: string;
    username: string;
    email: string;
    role: string;
    emailVerified?: boolean;
    createdAt: string;
  };
  onUpdate: (data: UpdateUserInput) => Promise<void>;
  onDelete: () => Promise<void>;
  isLoading?: boolean;
}

export default function Profile({ user, onUpdate, onDelete, isLoading = false }: ProfileProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: user?.username,
      email: user?.email,
    },
  });

  const onSubmit = async (data: UpdateUserInput) => {
    await onUpdate(data);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              {user?.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold">{user?.username}</h2>
              <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                {user?.role === 'admin' ? 'Admin' : 'User'}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-1">{user?.email}</p>
            <p className="text-sm text-muted-foreground">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </Card>

      {/* Edit Profile Form */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UserCog className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Account Information</h2>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              data-testid="button-edit-profile"
            >
              Edit Profile
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                className="h-12 mt-2"
                disabled={!isEditing}
                data-testid="input-username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm text-destructive mt-1" data-testid="error-username">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="h-12 mt-2"
                disabled={!isEditing}
                data-testid="input-email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1" data-testid="error-email">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div>
              <Label htmlFor="password">New Password (optional)</Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Leave blank to keep current password"
                  className="h-12 pr-12"
                  data-testid="input-password"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-12 w-12"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1" data-testid="error-password">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

          {isEditing && (
            <div className="flex gap-4">
              <Button
                type="submit"
                className="h-12 px-8"
                disabled={isLoading}
                data-testid="button-save-changes"
              >
                <Save className="w-5 h-5 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 px-8"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive/50">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="w-5 h-5 text-destructive" />
          <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
        </div>
        <p className="text-muted-foreground mb-6">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" data-testid="button-delete-account">
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="button-confirm-delete"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
}
