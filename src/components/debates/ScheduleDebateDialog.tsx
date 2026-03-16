"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageSquare, Video, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { debateApi, userApi } from "@/lib/api";
import { toast } from "sonner";

interface Scholar {
  id: string;
  name: string;
  email: string;
  specialization: string | null;
}

interface ScheduleForm {
  title: string;
  details: string;
  topic: string;
  positionAUserId: string | null;
  positionBUserId: string | null;
  moderatorUserId: string | null;
  positionADisplay: string;
  positionBDisplay: string;
  moderatorDisplay: string;
  date: string;
  time: string;
  format: "async" | "live";
  duration: number;
  youtubeLiveUrl: string;
}

function getMinDate(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getMinTime(): string {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function isToday(dateStr: string): boolean {
  return dateStr === getMinDate();
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ScheduleDebateDialog({ open, onOpenChange, onSuccess }: Props) {
  const [form, setForm] = useState<ScheduleForm>({
    title: "",
    details: "",
    topic: "",
    positionAUserId: null,
    positionBUserId: null,
    moderatorUserId: null,
    positionADisplay: "",
    positionBDisplay: "",
    moderatorDisplay: "",
    date: "",
    time: "",
    format: "async",
    duration: 120,
    youtubeLiveUrl: "",
  });
  const [topics, setTopics] = useState<string[]>([]);
  const [scholarSearch, setScholarSearch] = useState({ a: "", b: "", mod: "" });
  const [scholarResults, setScholarResults] = useState<{ a: Scholar[]; b: Scholar[]; mod: Scholar[] }>({ a: [], b: [], mod: [] });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const minDate = getMinDate();
  const minTime = getMinTime();

  const fetchTopics = useCallback(async () => {
    const { data } = await debateApi.getTopics();
    if (data?.topics) setTopics(data.topics);
  }, []);

  const fetchScholars = useCallback(async (field: "a" | "b" | "mod", q: string) => {
    if (!q.trim()) {
      setScholarResults((r) => ({ ...r, [field]: [] }));
      return;
    }
    const { data } = await userApi.getScholars(q);
    if (data?.scholars) setScholarResults((r) => ({ ...r, [field]: data.scholars }));
  }, []);

  useEffect(() => {
    if (open) fetchTopics();
  }, [open, fetchTopics]);

  useEffect(() => {
    const t = setTimeout(() => fetchScholars("a", scholarSearch.a), 300);
    return () => clearTimeout(t);
  }, [scholarSearch.a, fetchScholars]);
  useEffect(() => {
    const t = setTimeout(() => fetchScholars("b", scholarSearch.b), 300);
    return () => clearTimeout(t);
  }, [scholarSearch.b, fetchScholars]);
  useEffect(() => {
    const t = setTimeout(() => fetchScholars("mod", scholarSearch.mod), 300);
    return () => clearTimeout(t);
  }, [scholarSearch.mod, fetchScholars]);

  const handleTopicSelect = (t: string) => {
    setForm((p) => ({ ...p, topic: t }));
  };

  const handleScholarSelect = (field: "positionA" | "positionB" | "moderator", s: Scholar) => {
    const key = field === "positionA" ? "positionA" : field === "positionB" ? "positionB" : "moderator";
    const displayKey = field === "positionA" ? "positionADisplay" : field === "positionB" ? "positionBDisplay" : "moderatorDisplay";
    const userIdKey = field === "positionA" ? "positionAUserId" : field === "positionB" ? "positionBUserId" : "moderatorUserId";
    setForm((p) => ({ ...p, [userIdKey]: s.id, [displayKey]: s.name }));
    setScholarSearch((r) => ({ ...r, [field === "positionA" ? "a" : field === "positionB" ? "b" : "mod"]: "" }));
    setScholarResults((r) => ({ ...r, [field === "positionA" ? "a" : field === "positionB" ? "b" : "mod"]: [] }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Please enter a debate title");
      return;
    }
    if (!form.details.trim() || form.details.length < 10) {
      toast.error("Please enter details (at least 10 characters)");
      return;
    }
    if (!form.topic.trim()) {
      toast.error("Please select or enter a topic");
      return;
    }
    if (!form.date || !form.time) {
      toast.error("Please select date and time");
      return;
    }
    if (form.format === "live" && !form.youtubeLiveUrl.trim()) {
      toast.error("YouTube Live URL is required for live debates");
      return;
    }
    const scheduledAt = `${form.date}T${form.time}:00`;
    const d = new Date(scheduledAt);
    if (d.getTime() < Date.now()) {
      toast.error("Please select a future date and time");
      return;
    }
    setSaving(true);
    const { data, error } = await debateApi.create({
      title: form.title,
      details: form.details,
      topic: form.topic,
      format: form.format === "live" ? "video" : "chat",
      scheduledAt,
      duration: form.duration,
      youtubeLiveUrl: form.format === "live" ? form.youtubeLiveUrl : null,
      positionAUserId: form.positionAUserId,
      positionBUserId: form.positionBUserId,
      moderatorUserId: form.moderatorUserId,
    });
    setSaving(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Debate scheduled! All users will be notified.");
    onOpenChange(false);
    setForm({
      title: "",
      details: "",
      topic: "",
      positionAUserId: null,
      positionBUserId: null,
      moderatorUserId: null,
      positionADisplay: "",
      positionBDisplay: "",
      moderatorDisplay: "",
      date: "",
      time: "",
      format: "async",
      duration: 120,
      youtubeLiveUrl: "",
    });
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule New Debate</DialogTitle>
          <DialogDescription>
            Create a scholarly debate. All registered users will be notified. Select scholars from the database for suggestions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Debate Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Is Shura Binding or Advisory?"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="details">Details *</Label>
            <Textarea
              id="details"
              placeholder="Full description of the debate..."
              value={form.details}
              onChange={(e) => setForm((p) => ({ ...p, details: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Topic *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {form.topic || "Select or type topic"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <div className="p-2">
                  <Input
                    placeholder="Search or type new topic"
                    value={form.topic}
                    onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
                    className="mb-2"
                  />
                  {topics.filter((t) => t.toLowerCase().includes(form.topic.toLowerCase())).length > 0 ? (
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {topics
                        .filter((t) => t.toLowerCase().includes(form.topic.toLowerCase()))
                        .map((t) => (
                          <button
                            key={t}
                            className="w-full text-left px-3 py-2 rounded hover:bg-muted text-sm"
                            onClick={() => handleTopicSelect(t)}
                          >
                            {t}
                          </button>
                        ))}
                    </div>
                  ) : null}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Position A (Scholar)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {form.positionADisplay || "Search scholar..."}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <div className="p-2">
                    <Input
                      placeholder="Type name or email..."
                      value={scholarSearch.a}
                      onChange={(e) => setScholarSearch((s) => ({ ...s, a: e.target.value }))}
                      className="mb-2"
                    />
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {scholarResults.a.map((s) => (
                          <button
                            key={s.id}
                            className="w-full text-left px-3 py-2 rounded hover:bg-muted text-sm"
                            onClick={() => handleScholarSelect("positionA", s)}
                          >
                            {s.name} {s.specialization && `(${s.specialization})`}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Position B (Scholar)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {form.positionBDisplay || "Search scholar..."}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <div className="p-2">
                    <Input
                      placeholder="Type name or email..."
                      value={scholarSearch.b}
                      onChange={(e) => setScholarSearch((s) => ({ ...s, b: e.target.value }))}
                      className="mb-2"
                    />
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {scholarResults.b.map((s) => (
                        <button
                          key={s.id}
                          className="w-full text-left px-3 py-2 rounded hover:bg-muted text-sm"
                          onClick={() => handleScholarSelect("positionB", s)}
                        >
                          {s.name} {s.specialization && `(${s.specialization})`}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Moderator (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {form.moderatorDisplay || "Search moderator..."}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <div className="p-2">
                    <Input
                      placeholder="Type name or email..."
                      value={scholarSearch.mod}
                      onChange={(e) => setScholarSearch((s) => ({ ...s, mod: e.target.value }))}
                      className="mb-2"
                    />
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {scholarResults.mod.map((s) => (
                        <button
                          key={s.id}
                          className="w-full text-left px-3 py-2 rounded hover:bg-muted text-sm"
                          onClick={() => handleScholarSelect("moderator", s)}
                        >
                          {s.name} {s.specialization && `(${s.specialization})`}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                min={minDate}
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                min={isToday(form.date) ? minTime : undefined}
                value={form.time}
                onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="duration">Duration (mins)</Label>
              <Input
                id="duration"
                type="number"
                min={15}
                max={480}
                value={form.duration}
                onChange={(e) => setForm((p) => ({ ...p, duration: parseInt(e.target.value) || 120 }))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Format</Label>
            <div className="flex gap-2">
              <Button
                variant={form.format === "async" ? "default" : "outline"}
                size="sm"
                onClick={() => setForm((p) => ({ ...p, format: "async" as const, youtubeLiveUrl: "" }))}
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1" /> Written
              </Button>
              <Button
                variant={form.format === "live" ? "default" : "outline"}
                size="sm"
                onClick={() => setForm((p) => ({ ...p, format: "live" as const }))}
              >
                <Video className="h-3.5 w-3.5 mr-1" /> Live
              </Button>
            </div>
          </div>

          {form.format === "live" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="youtube">YouTube Live URL *</Label>
              <Input
                id="youtube"
                placeholder="https://youtube.com/live/xxx or https://youtu.be/xxx"
                value={form.youtubeLiveUrl}
                onChange={(e) => setForm((p) => ({ ...p, youtubeLiveUrl: e.target.value }))}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Scheduling...
              </>
            ) : (
              "Schedule Debate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
