// ============================================================
// Enhanced Debate Card - With Join/RSVP Functionality
// ============================================================
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Calendar, Clock, Users, Heart, MessageSquare, Share2,
  MapPin, Zap, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { Debate } from '@/types';
import { useDebate } from '@/hooks/useServices';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface DebateCardProps {
  debate: Debate;
  onJoin?: () => void;
  onClick?: () => void;
}

export function DebateCard({ debate, onJoin, onClick }: DebateCardProps) {
  const { user } = useAuth();
  const { joinDebate, leaveDebate, voteClarity, loading } = useDebate(debate.id);
  const [isJoined, setIsJoined] = useState(false);
  const [myVote, setMyVote] = useState<'A' | 'B' | null>(debate.voting.myVote || null);

  const handleJoin = async () => {
    if (!user) {
      toast.error('Please log in to join');
      return;
    }

    try {
      await joinDebate();
      setIsJoined(true);
      toast.success('Joined debate');
      onJoin?.();
    } catch (error) {
      toast.error('Failed to join debate');
    }
  };

  const handleVote = async (vote: 'A' | 'B') => {
    if (!user) {
      toast.error('Please log in to vote');
      return;
    }

    try {
      await voteClarity(user.id, vote);
      setMyVote(vote);
      toast.success(`Voted for Position ${vote.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const statusColor = {
    scheduled: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    live: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };

  const totalVotes = debate.voting.clarityA + debate.voting.clarityB;
  const pctA = totalVotes ? Math.round((debate.voting.clarityA / totalVotes) * 100) : 50;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Card 
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={onClick}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 pb-3 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="font-bold text-lg line-clamp-2 hover:underline">
                {debate.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {debate.topic}
              </p>
            </div>
            <Badge className={statusColor[debate.status]}>
              {debate.status === 'live' && <Zap className="w-3 h-3 mr-1" />}
              {debate.status.charAt(0).toUpperCase() + debate.status.slice(1)}
            </Badge>
          </div>

          {debate.status === 'live' && (
            <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-semibold">
              <span className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full animate-pulse" />
              LIVE NOW
            </div>
          )}
        </div>

        {/* Scholars */}
        <div className="p-4 sm:p-6 pb-3 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {/* Position A */}
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Position A</p>
              <p className="font-semibold text-sm">{debate.positions.a.scholar.name}</p>
              <p className="text-xs text-muted-foreground">
                {debate.positions.a.scholar.specialization}
              </p>
            </div>

            {/* Position B */}
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">Position B</p>
              <p className="font-semibold text-sm">{debate.positions.b.scholar.name}</p>
              <p className="text-xs text-muted-foreground">
                {debate.positions.b.scholar.specialization}
              </p>
            </div>
          </div>
        </div>

        {/* Clarity voting */}
        {debate.status === 'live' && totalVotes > 0 && (
          <div className="px-4 sm:px-6 pb-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Clarity Votes</p>
            <div className="flex items-center gap-2 h-8 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full flex items-center justify-center text-white text-xs font-bold bg-blue-500 transition-all"
                style={{ width: `${pctA}%` }}
              >
                {pctA > 15 && `${pctA}%`}
              </div>
              <div
                className="h-full flex items-center justify-center text-white text-xs font-bold bg-amber-500"
                style={{ width: `${100 - pctA}%` }}
              >
                {(100 - pctA) > 15 && `${100 - pctA}%`}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={myVote === 'A' ? 'default' : 'outline'}
                onClick={(e) => { e.stopPropagation(); handleVote('A'); }}
                disabled={loading || myVote !== null}
                className="flex-1"
              >
                {myVote === 'A' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                Position A ({debate.voting.clarityA})
              </Button>
              <Button
                size="sm"
                variant={myVote === 'B' ? 'default' : 'outline'}
                onClick={(e) => { e.stopPropagation(); handleVote('B'); }}
                disabled={loading || myVote !== null}
                className="flex-1"
              >
                {myVote === 'B' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                Position B ({debate.voting.clarityB})
              </Button>
            </div>
          </div>
        )}

        {/* Meta info */}
        <div className="px-4 sm:px-6 pb-3 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {debate.scheduledAt.toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {debate.duration} mins
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {debate.viewers} watching
          </div>
        </div>

        {/* Join button */}
        <div className="px-4 sm:px-6 pb-4 pt-3 border-t border-border flex gap-2">
          {debate.status === 'live' && !isJoined && (
            <Button
              onClick={(e) => { e.stopPropagation(); handleJoin(); }}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Joining...' : 'Join Now'}
            </Button>
          )}

          {debate.status === 'scheduled' && (
            <Button
              variant="outline"
              onClick={(e) => { e.stopPropagation(); handleJoin(); }}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Subscribing...' : 'Notify Me'}
            </Button>
          )}

          {debate.status === 'completed' && (
            <Link href={`/debates/${debate.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Recording
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export default DebateCard;
