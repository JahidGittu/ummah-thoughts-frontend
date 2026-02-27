"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Plus, Bold, Italic, Type, List, ListOrdered,
  Underline, Copy, Eye, Save, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface Topic {
  id: string;
  title: string;
  titleBn: string;
  reelUrl: string;
  thumbnail: string;
  overview: string;
  overviewBn: string;
  analysis: string;
  analysisBn: string;
  createdAt: string;
  status: 'draft' | 'published';
}

export default function WriterTopicsPage() {
  const { i18n, t } = useTranslation();
  const isBengali = i18n.language === 'bn';
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    titleBn: '',
    reelUrl: '',
    thumbnail: '',
    overview: '',
    overviewBn: '',
    analysis: '',
    analysisBn: '',
  });

  // Rich text editor state
  const [analysisHtml, setAnalysisHtml] = useState('');
  const [analysisHtmlBn, setAnalysisHtmlBn] = useState('');

  // Handle text formatting
  const applyFormatting = (format: string, isEnglish: boolean = true) => {
    const textarea = document.getElementById(
      isEnglish ? 'analysis-en' : 'analysis-bn'
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (!selectedText) return;

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'h3':
        formattedText = `### ${selectedText}`;
        break;
      case 'ul':
        formattedText = `• ${selectedText}`;
        break;
      case 'ol':
        formattedText = `1. ${selectedText}`;
        break;
    }

    const newText = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    
    if (isEnglish) {
      setFormData({ ...formData, analysis: newText });
      setAnalysisHtml(newText);
    } else {
      setFormData({ ...formData, analysisBn: newText });
      setAnalysisHtmlBn(newText);
    }
  };

  // Parse markdown to HTML for preview
  const parseMarkdown = (markdown: string) => {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*?)$/gm, '<h3 className="font-bold text-lg mt-3 mb-2">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 className="font-bold text-xl mt-4 mb-2">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 className="font-bold text-2xl mt-4 mb-3">$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong className="font-bold">$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em className="italic">$1</em>');
    
    // Underline
    html = html.replace(/__(.*?)__/g, '<u className="underline">$1</u>');
    
    // Lists
    html = html.replace(/^• (.*?)$/gm, '<li className="ml-4">$1</li>');
    html = html.replace(/^1\. (.*?)$/gm, '<li className="ml-4">$1</li>');
    
    // Paragraphs
    html = html.split('\n').map(line => {
      if (line.trim() && !line.match(/^[#*_]/)) {
        return `<p className="mb-3">${line}</p>`;
      }
      return line;
    }).join('\n');

    return html;
  };

  // Format preview text for display
  const getPreviewText = (text: string) => {
    let formatted = text;
    formatted = formatted.replace(/^# (.*?)$/gm, '$1');
    formatted = formatted.replace(/^## (.*?)$/gm, '$1');
    formatted = formatted.replace(/^### (.*?)$/gm, '$1');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '$1');
    formatted = formatted.replace(/\*(.*?)\*/g, '$1');
    formatted = formatted.replace(/__(.*?)__/g, '$1');
    return formatted;
  };

  const handleCreateTopic = () => {
    if (!formData.title || !formData.reelUrl || !formData.analysis) {
      alert('Please fill all required fields');
      return;
    }

    const newTopic: Topic = {
      id: Date.now().toString(),
      title: formData.title,
      titleBn: formData.titleBn,
      reelUrl: formData.reelUrl,
      thumbnail: formData.thumbnail || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop',
      overview: formData.overview,
      overviewBn: formData.overviewBn,
      analysis: formData.analysis,
      analysisBn: formData.analysisBn,
      createdAt: new Date().toLocaleDateString(),
      status: 'draft',
    };

    setTopics([newTopic, ...topics]);
    setFormData({
      title: '',
      titleBn: '',
      reelUrl: '',
      thumbnail: '',
      overview: '',
      overviewBn: '',
      analysis: '',
      analysisBn: '',
    });
    setAnalysisHtml('');
    setAnalysisHtmlBn('');
    setIsCreating(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {isBengali ? 'আমার বিষয়াবলী' : 'My Topics'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isBengali 
                ? 'ভাইরাল রিল থেকে বিস্তারিত বিশ্লেষণ তৈরি করুন'
                : 'Create detailed analysis from viral reels'
              }
            </p>
          </div>
          <Button
            onClick={() => setIsCreating(!isCreating)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            {isBengali ? 'নতুন বিষয়' : 'New Topic'}
          </Button>
        </div>

        {/* Create Form */}
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-6 space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {isBengali ? 'নতুন বিষয় তৈরি করুন' : 'Create New Topic'}
              </h2>
              <button
                onClick={() => setIsCreating(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* English Title */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {isBengali ? 'শিরোনাম (ইংরেজি)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g., Is Democracy Allowed in Islam?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Bengali Title */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {isBengali ? 'শিরোনাম (বাংলা)' : 'Title (Bengali)'}
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ইসলামে গণতন্ত্র কি বৈধ?"
                  value={formData.titleBn}
                  onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Reel URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {isBengali ? 'রিল ইউআরএল' : 'Reel URL'}
                </label>
                <input
                  type="url"
                  placeholder="https://facebook.com/watch/?v=..."
                  value={formData.reelUrl}
                  onChange={(e) => setFormData({ ...formData, reelUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Thumbnail URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {isBengali ? 'থাম্বনেইল ছবি' : 'Thumbnail Image'}
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* English Overview */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {isBengali ? 'সংক্ষিপ্ত বর্ণনা (ইংরেজি)' : 'Overview (English)'}
                </label>
                <textarea
                  placeholder="Brief description of the reel content..."
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Bengali Overview */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {isBengali ? 'সংক্ষিপ্ত বর্ণনা (বাংলা)' : 'Overview (Bengali)'}
                </label>
                <textarea
                  placeholder="রিল বিষয়বস্তুর সংক্ষিপ্ত বর্ণনা..."
                  value={formData.overviewBn}
                  onChange={(e) => setFormData({ ...formData, overviewBn: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>

            {/* Rich Text Editor Section */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-foreground">
                    {isBengali ? 'বিস্তারিত বিশ্লেষণ (ইংরেজি)' : 'Detailed Analysis (English)'}
                  </label>
                  <div className="text-xs text-muted-foreground">
                    {isBengali ? 'সাজান: **সাহসী** *তির্যক* __যোগাযোগ' : 'Format: **bold** *italic* __underline'}
                  </div>
                </div>

                {/* Formatting Toolbar */}
                <div className="flex gap-2 mb-3 p-3 bg-muted/50 rounded-lg flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('bold', true)}
                    className="gap-1.5"
                  >
                    <Bold className="w-3.5 h-3.5" />
                    <span className="text-xs">{isBengali ? 'সাহসী' : 'Bold'}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('italic', true)}
                    className="gap-1.5"
                  >
                    <Italic className="w-3.5 h-3.5" />
                    <span className="text-xs">{isBengali ? 'তির্যক' : 'Italic'}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('underline', true)}
                    className="gap-1.5"
                  >
                    <Underline className="w-3.5 h-3.5" />
                    <span className="text-xs">{isBengali ? 'আন্ডারলাইন' : 'Underline'}</span>
                  </Button>
                  
                  <div className="w-px bg-border mx-1" />

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('h1', true)}
                    className="gap-1.5"
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span className="text-xs">H1</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('h2', true)}
                    className="gap-1.5"
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span className="text-xs">H2</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('h3', true)}
                    className="gap-1.5"
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span className="text-xs">H3</span>
                  </Button>

                  <div className="w-px bg-border mx-1" />

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('ul', true)}
                    className="gap-1.5"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span className="text-xs">{isBengali ? 'তালিকা' : 'List'}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('ol', true)}
                    className="gap-1.5"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                    <span className="text-xs">{isBengali ? 'সংখ্যা' : 'Ordered'}</span>
                  </Button>
                </div>

                {/* Textarea */}
                <textarea
                  id="analysis-en"
                  placeholder="Write your detailed analysis here... Use formatting buttons for bold, italic, headings, etc."
                  value={formData.analysis}
                  onChange={(e) => {
                    setFormData({ ...formData, analysis: e.target.value });
                    setAnalysisHtml(e.target.value);
                  }}
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Bengali Analysis */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-foreground">
                    {isBengali ? 'বিস্তারিত বিশ্লেষণ (বাংলা)' : 'Detailed Analysis (Bengali)'}
                  </label>
                </div>

                {/* Formatting Toolbar */}
                <div className="flex gap-2 mb-3 p-3 bg-muted/50 rounded-lg flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('bold', false)}
                    className="gap-1.5"
                  >
                    <Bold className="w-3.5 h-3.5" />
                    <span className="text-xs">{isBengali ? 'সাহসী' : 'Bold'}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('italic', false)}
                    className="gap-1.5"
                  >
                    <Italic className="w-3.5 h-3.5" />
                    <span className="text-xs">{isBengali ? 'তির্যক' : 'Italic'}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('underline', false)}
                    className="gap-1.5"
                  >
                    <Underline className="w-3.5 h-3.5" />
                    <span className="text-xs">{isBengali ? 'আন্ডারলাইন' : 'Underline'}</span>
                  </Button>
                  
                  <div className="w-px bg-border mx-1" />

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('h1', false)}
                    className="gap-1.5"
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span className="text-xs">H1</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('h2', false)}
                    className="gap-1.5"
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span className="text-xs">H2</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('h3', false)}
                    className="gap-1.5"
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span className="text-xs">H3</span>
                  </Button>

                  <div className="w-px bg-border mx-1" />

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('ul', false)}
                    className="gap-1.5"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span className="text-xs">{isBengali ? 'তালিকা' : 'List'}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applyFormatting('ol', false)}
                    className="gap-1.5"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                    <span className="text-xs">{isBengali ? 'সংখ্যা' : 'Ordered'}</span>
                  </Button>
                </div>

                {/* Textarea */}
                <textarea
                  id="analysis-bn"
                  placeholder="আপনার বিস্তারিত বিশ্লেষণ এখানে লিখুন..."
                  value={formData.analysisBn}
                  onChange={(e) => {
                    setFormData({ ...formData, analysisBn: e.target.value });
                    setAnalysisHtmlBn(e.target.value);
                  }}
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>

            {/* Preview & Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setIsPreview(!isPreview)}
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                {isBengali ? 'পূর্বরূপ' : 'Preview'}
              </Button>
              <Button
                onClick={handleCreateTopic}
                className="gap-2 flex-1"
              >
                <Save className="w-4 h-4" />
                {isBengali ? 'সংরক্ষণ করুন' : 'Save Topic'}
              </Button>
            </div>

            {/* Preview Section */}
            {isPreview && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-muted/30 rounded-xl border border-border space-y-4"
              >
                <h3 className="font-bold text-lg">{isBengali ? 'পূর্বরূপ' : 'Preview'}</h3>
                <div className="bg-card p-4 rounded-lg space-y-3">
                  <div>
                    <h4 className="font-bold text-primary text-sm mb-1">{isBengali ? 'শিরোনাম' : 'Title'}</h4>
                    <p className="text-foreground">{formData.title}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-sm mb-1">{isBengali ? 'বিশ্লেষণ' : 'Analysis'}</h4>
                    <div className="text-sm text-foreground whitespace-pre-wrap">
                      {getPreviewText(formData.analysis)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Topics List */}
        <div className="space-y-4">
          {topics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {isBengali 
                  ? 'এখনো কোনো বিষয় তৈরি করেননি'
                  : 'No topics created yet'
                }
              </p>
            </div>
          ) : (
            topics.map((topic) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={topic.thumbnail}
                    alt={topic.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-foreground mb-1">
                      {isBengali ? topic.titleBn : topic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {isBengali ? topic.overviewBn : topic.overview}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isBengali ? 'তৈরি: ' : 'Created: '}{topic.createdAt} • {topic.status}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      {isBengali ? 'সম্পাদনা' : 'Edit'}
                    </Button>
                    <Button size="sm" variant="outline">
                      {isBengali ? 'প্রকাশিত' : 'Publish'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
