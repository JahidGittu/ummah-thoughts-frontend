// ============================================================
// Enhanced User Profile - Profile & Role Upgrade Management
// ============================================================
'use client';

import { useState } from 'react';
import { UserProfile, UserProgress } from '@/types';
import { useUserProfile } from '@/hooks/useServices';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  User, Mail, Phone, MapPin, FileText, Settings,
  Award, TrendingUp, BookOpen, MessageSquare, Share2,
  Edit2, Save, X, Upload, Camera, Star, CheckCircle2,
  BarChart3, Calendar, Target, Users, Clock,
  Send, Loader,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import clsx from 'clsx';

interface UserProfilePageProps {
  userId?: string;
  isOwnProfile?: boolean;
}

export function UserProfilePage({ userId, isOwnProfile = true }: UserProfilePageProps) {
  const { user: currentUser } = useAuth();
  const { profile, progress, loading, updateProfile, updatePreferences, requestRoleUpgrade, followUser, unfollowUser } = useUserProfile(userId || currentUser?.id);

  // State management
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<UserProfile>>({
    name: profile?.name,
    bio: profile?.bio,
    email: profile?.email,
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedRoleUpgrade, setSelectedRoleUpgrade] = useState<'writer' | 'debater' | 'scholar' | null>(null);
  const [upgradeReason, setUpgradeReason] = useState('');
  const [isSubmittingUpgrade, setIsSubmittingUpgrade] = useState(false);

  // ============================================================
  // Profile Update Handlers
  // ============================================================

  const handleUpdateProfile = async () => {
    if (!profile) return;

    try {
      await updateProfile(editFormData);
      setIsEditingProfile(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setEditFormData({
      name: profile?.name,
      bio: profile?.bio,
      email: profile?.email,
    });
    setIsEditingProfile(false);
  };

  // ============================================================
  // Follow/Unfollow Handler
  // ============================================================

  const handleFollowToggle = async () => {
    if (!profile || !currentUser) return;

    try {
      if (isFollowing) {
        await unfollowUser(profile.id);
        setIsFollowing(false);
        toast.success('Unfollowed');
      } else {
        await followUser(profile.id);
        setIsFollowing(true);
        toast.success('Followed successfully');
      }
    } catch (error) {
      toast.error('Failed to update follow status');
    }
  };

  // ============================================================
  // Role Upgrade Handler
  // ============================================================

  const handleRequestRoleUpgrade = async () => {
    if (!selectedRoleUpgrade || !upgradeReason.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    if (!profile || !currentUser) return;

    setIsSubmittingUpgrade(true);
    try {
      await requestRoleUpgrade(
        selectedRoleUpgrade,
        upgradeReason,
        [] // documents - can be added later
      );
      
      setSelectedRoleUpgrade(null);
      setUpgradeReason('');
      toast.success('Role upgrade request submitted. Await admin review.');
    } catch (error) {
      toast.error('Failed to submit role upgrade request');
    } finally {
      setIsSubmittingUpgrade(false);
    }
  };

  // ============================================================
  // UI Components
  // ============================================================

  if (loading || !profile || !progress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ============================================================
  // render: Profile Stats
  // ============================================================

  const StatItem = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: any;
    label: string;
    value: string | number;
    color: 'blue' | 'amber' | 'emerald' | 'purple';
  }) => {
    const colorClasses = {
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
      amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30',
      emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
      purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30',
    };

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={clsx('p-4 rounded-lg border', colorClasses[color])}
      >
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4" />
          <p className="text-xs font-semibold opacity-75">{label}</p>
        </div>
        <p className="text-2xl font-bold">{value}</p>
      </motion.div>
    );
  };

  // ============================================================
  // render: Main Layout
  // ============================================================

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero / Header Section */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <Card className="overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20" />

          {/* Profile Info */}
          <div className="px-6 pb-6 -mt-16 relative">
            <div className="flex items-end justify-between mb-4">
              <div className="flex items-end gap-4">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary border-4 border-background flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                  {profile.name.charAt(0)}
                </div>

                {/* Basic Info */}
                <div className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl font-bold">{profile.name}</h1>
                    {profile.verified && (
                      <CheckCircle2 className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                  <Badge className="mb-2 text-xs">
                    {profile.role?.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{profile.bio || 'No bio yet'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              {isOwnProfile && (
                <Button
                  onClick={() => setIsEditingProfile(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}

              {!isOwnProfile && (
                <Button
                  onClick={handleFollowToggle}
                  variant={isFollowing ? 'default' : 'outline'}
                  className="gap-2"
                >
                  <Users className="w-4 h-4" />
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {profile.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatItem
          icon={BookOpen}
          label="Articles Read"
          value={progress.articlesRead}
          color="blue"
        />
        <StatItem
          icon={MessageSquare}
          label="Debates Watched"
          value={progress.debatesWatched}
          color="amber"
        />
        <StatItem
          icon={Target}
          label="Questions Asked"
          value={progress.questionsAsked}
          color="emerald"
        />
        <StatItem
          icon={TrendingUp}
          label="Points"
          value={`${profile.stats.points}`}
          color="purple"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6 space-y-6">
            {/* Bio Section */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                About
              </h3>
              {isEditingProfile ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Name</label>
                    <Input
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">Bio</label>
                    <Input
                      value={editFormData.bio || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleUpdateProfile} className="gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {profile.bio || 'No bio yet. Edit profile to add one.'}
                </p>
              )}
            </div>

            {/* Role Upgrade Section - Only for own profile */}
            {isOwnProfile && profile.role !== 'scholar' && (
              <div className="pt-6 border-t space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Upgrade Your Role
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['writer', 'debater', 'scholar'].map((role) => {
                    if (profile.role === role) return null;

                    return (
                      <Dialog key={role}>
                        <DialogTrigger asChild>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="p-4 rounded-lg border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                          >
                            <p className="font-semibold text-sm capitalize mb-1">{role}</p>
                            <p className="text-xs text-muted-foreground">
                              {role === 'writer' && 'Write & publish articles'}
                              {role === 'debater' && 'Lead scholarly debates'}
                              {role === 'scholar' && 'Full verification status'}
                            </p>
                          </motion.button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request {role.charAt(0).toUpperCase() + role.slice(1)} Status</DialogTitle>
                            <DialogDescription>
                              Upgrade your account to unlock new features and capabilities.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4 py-4">
                            <div>
                              <label className="text-sm font-semibold mb-2 block">Why do you want this role?</label>
                              <Input
                                placeholder="Explain your background and motivation..."
                                value={upgradeReason}
                                onChange={(e) => setUpgradeReason(e.target.value)}
                                className="text-sm"
                                maxLength={500}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {upgradeReason.length}/500 characters
                              </p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded border border-blue-200 dark:border-blue-800">
                              <p className="text-xs text-blue-800 dark:text-blue-200">
                                An admin will review your request within 1-2 business days.
                              </p>
                            </div>

                            <Button
                              onClick={() => {
                                setSelectedRoleUpgrade(role as any);
                                handleRequestRoleUpgrade();
                              }}
                              disabled={isSubmittingUpgrade || !upgradeReason.trim()}
                              className="w-full gap-2"
                            >
                              {isSubmittingUpgrade ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                              Submit Request
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Learning Progress
            </h3>

            {/* Level Progress */}
            <div>
              <p className="text-sm font-semibold mb-3">
                Points: {profile.stats.points} pts
              </p>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  style={{ width: `${Math.min((profile.stats.points % 100), 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Progress: {Math.min((profile.stats.points % 100), 100)}% to next milestone
              </p>
            </div>

            {/* Activity Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <p className="text-xs font-semibold text-muted-foreground mb-1">ARTICLES READ</p>
                <p className="text-2xl font-bold">{progress.articlesRead}</p>
                <p className="text-xs text-muted-foreground mt-1">+15 XP each</p>
              </div>

              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                <p className="text-xs font-semibold text-muted-foreground mb-1">DEBATES WATCHED</p>
                <p className="text-2xl font-bold">{progress.debatesWatched}</p>
                <p className="text-xs text-muted-foreground mt-1">+10 XP each</p>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                <p className="text-xs font-semibold text-muted-foreground mb-1">QUESTIONS ASKED</p>
                <p className="text-2xl font-bold">{progress.questionsAsked}</p>
                <p className="text-xs text-muted-foreground mt-1">+5 XP each</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-sm">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Get notified about debates, articles, and updates
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-sm">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Easier on the eyes during night reading
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-sm">Public Profile</p>
                  <p className="text-xs text-muted-foreground">
                    Allow others to discover your profile
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UserProfilePage;
