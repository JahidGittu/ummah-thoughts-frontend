// ============================================================
// Enhanced Scholar Debates - Connected to DebateService
// ============================================================
'use client';

import { useState, useMemo } from 'react';
import { useDebate } from '@/hooks/useServices';
import { toast } from 'sonner';
import {
  Calendar, Clock, Users, Zap, Plus, CheckCircle2, XCircle,
  Loader, MessageSquare, TrendingUp, RefreshCw, Search, Filter,
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

// Mock debates for scholars
const MOCK_SCHOLAR_DEBATES = [
  {
    id: 'debate-1',
    title: 'The Role of Technology in Islamic Education',
    opponents: 'Dr. Ahmad Al-Rashid vs Dr. Leila Mansour',
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    duration: 60,
    status: 'scheduled' as const,
    topic: 'Education & Technology',
    viewers: 0,
    clarity: { a: 0, b: 0 },
  },
  {
    id: 'debate-2',
    title: 'Islamic perspective on Climate Change',
    opponents: 'Dr. Fatima Zahra vs Dr. Mohammed Hassan',
    scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    duration: 90,
    status: 'scheduled' as const,
    topic: 'Environment & Islam',
    viewers: 0,
    clarity: { a: 0, b: 0 },
  },
  {
    id: 'debate-3',
    title: 'Digital Governance in Islamic Law',
    opponents: 'Dr. Ibrahim Khalil vs Dr. Aisha Siddiqui',
    scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: 75,
    status: 'completed' as const,
    topic: 'Governance & Law',
    viewers: 234,
    clarity: { a: 156, b: 78 },
  },
  {
    id: 'debate-4',
    title: 'The Future of Islamic Scholarship',
    opponents: 'Dr. Hassan Al-Rashid vs Dr. Maryam Hassan',
    scheduledDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    duration: 120,
    status: 'scheduled' as const,
    topic: 'Scholarship',
    viewers: 0,
    clarity: { a: 0, b: 0 },
  },
];

export function ScholarDebatesEnhanced() {
  const { debates: serviceDebates, joinDebate, endDebate } = useDebate();
  
  type DebateStatus = 'scheduled' | 'live' | 'completed';
  type ScholarDebate = { 
    id: string;
    title: string;
    opponents: string;
    scheduledDate: Date;
    duration: number;
    status: DebateStatus;
    topic: string;
    viewers: number;
    clarity: { a: number; b: number };
  };
  
  const [localDebates, setLocalDebates] = useState<ScholarDebate[]>(MOCK_SCHOLAR_DEBATES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [newDebateTitle, setNewDebateTitle] = useState('');
  const [newDebateOpponents, setNewDebateOpponents] = useState('');
  const [newDebateDays, setNewDebateDays] = useState('7');
  const [isCreating, setIsCreating] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // ============================================================
  // Filtering
  // ============================================================

  const filteredDebates = useMemo(() => {
    return localDebates.filter((debate) => {
      const matchesSearch =
        debate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debate.opponents.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debate.topic.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || debate.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [localDebates, searchTerm, statusFilter]);

  // ============================================================
  // Actions
  // ============================================================

  const handleScheduleDebate = async () => {
    if (!newDebateTitle.trim() || !newDebateOpponents.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    setIsCreating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newDebate = {
        id: `debate-${Date.now()}`,
        title: newDebateTitle,
        opponents: newDebateOpponents,
        scheduledDate: new Date(Date.now() + parseInt(newDebateDays) * 24 * 60 * 60 * 1000),
        duration: 60,
        status: 'scheduled' as const,
        topic: 'New Topic',
        viewers: 0,
        clarity: { a: 0, b: 0 },
      };

      setLocalDebates((prev) => [...prev, newDebate]);

      toast.success('Debate scheduled successfully!');
      setIsScheduleDialogOpen(false);
      setNewDebateTitle('');
      setNewDebateOpponents('');
      setNewDebateDays('7');
    } catch (error) {
      toast.error('Failed to schedule debate');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinDebate = async (debateId: string) => {
    setProcessingId(debateId);
    try {
      await joinDebate(debateId);
      toast.success('Joined debate successfully');
    } catch (error) {
      toast.error('Failed to join debate');
    } finally {
      setProcessingId(null);
    }
  };

  const handleStartLive = async (debateId: string) => {
    setProcessingId(debateId);
    try {
      // Update local state - only update debates with 'scheduled' status to 'live'
      setLocalDebates((prev) =>
        prev.map((d) =>
          d.id === debateId && d.status === 'scheduled' ? { ...d, status: 'live' as const } : d
        )
      );
      toast.success('Debate is now live!');
    } catch (error) {
      toast.error('Failed to start debate');
    } finally {
      setProcessingId(null);
    }
  };

  const handleEndDebate = async (debateId: string) => {
    setProcessingId(debateId);
    try {
      await endDebate(debateId);

      // Update local state
      setLocalDebates((prev) =>
        prev.map((d) =>
          d.id === debateId ? { ...d, status: 'completed' as const } : d
        )
      );
      toast.success('Debate ended');
    } catch (error) {
      toast.error('Failed to end debate');
    } finally {
      setProcessingId(null);
    }
  };

  // ============================================================
  // Statistics
  // ============================================================

  const stats = {
    scheduled: localDebates.filter((d) => d.status === 'scheduled').length,
    live: localDebates.filter((d) => d.status === 'live').length,
    completed: localDebates.filter((d) => d.status === 'completed').length,
    totalViewers: localDebates.reduce((sum, d) => sum + d.viewers, 0),
  };

  // ============================================================
  // render
  // ============================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <MessageSquare className="w-8 h-8" />
          My Debates
        </h2>
        <p className="text-muted-foreground mt-1">
          Schedule, manage, and monitor your scholarly debates
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm font-semibold text-muted-foreground mb-1">Scheduled</p>
          <p className="text-3xl font-bold text-blue-600">{stats.scheduled}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-semibold text-muted-foreground mb-1">Live Now</p>
          <p className="text-3xl font-bold text-red-600">{stats.live}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-semibold text-muted-foreground mb-1">Completed</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.completed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm font-semibold text-muted-foreground mb-1">Total Viewers</p>
          <p className="text-3xl font-bold">{stats.totalViewers}</p>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search debates by title, opponent, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Debates</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Schedule Debate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Debate</DialogTitle>
              <DialogDescription>
                Create a new scholarly debate discussion
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Debate Title</label>
                <Input
                  placeholder="e.g., The Role of Technology in Islamic Education"
                  value={newDebateTitle}
                  onChange={(e) => setNewDebateTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Opposing Scholar</label>
                <Input
                  placeholder="e.g., Dr. Ahmad Al-Rashid vs Dr. Leila Mansour"
                  value={newDebateOpponents}
                  onChange={(e) => setNewDebateOpponents(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Schedule (Days from now)</label>
                <Select value={newDebateDays} onValueChange={setNewDebateDays}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Tomorrow</SelectItem>
                    <SelectItem value="3">In 3 days</SelectItem>
                    <SelectItem value="7">In 1 week</SelectItem>
                    <SelectItem value="14">In 2 weeks</SelectItem>
                    <SelectItem value="30">In 1 month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleScheduleDebate}
                disabled={isCreating}
                className="w-full gap-2"
              >
                {isCreating ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Calendar className="w-4 h-4" />
                )}
                Schedule Debate
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Card>

      {/* Debates Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Opponents</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDebates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No debates found
                  </TableCell>
                </TableRow>
              ) : (
                filteredDebates.map((debate) => (
                  <TableRow key={debate.id} className="hover:bg-accent transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-semibold">{debate.title}</p>
                        <p className="text-xs text-muted-foreground">{debate.topic}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{debate.opponents}</TableCell>
                    <TableCell className="text-sm">
                      {debate.scheduledDate.toLocaleDateString()}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {debate.scheduledDate.toLocaleTimeString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={clsx(
                        debate.status === 'scheduled' && 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                        debate.status === 'live' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse',
                        debate.status === 'completed' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                      )}>
                        {debate.status === 'live' && <Zap className="w-3 h-3 mr-1" />}
                        {debate.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {debate.status.charAt(0).toUpperCase() + debate.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        {debate.duration} min
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {debate.status === 'scheduled' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleJoinDebate(debate.id)}
                              disabled={processingId === debate.id}
                            >
                              {processingId === debate.id ? (
                                <Loader className="w-3 h-3 animate-spin" />
                              ) : (
                                <Users className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleStartLive(debate.id)}
                              disabled={processingId === debate.id}
                              className="gap-1"
                            >
                              {processingId === debate.id ? (
                                <Loader className="w-3 h-3 animate-spin" />
                              ) : (
                                <Zap className="w-3 h-3" />
                              )}
                              Go Live
                            </Button>
                          </>
                        )}

                        {debate.status === 'live' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleEndDebate(debate.id)}
                            disabled={processingId === debate.id}
                          >
                            {processingId === debate.id ? (
                              <Loader className="w-3 h-3 animate-spin" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                          </Button>
                        )}

                        {debate.status === 'completed' && (
                          <Button variant="ghost" size="sm">
                            <TrendingUp className="w-3 h-3" />
                          </Button>
                        )}
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

export default ScholarDebatesEnhanced;
