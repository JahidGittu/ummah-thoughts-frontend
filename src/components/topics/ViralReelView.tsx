"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  ThumbsUp, MessageCircle, Share2, Flag, CheckCircle, AlertCircle,
  TrendingUp, Clock, User, Eye, Link2, BookOpen, ArrowRight,
  Heart, MessageSquare, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ReelReply {
  id: string;
  authorName: string;
  isVerified: boolean;
  timestamp: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  likes: number;
  role: 'writer' | 'scholar' | 'community';
}

interface ViralReel {
  id: string;
  title: string;
  titleBn: string;
  source: 'facebook' | 'youtube' | 'tiktok';
  sourceUrl: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  uploadedDate: string;
  creatorName: string;
  creatorAvatar: string;
  factCheckStatus: 'real' | 'misleading' | 'fake' | 'unverified';
  factCheckReason: string;
  factCheckReasonBn: string;
  relatedTopics: Array<{ id: string; nameEn: string; nameBn: string }>;
  overallSentiment: { positive: number; negative: number; neutral: number };
  replies: ReelReply[];
}

const factCheckConfig = {
  real: {
    label: '✓ AUTHENTIC',
    color: 'bg-green-500/10 text-green-700 border-green-500/30',
    icon: CheckCircle,
    bg: 'bg-green-50 dark:bg-green-950/20'
  },
  misleading: {
    label: '⚠ PARTIALLY MISLEADING',
    color: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    icon: AlertCircle,
    bg: 'bg-amber-50 dark:bg-amber-950/20'
  },
  fake: {
    label: '✗ MISINFORMATION',
    color: 'bg-red-500/10 text-red-700 border-red-500/30',
    icon: AlertCircle,
    bg: 'bg-red-50 dark:bg-red-950/20'
  },
  unverified: {
    label: '? UNVERIFIED',
    color: 'bg-gray-500/10 text-gray-700 border-gray-500/30',
    icon: AlertCircle,
    bg: 'bg-gray-50 dark:bg-gray-950/20'
  }
};

const sentimentConfig = {
  positive: { color: 'bg-emerald-500', label: 'Positive', icon: ThumbsUp },
  negative: { color: 'bg-red-500', label: 'Negative', icon: Flag },
  neutral: { color: 'bg-slate-500', label: 'Neutral', icon: MessageSquare }
};

