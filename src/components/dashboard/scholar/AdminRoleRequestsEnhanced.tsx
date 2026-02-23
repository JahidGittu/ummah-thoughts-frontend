// ============================================================
// Enhanced Admin Role Requests - Connected to AdminService
// ============================================================
'use client';

import { useState, useMemo } from 'react';
import { useAdmin } from '@/hooks/useServices';
import { toast } from 'sonner';
import {
  CheckCircle2, XCircle, Clock, FileText, User, Mail,
  Phone, Loader, Star, ArrowRight, Search, Filter,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import clsx from 'clsx';

export function AdminRoleRequestsEnhanced() {
  const { roleRequests, loading, approveRequest, rejectRequest } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<typeof roleRequests[number] | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // ============================================================
  // Filtering
  // ============================================================

  const filteredRequests = useMemo(() => {
    return roleRequests.filter((req) => {
      const matchesSearch =
        req.userId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [roleRequests, searchTerm, statusFilter]);

  // ============================================================
  // Actions
  // ============================================================

  const handleApprove = async (requestId: string) => {
    setIsProcessing(requestId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      await approveRequest(requestId, 'admin-user');
      setSelectedRequest(null);
      toast.success('Request approved successfully');
    } catch (error) {
      toast.error('Failed to approve request');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setIsProcessing(requestId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      await rejectRequest(requestId, 'admin-user', rejectionReason);
      setSelectedRequest(null);
      setRejectionReason('');
      toast.success('Request rejected');
    } catch (error) {
      toast.error('Failed to reject request');
    } finally {
      setIsProcessing(null);
    }
  };

  // ============================================================
  // Statistics
  // ============================================================

  const stats = {
    pending: roleRequests.filter((r) => r.status === 'pending').length,
    approved: roleRequests.filter((r) => r.status === 'approved').length,
    rejected: roleRequests.filter((r) => r.status === 'rejected').length,
    total: roleRequests.length,
  };

  // ============================================================
  // render: Request Detail Dialog
  // ============================================================

  const RequestDetailDialog = ({ request }: { request: typeof roleRequests[number] }) => (
    <Dialog open={selectedRequest?.id === request.id} onOpenChange={(open) => {
      if (!open) {
        setSelectedRequest(null);
        setRejectionReason('');
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <FileText className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Role Upgrade Request Details</DialogTitle>
          <DialogDescription>
            Review and decide on this role upgrade request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Request Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">USER</p>
              <p className="font-semibold">{request.userId}</p>
              <p className="text-sm text-muted-foreground">Request to {request.to}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">ROLE UPGRADE</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{request.from}</Badge>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <Badge className="bg-blue-500">{request.to}</Badge>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">REASON</p>
            <p className="p-3 rounded-lg bg-muted text-sm">
              {request.reason || 'No reason provided'}
            </p>
          </div>

          {/* Documents */}
          {request.documents && request.documents.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">SUPPORTING DOCUMENTS</p>
              <div className="space-y-1">
                {request.documents.map((doc, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-muted flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    {doc}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Info */}
          <div className="p-3 rounded-lg border border-border">
            <p className="text-sm font-semibold mb-1">Submitted</p>
            <p className="text-xs text-muted-foreground">
              {request.createdAt instanceof Date ? request.createdAt.toLocaleString() : new Date(request.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Actions - Only for pending */}
          {request.status === 'pending' && (
            <div className="space-y-4 pt-4 border-t">
              {/* Rejection Reason */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Rejection Reason (if rejecting)</label>
                <Input
                  placeholder="Why are you rejecting this request?"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(request.id)}
                  disabled={isProcessing === request.id}
                  className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isProcessing === request.id ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Approve Request
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(request.id)}
                  disabled={isProcessing === request.id}
                  className="flex-1 gap-2"
                >
                  {isProcessing === request.id ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Reject Request
                </Button>
              </div>
            </div>
          )}

          {/* Approved/Rejected Status */}
          {request.status !== 'pending' && (
            <div className={clsx(
              'p-3 rounded-lg text-sm',
              request.status === 'approved'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
            )}>
              <p className="font-semibold mb-1">
                {request.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
              </p>
              {request.reviewedAt && (
                <p className="text-xs">
                  {request.status === 'approved' ? 'Approved on' : 'Rejected on'}: {request.reviewedAt.toLocaleString()}
                </p>
              )}
              {request.rejectionReason && (
                <p className="text-xs mt-1 opacity-75">{request.rejectionReason}</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  // ============================================================
  // render: Main Page
  // ============================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Star className="w-8 h-8" />
          Role Upgrade Requests
        </h2>
        <p className="text-muted-foreground mt-1">
          Review and approve user requests to upgrade their roles
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm font-semibold text-muted-foreground mb-1">Pending</p>
          <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-semibold text-muted-foreground mb-1">Approved</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.approved}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-semibold text-muted-foreground mb-1">Rejected</p>
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-semibold text-muted-foreground mb-1">Total</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
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
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Requests Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role Upgrade</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableRow key={request.id} className="hover:bg-accent transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-semibold">{request.userId}</p>
                        <p className="text-xs text-muted-foreground">Requesting {request.to}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline">{request.from}</Badge>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <Badge className={clsx(
                          'bg-blue-600 text-white',
                          request.status === 'approved' && 'bg-emerald-600',
                          request.status === 'rejected' && 'bg-red-600'
                        )}>
                          {request.to}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {request.createdAt instanceof Date ? request.createdAt.toLocaleDateString() : new Date(request.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={clsx(
                        request.status === 'pending' && 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
                        request.status === 'approved' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
                        request.status === 'rejected' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      )}>
                        {request.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {request.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {request.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <RequestDetailDialog request={request} />
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

export default AdminRoleRequestsEnhanced;
