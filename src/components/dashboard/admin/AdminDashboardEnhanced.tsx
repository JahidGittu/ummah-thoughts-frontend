// ============================================================
// Enhanced Admin Dashboard - Complete Moderation Panel
// ============================================================
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Search, Filter, Download, RefreshCw, CheckCircle2, XCircle,
  Clock, AlertTriangle, Shield, Users, FileText, TrendingUp,
  ChevronRight, Loader, Trash2, Lock, Eye, EyeOff, Star,
} from 'lucide-react';
import { useAdmin } from '@/hooks/useServices';
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

interface AdminDashboardProps {
  userId: string;
}

export function AdminDashboard({ userId }: AdminDashboardProps) {
  const { roleRequests, loading, approveRequest, rejectRequest, suspendUser, verifyScholar } = useAdmin();

  // State management
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<typeof roleRequests[number] | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // ============================================================
  // Data Filtering & Sorting
  // ============================================================

  const filteredRequests = useMemo(() => {
    return roleRequests.filter(req => {
      const matchesSearch =
        req.userId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [roleRequests, searchTerm, statusFilter]);

  const stats = {
    pending: roleRequests.filter(r => r.status === 'pending').length,
    approved: roleRequests.filter(r => r.status === 'approved').length,
    rejected: roleRequests.filter(r => r.status === 'rejected').length,
    total: roleRequests.length,
  };

  // ============================================================
  // Request Actions
  // ============================================================

  const handleApproveRequest = async (requestId: string) => {
    try {
      await approveRequest(requestId, userId);
      setSelectedRequest(null);
      toast.success('Request approved successfully');
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await rejectRequest(requestId, userId, rejectionReason);
      setSelectedRequest(null);
      setRejectionReason('');
      toast.success('Request rejected');
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  const handleVerifyScholar = async (scholarUserId: string) => {
    try {
      await verifyScholar(scholarUserId, userId);
      toast.success('Scholar verified');
    } catch (error) {
      toast.error('Failed to verify scholar');
    }
  };

  const handleSuspendUser = async (targetUserId: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;

    try {
      await suspendUser(targetUserId, 'Admin suspension', userId);
      toast.success('User suspended');
    } catch (error) {
      toast.error('Failed to suspend user');
    }
  };

  // ============================================================
  // Stat Card Component
  // ============================================================

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: any;
    label: string;
    value: number;
    color: 'blue' | 'amber' | 'emerald' | 'red';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
      amber: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400',
      emerald: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400',
      red: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400',
    };

    return (
      <Card className={clsx('p-4 border', colorClasses[color])}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold opacity-75 mb-1">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <Icon className="w-8 h-8 opacity-20" />
        </div>
      </Card>
    );
  };

  // ============================================================
  // Request Row Component
  // ============================================================

  const RequestRow = ({ request, isSelected = false }: { request: typeof roleRequests[number]; isSelected: boolean }) => (
    <>
      <TableRow
        onClick={() => setSelectedRequest(isSelected ? null : request)}
        className={clsx(
          'cursor-pointer hover:bg-accent transition-colors',
          isSelected && 'bg-accent'
        )}
      >
        <TableCell className="font-semibold">{request.userId}</TableCell>
        <TableCell>
          <Badge variant="outline">
            {request.from?.toUpperCase()} → {request.to?.toUpperCase()}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge className={clsx(
            request.status === 'pending' ? 'bg-amber-500' : 
            request.status === 'approved' ? 'bg-emerald-500' :
            'bg-red-500'
          )}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {request.createdAt instanceof Date ? request.createdAt.toLocaleDateString() : new Date(request.createdAt).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </TableCell>
      </TableRow>

      {isSelected && (
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableCell colSpan={5} className="p-4">
            <div className="space-y-4">
              {/* Request Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">USER ID</p>
                  <p className="font-mono text-sm">{request.userId}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">SUBMITTED</p>
                  <p className="text-sm">{request.createdAt instanceof Date ? request.createdAt.toLocaleString() : new Date(request.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">REASON</p>
                <p className="text-sm">{request.reason || 'No reason provided'}</p>
              </div>

              {/* Documents - if any */}
              {request.documents && request.documents.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">SUPPORTING DOCUMENTS</p>
                  <div className="space-y-1">
                    {request.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm p-2 rounded bg-muted">
                        <FileText className="w-4 h-4" />
                        <span className="flex-1">{doc}</span>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons - Only for pending requests */}
              {request.status === 'pending' && (
                <div className="pt-2 border-t space-y-2">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1">REJECTION REASON (optional)</label>
                    <Input
                      placeholder="If rejecting, enter reason..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="text-sm mb-2"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApproveRequest(request.id)}
                      disabled={loading}
                      className="flex-1 gap-2"
                    >
                      {loading ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectRequest(request.id)}
                      disabled={loading}
                      className="flex-1 gap-2"
                    >
                      {loading ? <Loader className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      Reject
                    </Button>
                  </div>
                </div>
              )}

              {/* Approved/Rejected info */}
              {request.status !== 'pending' && (
                <div className={clsx(
                  'p-3 rounded text-sm',
                  request.status === 'approved' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200'
                    : 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200'
                )}>
                  <p className="font-semibold">
                    {request.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                  </p>
                  {request.reviewedAt && (
                    <p className="text-xs mt-1">
                      {request.status === 'approved' ? 'Approved on' : 'Rejected on'}: {request.reviewedAt.toLocaleString()}
                    </p>
                  )}
                  {request.rejectionReason && (
                    <p className="text-xs mt-1">Reason: {request.rejectionReason}</p>
                  )}
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );

  // ============================================================
  // render
  // ============================================================

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage role requests, moderation, and platform health</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Pending Requests" value={stats.pending} color="amber" />
        <StatCard icon={CheckCircle2} label="Approved" value={stats.approved} color="emerald" />
        <StatCard icon={XCircle} label="Rejected" value={stats.rejected} color="red" />
        <StatCard icon={Users} label="Total Requests" value={stats.total} color="blue" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests" className="flex gap-2">
            <FileText className="w-4 h-4" />
            Role Requests
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex gap-2">
            <Shield className="w-4 h-4" />
            Moderation
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Role Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            {/* Controls */}
            <div className="p-6 border-b border-border flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by username or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role Upgrade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader className="w-5 h-5 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <RequestRow
                        key={request.id}
                        request={request}
                        isSelected={selectedRequest?.id === request.id}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Moderation Tab */}
        <TabsContent value="moderation" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Moderation Tools
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-amber-900 dark:text-amber-100">
                  <AlertTriangle className="w-4 h-4" />
                  Content Reports (3 pending)
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  3 content reports await moderation review
                </p>
                <Button variant="outline">Review Reports</Button>
              </div>

              <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-red-900 dark:text-red-100">
                  <Lock className="w-4 h-4" />
                  User Suspensions (2 active)
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  2 users currently have active suspensions
                </p>
                <Button variant="outline">Manage Suspensions</Button>
              </div>

              <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
                  <Star className="w-4 h-4" />
                  Scholar Verification (5 pending)
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  5 scholars awaiting verification review
                </p>
                <Button variant="outline">Review Verifications</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Platform Analytics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border bg-muted/50">
                <p className="text-sm font-semibold text-muted-foreground mb-1">AVERAGE APPROVAL TIME</p>
                <p className="text-2xl font-bold">2.3 days</p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/50">
                <p className="text-sm font-semibold text-muted-foreground mb-1">APPROVAL RATE</p>
                <p className="text-2xl font-bold">73%</p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/50">
                <p className="text-sm font-semibold text-muted-foreground mb-1">ACTIVE MODERATORS</p>
                <p className="text-2xl font-bold">12</p>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/50">
                <p className="text-sm font-semibold text-muted-foreground mb-1">REPORTS THIS WEEK</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDashboard;