export const ViralReelView = ({
  reel
}: {
  reel: ViralReel;
}) => {
  const { i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';
  const [expandedReply, setExpandedReply] = useState<string | null>(null);

  const FcIcon = factCheckConfig[reel.factCheckStatus].icon;
  const totalReplies = reel.replies.length;
  const positiveCount = reel.overallSentiment.positive;
  const negativeCount = reel.overallSentiment.negative;
  const totalSentiment = positiveCount + negativeCount;

  const positivePercent = totalSentiment ? Math.round((positiveCount / totalSentiment) * 100) : 0;
  const negativePercent = 100 - positivePercent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* ─── FACT CHECK BANNER ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-xl border-2 p-4 ${factCheckConfig[reel.factCheckStatus].bg}`}
      >
        <div className="flex items-start gap-3">
          <FcIcon className={`w-6 h-6 flex-shrink-0 mt-1 ${factCheckConfig[reel.factCheckStatus].color}`} />
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${factCheckConfig[reel.factCheckStatus].color}`}>
              {factCheckConfig[reel.factCheckStatus].label}
            </h3>
            <p className="text-sm text-foreground/80 mt-1">
              {isBengali ? reel.factCheckReasonBn : reel.factCheckReason}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ─── MAIN CONTENT: LEFT REEL + RIGHT ANALYSIS ─── */}
      <div className="grid lg:grid-cols-5 gap-6">
        
        {/* LEFT PANEL: VIDEO & DETAILS */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl overflow-hidden border border-border bg-card shadow-lg"
          >
            {/* Video Thumbnail */}
            <div className="relative aspect-video bg-muted">
              <Image
                src={reel.thumbnail}
                alt={isBengali ? reel.titleBn : reel.title}
                fill
                className="object-cover"
              />
              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <div className="w-6 h-6 ml-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
                </div>
              </div>

              {/* View Count */}
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {(reel.views / 1000).toFixed(0)}K
              </div>

              {/* Source Badge */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase">
                {reel.source}
              </div>
            </div>

            {/* Reel Details */}
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Reel Info</p>
                <h3 className="font-bold text-sm line-clamp-2 mt-1">
                  {isBengali ? reel.titleBn : reel.title}
                </h3>
              </div>

              <Separator />

              {/* Creator Info */}
              <div className="flex items-center gap-2">
                <Image
                  src={reel.creatorAvatar}
                  alt={reel.creatorName}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{reel.creatorName}</p>
                  <p className="text-[10px] text-muted-foreground">{reel.uploadedDate}</p>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="grid grid-cols-3 gap-2 bg-muted/50 rounded-lg p-2.5">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Likes</p>
                  <p className="text-sm font-bold">{(reel.likes / 1000).toFixed(0)}K</p>
                </div>
                <div className="text-center border-l border-r border-border">
                  <p className="text-xs text-muted-foreground">Comments</p>
                  <p className="text-sm font-bold">{reel.comments}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Shares</p>
                  <p className="text-sm font-bold">{(reel.shares / 100).toFixed(0)}K</p>
                </div>
              </div>

              {/* View Original */}
              <Button variant="outline" className="w-full text-sm gap-2" asChild>
                <a href={reel.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <Link2 className="w-4 h-4" />
                  View Original
                </a>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT PANEL: ANALYSIS & SENTIMENT */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* SENTIMENT OVERVIEW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-5 space-y-4"
          >
            <h3 className="font-bold text-lg">Community Sentiment Analysis</h3>

            {/* Sentiment Bar */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden flex">
                  <div
                    className="bg-emerald-500 transition-all"
                    style={{ width: `${positivePercent}%` }}
                  />
                  <div
                    className="bg-red-500"
                    style={{ width: `${negativePercent}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Positive ({positivePercent}%)
                </span>
                <span className="flex items-center gap-1.5 text-red-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Negative ({negativePercent}%)
                </span>
              </div>
            </div>

            <Separator />

            {/* Key Reactions */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2.5 bg-muted/50 rounded-lg">
                <ThumbsUp className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
                <p className="text-xs text-muted-foreground">Agree</p>
                <p className="text-sm font-bold">{positiveCount}</p>
              </div>
              <div className="text-center p-2.5 bg-muted/50 rounded-lg">
                <Flag className="w-4 h-4 mx-auto text-red-500 mb-1" />
                <p className="text-xs text-muted-foreground">Disagree</p>
                <p className="text-sm font-bold">{negativeCount}</p>
              </div>
              <div className="text-center p-2.5 bg-muted/50 rounded-lg">
                <MessageSquare className="w-4 h-4 mx-auto text-slate-500 mb-1" />
                <p className="text-xs text-muted-foreground">Total Replies</p>
                <p className="text-sm font-bold">{totalReplies}</p>
              </div>
            </div>
          </motion.div>

          {/* RELATED SCHOLARLY TOPICS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border bg-primary/5 p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Related Scholarly Topics</h3>
            </div>
            
            <div className="space-y-2">
              {reel.relatedTopics.map((topic) => (
                <motion.button
                  key={topic.id}
                  whileHover={{ x: 4 }}
                  className="w-full text-left p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                      {isBengali ? topic.nameBn : topic.nameEn}
                    </p>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </motion.button>
              ))}
            </div>

            <Button variant="ghost" className="w-full text-primary gap-2">
              View All Related Topics
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ─── TIMELINE: COMMUNITY REPLIES ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-border bg-card p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Community Analysis ({totalReplies})</h3>
          <Badge variant="secondary">Newest First</Badge>
        </div>

        <Separator />

        {/* Replies Timeline */}
        <div className="space-y-3">
          {reel.replies.map((reply, index) => {
            const SentimentIcon = sentimentConfig[reply.sentiment].icon;
            
            return (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors space-y-3"
              >
                {/* Author Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">
                        {reply.authorName.charAt(0)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm truncate">{reply.authorName}</span>
                        {reply.isVerified && (
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                        <Badge variant="outline" className="text-[10px]">
                          {reply.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{reply.timestamp}</p>
                    </div>
                  </div>

                  {/* Sentiment Badge */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg flex-shrink-0 ${
                    reply.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-700' :
                    reply.sentiment === 'negative' ? 'bg-red-500/10 text-red-700' :
                    'bg-slate-500/10 text-slate-700'
                  }`}>
                    <SentimentIcon className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">
                      {sentimentConfig[reply.sentiment].label}
                    </span>
                  </div>
                </div>

                {/* Reply Content */}
                <p className="text-sm leading-relaxed text-foreground/90">
                  {reply.content}
                </p>

                {/* Engagement */}
                <div className="flex items-center gap-4 pt-2">
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors">
                    <Heart className="w-4 h-4" />
                    {reply.likes}
                  </button>
                  <button
                    onClick={() => setExpandedReply(expandedReply === reply.id ? null : reply.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Reply
                  </button>
                </div>

                {/* Expanded Reply Form */}
                <AnimatePresence>
                  {expandedReply === reply.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 border-t border-border/50"
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write your reply..."
                          className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm"
                        />
                        <Button size="sm">Send</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Load More */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="text-center pt-4"
        >
          <Button variant="outline" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Load More Replies
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
