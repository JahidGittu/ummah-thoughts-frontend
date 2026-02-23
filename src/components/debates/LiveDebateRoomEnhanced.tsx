// ============================================================
// Enhanced Live Debate Room - With Full Interactivity
// ============================================================
'use client';

import { useState, useEffect, useRef } from 'react';
import { Debate } from '@/types';
import { useDebate } from '@/hooks/useServices';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Hand, Mic, Volume2, Phone, Share2, Settings,
  Camera, Eye, Clock, Zap, Users, AlertCircle,
  CheckCircle2, X, ChevronRight, Play, Pause,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';

type NodeJS = {
  Timeout: ReturnType<typeof setTimeout>;
};

interface LiveDebateRoomProps {
  debateId: string;
  debate: Debate;
  isModerator?: boolean;
  isScholar?: boolean;
}

type DebatePhase = 'opening' | 'clarity' | 'evidence' | 'qa' | 'closing';

export function LiveDebateRoom({
  debateId,
  debate,
  isModerator = false,
  isScholar = false,
}: LiveDebateRoomProps) {
  const { user } = useAuth();
  const { joinDebate, leaveDebate, endDebate } = useDebate(debateId);

  // State management
  const [isLive, setIsLive] = useState(debate.status === 'live');
  const [currentPhase, setCurrentPhase] = useState<DebatePhase>('opening');
  const [raisedHands, setRaisedHands] = useState<string[]>([]);
  const [userHandRaised, setUserHandRaised] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [viewersCount, setViewersCount] = useState(debate.viewers);
  const [expandedPanel, setExpandedPanel] = useState<'chat' | 'panel' | null>('panel');
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timer | null>(null);

  // ============================================================
  // Lifecycle: Timer & Room Management
  // ============================================================

  useEffect(() => {
    if (isLive) {
      const timer = setInterval(() => {
        setElapsedTime(t => t + 1);
      }, 1000);
      timerRef.current = timer;
      return () => {
        if (timer) clearInterval(timer);
      };
    }
  }, [isLive]);

  useEffect(() => {
    handleJoinRoom();
    return () => {
      handleLeaveRoom();
    };
  }, []);

  // ============================================================
  // Room Management
  // ============================================================

  const handleJoinRoom = async () => {
    if (!user) {
      toast.error('Please log in to join');
      return;
    }
    try {
      await joinDebate();
      setViewersCount(prev => prev + 1);
      toast.success('Joined debate room');
    } catch (error) {
      toast.error('Failed to join room');
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveDebate();
      setViewersCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to leave room');
    }
  };

  // ============================================================
  // Raised Hands Management
  // ============================================================

  const handleRaiseHand = () => {
    if (!user) {
      toast.error('Please log in');
      return;
    }

    if (userHandRaised) {
      setRaisedHands(prev => prev.filter(id => id !== user.id));
      setUserHandRaised(false);
      toast.info('Hand lowered');
    } else {
      setRaisedHands(prev => [...prev, user.id]);
      setUserHandRaised(true);
      toast.success('Hand raised!');
    }
  };

  const handleCallOnUser = (userId: string) => {
    toast.success('User has been given the floor');
    setRaisedHands(prev => prev.filter(id => id !== userId));
  };

  // ============================================================
  // Debate Control (Moderator Only)
  // ============================================================

  const handlePhaseChange = async (newPhase: DebatePhase) => {
    try {
      // Phase change functionality would require moveToPhase from service
      setCurrentPhase(newPhase);
      toast.success(`Moved to ${newPhase} phase`);
    } catch (error) {
      toast.error('Failed to change phase');
    }
  };

  const handleEndDebate = async () => {
    if (!confirm('Are you sure you want to end this debate?')) return;

    try {
      await endDebate();
      setIsLive(false);
      toast.success('Debate ended');
    } catch (error) {
      toast.error('Failed to end debate');
    }
  };

  // ============================================================
  // UI Utilities
  // ============================================================

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const phaseConfig = {
    opening: { label: 'Opening Statements', color: 'bg-blue-500', icon: '🎤' },
    clarity: { label: 'Clarity Questions', color: 'bg-purple-500', icon: '❓' },
    evidence: { label: 'Evidence & References', color: 'bg-emerald-500', icon: '📚' },
    qa: { label: 'Q&A Session', color: 'bg-amber-500', icon: '💬' },
    closing: { label: 'Closing Remarks', color: 'bg-pink-500', icon: '🎬' },
  };

  // ============================================================
  // render: Main Layout
  // ============================================================

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-primary/20">
        {/* Left: Debate Info */}
        <div className="flex items-center gap-4">
          <div>
            <h2 className="font-bold text-lg">{debate.title}</h2>
            <p className="text-xs text-gray-400">{debate.topic}</p>
          </div>
          {isLive && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-red-400">LIVE</span>
            </div>
          )}
        </div>

        {/* Middle: Timer */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4" />
          <span className="font-mono font-bold">{formatTime(elapsedTime)}</span>
        </div>

        {/* Right: Viewers & Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
            <Eye className="w-4 h-4" />
            <span className="font-semibold">{viewersCount}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => {}} className="hover:bg-white/10">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Section (Left) */}
        <div className="flex-1 flex flex-col">
          {/* Scholars' Video Grid */}
          <div className="flex-1 p-4 space-y-4 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Position A */}
              <div className="rounded-lg overflow-hidden border-2 border-blue-500/50 bg-gradient-to-br from-blue-950 to-blue-900 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-950/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-blue-400/30 mx-auto mb-4" />
                    <p className="text-xl font-bold text-blue-400">
                      {debate.positions.a.scholar.name}
                    </p>
                    <p className="text-sm text-blue-300 mt-1">
                      Position A: {debate.positions.a.position}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-blue-500/80 text-xs font-semibold">
                    <Mic className="w-3 h-3" />
                    Active
                  </div>
                </div>

                {/* Phase Badge */}
                <div className="absolute bottom-4 right-4">
                  <Badge variant="secondary" className="bg-blue-500/80 text-white">
                    {phaseConfig[currentPhase].icon} {phaseConfig[currentPhase].label}
                  </Badge>
                </div>
              </div>

              {/* Position B */}
              <div className="rounded-lg overflow-hidden border-2 border-amber-500/50 bg-gradient-to-br from-amber-950 to-amber-900 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-amber-950/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-amber-400/30 mx-auto mb-4" />
                    <p className="text-xl font-bold text-amber-400">
                      {debate.positions.b.scholar.name}
                    </p>
                    <p className="text-sm text-amber-300 mt-1">
                      Position B: {debate.positions.b.position}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-500/80 text-xs font-semibold">
                    <Mic className="w-3 h-3" />
                    Active
                  </div>
                </div>

                {/* Phase Badge */}
                <div className="absolute bottom-4 right-4">
                  <Badge variant="secondary" className="bg-amber-500/80 text-white">
                    {phaseConfig[currentPhase].icon} {phaseConfig[currentPhase].label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Control Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10">
            {/* Left: Audio/Video Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant={isMuted ? 'destructive' : 'default'}
                size="lg"
                className="rounded-full h-12 w-12 p-0"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <Volume2 className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>

              <Button
                variant={cameraOn ? 'default' : 'outline'}
                size="lg"
                className={clsx('rounded-full h-12 w-12 p-0', cameraOn ? 'bg-green-600 hover:bg-green-700' : '')}
                onClick={() => setCameraOn(!cameraOn)}
              >
                <Camera className="w-5 h-5" />
              </Button>

              <div className="w-px h-8 bg-white/20" />

              <Button
                variant="outline"
                size="lg"
                className="rounded-full h-12 px-4"
                onClick={handleRaiseHand}
              >
                <Hand className={clsx('w-5 h-5 mr-2', userHandRaised ? 'animate-pulse fill-current' : '')} />
                {userHandRaised ? 'Lower Hand' : 'Raise Hand'}
              </Button>
            </div>

            {/* Right: End Debate */}
            {isModerator && (
              <Button
                variant="destructive"
                size="lg"
                onClick={handleEndDebate}
              >
                <Phone className="w-5 h-5 mr-2" />
                End Debate
              </Button>
            )}
          </div>
        </div>

        {/* Right Sidebar: Panels */}
        <div className={clsx(
          'transition-all duration-300 border-l border-primary/20',
          expandedPanel ? 'w-96' : 'w-20'
        )}>
          {/* Sidebar Toggle */}
          {!expandedPanel && (
            <div className="h-full flex items-center justify-start">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedPanel('panel')}
                className="writing-vertical text-xs rotate-180 gap-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {expandedPanel && (
            <div className="h-full flex flex-col">
              {/* Tab Headers */}
              <Tabs
                defaultValue="moderator"
                className="flex-1 flex flex-col"
              >
                <TabsList className="grid w-full grid-cols-2 h-10 border-b border-primary/20 rounded-none bg-transparent p-0">
                  <TabsTrigger
                    value="moderator"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    <Zap className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="chat"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    <Users className="w-4 h-4" />
                  </TabsTrigger>
                  <button
                    onClick={() => setExpandedPanel(null)}
                    className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </TabsList>

                {/* Moderator Controls Tab */}
                <TabsContent value="moderator" className="flex-1 overflow-auto p-4 space-y-4">
                  {/* Phase Control */}
                  {isModerator && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">DEBATE PHASE</p>
                      <div className="space-y-2">
                        {(Object.keys(phaseConfig) as DebatePhase[]).map(phase => (
                          <Button
                            key={phase}
                            variant={currentPhase === phase ? 'default' : 'outline'}
                            className="w-full justify-start"
                            onClick={() => handlePhaseChange(phase)}
                            size="sm"
                          >
                            <span className="text-lg mr-2">{phaseConfig[phase].icon}</span>
                            {phaseConfig[phase].label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raised Hands Queue */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      RAISED HANDS ({raisedHands.length})
                    </p>
                    {raisedHands.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-4 text-center">
                        No hands raised
                      </p>
                    ) : (
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {raisedHands.map((userId, idx) => (
                          <div key={userId} className="flex items-center justify-between p-2 rounded bg-amber-500/20 border border-amber-500/30">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-medium">User {userId}</span>
                            </div>
                            {isModerator && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs"
                                onClick={() => handleCallOnUser(userId)}
                              >
                                Call
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Active Participants Tab */}
                <TabsContent value="chat" className="flex-1 overflow-auto p-4 space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">ACTIVE SCHOLARS</p>
                    {[debate.positions.a.scholar, debate.positions.b.scholar].map(scholar => (
                      <div key={scholar.id} className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <p className="font-semibold text-sm">{scholar.name}</p>
                        <p className="text-xs text-muted-foreground">{scholar.specialization}</p>
                        <div className="flex gap-1 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            <Mic className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">VIEWERS</p>
                    <p className="text-2xl font-bold text-primary">{viewersCount}</p>
                    <p className="text-xs text-muted-foreground">people watching</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveDebateRoom;
