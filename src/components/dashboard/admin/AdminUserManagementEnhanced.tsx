// ============================================================
// Enhanced Admin User Management - Connected to AdminService
// ============================================================
'use client';

import { useState, useMemo } from 'react';
import { useAdmin } from '@/hooks/useServices';
import { toast } from 'sonner';
import {
  Search, Filter, UserX, ShieldCheck, Mail, MoreVertical,
  Lock, Unlock, Trash2, Eye, CheckCircle2, Edit3, Loader,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import clsx from 'clsx';

// Mock user database - in real app would come from backend
const MOCK_USERS = [
  {
    id: 'u1',
    name: 'Omar Abdullah',
    email: 'omar@ummah.com',
    role: 'user',
    status: 'active' as const,
    joinedDate: new Date('2024-03-10'),
    country: 'Bangladesh',
    verified: false,
  },
  {
    id: 's1',
    name: 'Dr. Ahmad Al-Rashid',
    email: 'ahmad@ummah.com',
    role: 'scholar',
    status: 'active' as const,
    joinedDate: new Date('2023-01-15'),
    country: 'Saudi Arabia',
    verified: true,
  },
  {
    id: 'w1',
    name: 'Fatima Zahra',
    email: 'fatima@ummah.com',
    role: 'writer',
    status: 'active' as const,
    joinedDate: new Date('2023-08-22'),
    country: 'Morocco',
    verified: false,
  },
  {
    id: 'u2',
    name: 'Yusuf Al-Qassim',
    email: 'yusuf@example.com',
    role: 'user',
    status: 'suspended' as const,
    joinedDate: new Date('2024-02-18'),
    country: 'Egypt',
    verified: false,
  },
  {
    id: 'r1',
    name: 'Ibrahim Khalil',
    email: 'ibrahim@ummah.com',
    role: 'debater',
    status: 'active' as const,
    joinedDate: new Date('2023-05-01'),
    country: 'Turkey',
    verified: false,
  },
];

export function AdminUserManagementEnhanced() {
  const { loading } = useAdmin();
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // ============================================================
  // Filtering & Sorting
  // ============================================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.country.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // ============================================================
  // User Actions
  // ============================================================

  const handleSuspendToggle = async (user: typeof MOCK_USERS[0]) => {
    setIsProcessing(user.id);
    try {
      const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, status: newStatus } : u
        )
      );

      toast.success(
        newStatus === 'suspended'
          ? `${user.name} suspended`
          : `${user.name} reinstated`
      );
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleChangeRole = async (user: typeof MOCK_USERS[0], newRole: string) => {
    setIsProcessing(user.id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, role: newRole } : u
        )
      );

      toast.success(`${user.name} role changed to ${newRole}`);
    } catch (error) {
      toast.error('Failed to change role');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleVerifyScholar = async (user: typeof MOCK_USERS[0]) => {
    setIsProcessing(user.id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, verified: !u.verified } : u
        )
      );

      toast.success(
        user.verified
          ? `${user.name} verification removed`
          : `${user.name} verified as scholar`
      );
    } catch (error) {
      toast.error('Failed to update verification');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDeleteUser = async (user: typeof MOCK_USERS[0]) => {
    if (!confirm(`Delete ${user.name}? This action cannot be undone.`))
      return;

    setIsProcessing(user.id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      setUsers((prev) => prev.filter((u) => u.id !== user.id));

      toast.success(`${user.name} deleted`);
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setIsProcessing(null);
    }
  };

  // ============================================================
  // Statistics
  // ============================================================

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
    verified: users.filter((u) => u.verified).length,
  };

  // ============================================================
  // render
  // ============================================================

  const roleColors: Record<string, string> = {
    scholar: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    writer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    debater: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    user: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">User Management</h2>
        <p className="text-muted-foreground mt-1">Manage user roles, verify scholars, and handle suspensions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm font-semibold text-muted-foreground mb-1">Total Users</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-semibold text-muted-foreground mb-1">Active</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.active}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-semibold text-muted-foreground mb-1">Suspended</p>
          <p className="text-3xl font-bold text-red-600">{stats.suspended}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-semibold text-muted-foreground mb-1">Verified Scholars</p>
          <p className="text-3xl font-bold text-amber-600">{stats.verified}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="writer">Writer</SelectItem>
              <SelectItem value="debater">Debater</SelectItem>
              <SelectItem value="scholar">Scholar</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader className="w-5 h-5 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                    className="cursor-pointer hover:bg-accent transition-colors"
                  >
                    <TableCell className="font-semibold">{user.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(role) => handleChangeRole(user, role)}
                      >
                        <SelectTrigger className={clsx(
                          'w-24 text-xs font-semibold',
                          roleColors[user.role]
                        )}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="writer">Writer</SelectItem>
                          <SelectItem value="debater">Debater</SelectItem>
                          <SelectItem value="scholar">Scholar</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[user.status]}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.joinedDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.verified ? (
                        <CheckCircle2 className="w-4 h-4 text-amber-600" />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerifyScholar(user);
                          }}
                          disabled={isProcessing === user.id}
                          title={user.verified ? 'Remove verification' : 'Verify scholar'}
                        >
                          {isProcessing === user.id ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <ShieldCheck className={clsx(
                              'w-4 h-4',
                              user.verified ? 'text-amber-600 fill-amber-600' : 'text-muted-foreground'
                            )} />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSuspendToggle(user);
                          }}
                          disabled={isProcessing === user.id}
                          title={user.status === 'suspended' ? 'Reinstate' : 'Suspend'}
                        >
                          {isProcessing === user.id ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : user.status === 'suspended' ? (
                            <Unlock className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-red-600" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(user);
                          }}
                          disabled={isProcessing === user.id}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

export default AdminUserManagementEnhanced;
