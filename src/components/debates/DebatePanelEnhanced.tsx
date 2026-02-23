// ============================================================
// Enhanced Debate Panel - With Complete Interaction Logic
// ============================================================
'use client';

import { useState, useRef } from 'react';
import { Debate, QuestionQueue } from '@/types';
import { useDebate } from '@/hooks/useServices';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  MessageSquare, ThumbsUp, Send, Clock, User,
  CheckCircle2, AlertCircle, Loader, Quote,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import clsx from 'clsx';

interface DebatePanelProps {
  debate: Debate;
  currentPhase?: 'opening' | 'clarity' | 'evidence' | 'qa' | 'closing';
}

export function DebatePanel({ debate, currentPhase = 'qa' }: DebatePanelProps) {
  const { user } = useAuth();
  const { submitQuestion, upvoteQuestion, approveQuestion, answerQuestion, loading: serviceLoading } = useDebate(debate.id);

  // State management
  const [questionText, setQuestionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionQueue | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [upvotedQuestions, setUpvotedQuestions] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // Question Queue Handlers
  // ============================================================

  const handleSubmitQuestion = async () => {
    if (!user) {
      toast.error('Please log in to ask a question');
      return;
    }

    if (!questionText.trim()) {
      toast.error('Please enter a question');
      return;
    }

    if (questionText.length < 10) {
      toast.error('Question must be at least 10 characters');
      return;
    }

    if (questionText.length > 500) {
      toast.error('Question must not exceed 500 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitQuestion(user.id, user.name, questionText);
      setQuestionText('');
      toast.success('Question submitted successfully');
    } catch (error) {
      toast.error('Failed to submit question');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvoteQuestion = async (questionId: string) => {
    if (!user) {
      toast.error('Please log in to upvote');
      return;
    }

    try {
      if (upvotedQuestions.has(questionId)) {
        toast.info('You already upvoted this question');
        return;
      }

      await upvoteQuestion(questionId, user.id);
      setUpvotedQuestions(prev => new Set([...prev, questionId]));
      toast.success('Upvote recorded');
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  const handleApproveQuestion = async (questionId: string) => {
    try {
      await approveQuestion(questionId);
      setSelectedQuestion(null);
      toast.success('Question approved for answering');
    } catch (error) {
      toast.error('Failed to approve question');
    }
  };

  const handleAnswerQuestion = async (questionId: string) => {
    if (!answerText.trim()) {
      toast.error('Please enter an answer');
      return;
    }

    try {
      await answerQuestion(questionId, answerText);
      setSelectedQuestion(null);
      setAnswerText('');
      toast.success('Answer recorded');
    } catch (error) {
      toast.error('Failed to submit answer');
    }
  };

  // ============================================================
  // Question Item Component
  // ============================================================

  const QuestionItem = ({ question, isSelected = false }: { question: QuestionQueue; isSelected: boolean }) => (
    <div
      className={clsx(
        'p-3 rounded-lg border cursor-pointer transition-all hover:border-primary hover:bg-accent/50',
        isSelected ? 'border-primary bg-primary/5' : 'border-border'
      )}
      onClick={() => setSelectedQuestion(isSelected ? null : question)}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
            {question.user.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm">{question.user.name}</p>
            <p className="text-xs text-muted-foreground">1 minute ago</p>
          </div>
        </div>
        {question.approved && (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
        )}
      </div>

      <p className="text-sm mb-2">{question.text}</p>

      <div className="flex items-center gap-2 text-xs">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 h-6 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            handleUpvoteQuestion(question.id);
          }}
          disabled={upvotedQuestions.has(question.id) || serviceLoading}
        >
          <ThumbsUp
            className={clsx(
              'w-3 h-3',
              upvotedQuestions.has(question.id) ? 'fill-primary text-primary' : ''
            )}
          />
          {question.upvotes}
        </Button>

        {question.answer && (
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            Answered
          </div>
        )}
      </div>

      {isSelected && (
        <div className="mt-3 pt-3 border-t space-y-2">
          {!question.approved && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded p-2">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                Pending moderation. Approve to make visible to scholars.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full text-xs h-7"
                onClick={() => handleApproveQuestion(question.id)}
              >
                Approve Question
              </Button>
            </div>
          )}

          {question.approved && !question.answer && (
            <div>
              <p className="text-xs font-semibold mb-2">Answer this question:</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter answer..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => handleAnswerQuestion(question.id)}
                  disabled={isSubmitting || !answerText.trim()}
                >
                  {isSubmitting ? <Loader className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          )}

          {question.answer && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded p-2">
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200 mb-1">
                Scholar's Answer:
              </p>
              <p className="text-sm text-emerald-900 dark:text-emerald-100">
                {question.answer}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ============================================================
  // render
  // ============================================================

  // Sort questions: approved first, then by upvotes
  const sortedQuestions = [...debate.questions].sort((a, b) => {
    if (a.approved !== b.approved) return a.approved ? -1 : 1;
    return b.upvotes - a.upvotes;
  });

  const pendingQuestions = sortedQuestions.filter(q => !q.approved).length;
  const answeredQuestions = sortedQuestions.filter(q => q.answer).length;

  return (
    <Card className="w-full h-full flex flex-col bg-background/50 backdrop-blur-sm border-border/50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Live Q&A</h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
            {sortedQuestions.length}
          </span>
        </div>
        {pendingQuestions > 0 && (
          <div className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-2 py-1 rounded-full font-semibold">
            {pendingQuestions} pending
          </div>
        )}
      </div>

      <Tabs defaultValue="questions" className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="px-4 pt-3 border-b border-border/50">
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="questions" className="text-xs">
              Questions ({sortedQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="evidence" className="text-xs">
              Evidence ({(debate.positions?.a?.evidence?.length || 0) + (debate.positions?.b?.evidence?.length || 0)})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Questions Tab */}
        <TabsContent value="questions" className="flex-1 flex flex-col p-0">
          {/* Question submission form */}
          <div className="p-4 border-b border-border/50 bg-muted/30">
            <p className="text-xs font-semibold mb-2 text-muted-foreground">Ask a Question</p>
            <div className="flex gap-2">
              <Input
                placeholder="Type your question here..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                disabled={isSubmitting || serviceLoading}
                className="text-sm"
                maxLength={500}
              />
              <Button
                onClick={handleSubmitQuestion}
                disabled={isSubmitting || serviceLoading || !questionText.trim()}
                size="sm"
              >
                {isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {questionText.length}/500 characters
            </p>
          </div>

          {/* Questions list */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {sortedQuestions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto opacity-30 mb-2" />
                  <p className="text-sm">No questions yet. Be the first to ask!</p>
                </div>
              ) : (
                sortedQuestions.map((q) => (
                  <QuestionItem
                    key={q.id}
                    question={q}
                    isSelected={selectedQuestion?.id === q.id}
                  />
                ))
              )}
            </div>
          </ScrollArea>

          {/* Stats */}
          <div className="px-4 py-3 border-t border-border/50 flex gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {answeredQuestions} answered
            </div>
            {pendingQuestions > 0 && (
              <div className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-500" />
                {pendingQuestions} pending
              </div>
            )}
          </div>
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence" className="flex-1 flex flex-col p-4">
          <ScrollArea>
            <div className="space-y-3">
              {((debate.positions?.a?.evidence?.length || 0) + (debate.positions?.b?.evidence?.length || 0) === 0) ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Quote className="w-8 h-8 mx-auto opacity-30 mb-2" />
                  <p className="text-sm">No evidence presented yet</p>
                </div>
              ) : (
                <>
                  {debate.positions?.a?.evidence?.map((evidence: { type: string; reference: string; arabic?: string }, idx: number) => (
                    <div key={`a-${idx}`} className="p-3 rounded-lg border border-border/50 bg-accent/30">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        {evidence.type.toUpperCase()}
                      </p>
                      {evidence.arabic && (
                        <p className="text-sm text-right mb-1 font-serif">
                          {evidence.arabic}
                        </p>
                      )}
                      <p className="text-sm">
                        {evidence.reference}
                      </p>
                    </div>
                  ))}
                  {debate.positions?.b?.evidence?.map((evidence: { type: string; reference: string; arabic?: string }, idx: number) => (
                    <div key={`b-${idx}`} className="p-3 rounded-lg border border-border/50 bg-accent/30">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        {evidence.type.toUpperCase()}
                      </p>
                      {evidence.arabic && (
                        <p className="text-sm text-right mb-1 font-serif">
                          {evidence.arabic}
                        </p>
                      )}
                      <p className="text-sm">
                        {evidence.reference}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default DebatePanel;
