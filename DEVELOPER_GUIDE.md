# Developer Guide - Article Publisher Implementation

## 📁 File Structure

```
src/components/dashboard/writer/
├── EnhancedRichTextEditor.tsx      # Main editor component with all formatting
├── ArticlePublisher.tsx            # Article management dashboard
├── WriterArticles.tsx              # Articles page (uses ArticlePublisher)
├── WriterDrafts.tsx                # Drafts page with draft management
├── WriterArticleBuilder.tsx        # Alternative advanced builder (optional)
└── WriterArticleBuilderEnhanced.tsx # Enhanced variant (optional)
```

---

## 🏗️ Architecture

### Component Hierarchy

```
WriterArticles Page
└── ArticlePublisher Component
    ├── Stats Section
    ├── Controls (Search, Filter)
    └── Articles List
        └── Article Cards
            └── (On Edit) EnhancedRichTextEditor
                ├── Header Bar
                ├── Metadata Input
                ├── Content Area
                │   └── ContentSegment (x many)
                │       ├── SegmentRenderer
                │       └── Block-specific UI
                └── Settings Sidebar

WriterDrafts Page
└── WriterDrafts Component
    ├── Header
    ├── Draft Cards
    └── (On Edit) EnhancedRichTextEditor
```

---

## 🔌 Integration Points

### 1. With Backend Services

```typescript
// In WriterService.ts or similar, add:
export interface ArticlePublisherAPI {
  // Create
  createArticle(content: EditorState): Promise<Article>
  
  // Read
  getArticles(filters: ArticleFilters): Promise<Article[]>
  getArticleById(id: string): Promise<Article>
  
  // Update
  updateArticle(id: string, content: EditorState): Promise<Article>
  saveDraft(id: string, content: EditorState): Promise<Article>
  publishArticle(id: string): Promise<Article>
  archiveArticle(id: string): Promise<Article>
  
  // Delete
  deleteArticle(id: string): Promise<void>
  
  // Images
  uploadImage(file: File): Promise<string> // Returns image URL
}
```

### 2. Image Upload - Backend Integration

Current implementation uses **client-side blob URLs**. To connect to a real backend:

```typescript
// In EnhancedRichTextEditor.tsx, replace handleImageUpload:
const handleImageUpload = async (segmentId: string, file: File) => {
  try {
    // Upload to backend
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    const { url } = await response.json()
    
    // Update segment with actual URL
    updateSegment(segmentId, {
      imageUrl: url,
      content: segmentId,
    })
  } catch (error) {
    console.error('Upload failed:', error)
  }
}
```

### 3. Data Persistence - Backend Integration

```typescript
// In ArticlePublisher.tsx or WriterDrafts.tsx
const handleSaveDraft = async (content: EditorState) => {
  try {
    const response = await fetch(`/api/articles/${editingArticle?.id || 'new'}`, {
      method: editingArticle ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    })
    const savedArticle = await response.json()
    // Update local state with server response
  } catch (error) {
    console.error('Save failed:', error)
  }
}

const handlePublish = async (content: EditorState) => {
  try {
    const response = await fetch(`/api/articles/${editingArticle?.id}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...content,
        status: 'published',
        publishedAt: new Date(),
      }),
    })
    // Handle success
  } catch (error) {
    console.error('Publish failed:', error)
  }
}
```

---

## 🎨 Customization Guide

### 1. Adding New Content Block Types

```typescript
// In EnhancedRichTextEditor.tsx

// Step 1: Update ContentSegment type
type BlockKind = 'paragraph' | 'h1' | 'h2' | 'h3' | 'quote'
  | 'code' | 'ul' | 'ol' | 'image' | 'divider'
  | 'VIDEO' // NEW TYPE

interface ContentSegment {
  // ... existing fields
  videoUrl?: string // NEW FIELD
  videoCaption?: string // NEW FIELD
}

// Step 2: Add to block menu
const blocks = [
  // ... existing blocks
  { type: 'video', icon: Video, label: 'Video' }, // NEW
]

// Step 3: Add renderer in SegmentRenderer
if (segment.type === 'video') {
  return (
    <div className="space-y-2">
      <input
        value={segment.videoUrl || ''}
        onChange={e => onUpdate(segment.id, { videoUrl: e.target.value })}
        placeholder="Enter video URL (YouTube, Vimeo, etc.)"
        className="w-full px-3 py-2 rounded-lg border border-border bg-background"
      />
      {segment.videoUrl && (
        <div className="aspect-video rounded-lg bg-black">
          {/* Embed video player */}
        </div>
      )}
    </div>
  )
}
```

### 2. Changing the Editor Theme

```typescript
// In EnhancedRichTextEditor.tsx, update the classNames:
const STYLES = {
  heading: 'text-3xl font-bold my-custom-heading', // Customize
  paragraph: 'text-base leading-relaxed my-custom-p', // Customize
  // ... etc
}

// Update colors in settings sidebar
className={`${selectedSegment.alignment === align
  ? 'bg-primary text-primary-foreground'  // Change primary color
  : 'border border-border hover:bg-muted/50'
}`}
```

### 3. Adding Collaborative Features

```typescript
// Example: Real-time collaboration with WebSocket
const [socket, setSocket] = useState<WebSocket | null>(null)

useEffect(() => {
  const ws = new WebSocket(`wss://api.example.com/articles/${articleId}`)
  
  ws.onmessage = (event) => {
    const { type, data } = JSON.parse(event.data)
    if (type === 'SEGMENT_UPDATED') {
      updateSegment(data.id, data.updates)
    }
  }
  
  setSocket(ws)
  return () => ws.close()
}, [])

const updateSegment = useCallback((id: string, updates: any) => {
  // Broadcast to other users
  socket?.send(JSON.stringify({
    type: 'SEGMENT_UPDATE',
    segmentId: id,
    updates,
  }))
  
  // Update local state
  setContent(prev => ({
    ...prev,
    segments: prev.segments.map(s =>
      s.id === id ? { ...s, ...updates } : s
    ),
  }))
}, [socket])
```

---

## 🧪 Testing

### Unit Tests Example

```typescript
// __tests__/EnhancedRichTextEditor.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import EnhancedRichTextEditor from '@/components/dashboard/writer/EnhancedRichTextEditor'

describe('EnhancedRichTextEditor', () => {
  it('should add text blocks', () => {
    render(<EnhancedRichTextEditor />)
    fireEvent.click(screen.getByText('Add Content Block'))
    fireEvent.click(screen.getByText('Paragraph'))
    expect(screen.getByPlaceholderText('Start typing...')).toBeInTheDocument()
  })

  it('should upload images', () => {
    render(<EnhancedRichTextEditor />)
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
    const input = screen.getByRole('button', { name: /upload/i })
    fireEvent.click(input)
    // Assert image is displayed
  })

  it('should save drafts', async () => {
    const onSave = jest.fn()
    render(<EnhancedRichTextEditor onSave={onSave} />)
    fireEvent.click(screen.getByText('Save Draft'))
    await waitFor(() => expect(onSave).toHaveBeenCalled())
  })
})
```

---

## 📊 Performance Considerations

### 1. Large Documents
For articles with 100+ blocks:
```typescript
// Use React.memo for block renderers
const MemoizedSegmentRenderer = React.memo(SegmentRenderer)

// Use windowing for large lists
import { FixedSizeList } from 'react-window'
<FixedSizeList
  height={600}
  itemCount={segments.length}
  itemSize={200}
>
  {({ index, style }) => (
    <div style={style}>
      {/* Render segment at index */}
    </div>
  )}
</FixedSizeList>
```

### 2. Image Optimization
```typescript
// Compress images before upload
const compressImage = async (file: File) => {
  const canvas = await html2canvas(file)
  return new Promise<Blob>(resolve => {
    canvas.toBlob(resolve, 'image/jpeg', 0.8)
  })
}
```

---

## 🔒 Security Best Practices

### 1. Sanitize HTML Output
```typescript
import DOMPurify from 'dompurify'

const renderPreview = () => {
  const html = content.segments
    .map(seg => `<p>${DOMPurify.sanitize(seg.content)}</p>`)
    .join('')
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

### 2. Rate Limiting for Saves
```typescript
const [lastSaveTime, setLastSaveTime] = useState(0)

const handleSaveDraft = () => {
  const now = Date.now()
  if (now - lastSaveTime < 1000) return // Max 1 save per second
  
  onSave?.(content)
  setLastSaveTime(now)
}
```

---

## 📦 Dependencies

### Current Dependencies
```json
{
  "framer-motion": "^12.29.0",
  "lucide-react": "latest",
  "react": "^18.0.0",
  "@radix-ui/*": "latest"
}
```

### Optional Dependencies for Enhancement
```json
{
  "react-markdown": "^8.0.0",
  "remark-gfm": "^3.0.0",
  "html2canvas": "^1.4.1",
  "dompurify": "^3.0.0"
}
```

---

## 🐛 Known Limitations & TODOs

### Current Limitations
- ❌ No real-time collaboration
- ❌ No undo/redo (can be added)
- ❌ No advanced table editor
- ❌ No media library integration
- ❌ No version history

### Implementation TODOs
```typescript
// TODO: Add undo/redo functionality
const useEditor = () => {
  const [history, setHistory] = useState<EditorState[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)
  
  const undo = () => setHistoryIndex(i => Math.max(0, i - 1))
  const redo = () => setHistoryIndex(i => Math.min(history.length - 1, i + 1))
  
  return { undo, redo, canUndo, canRedo }
}

// TODO: Add media library
const MediaLibraryModal = () => {
  // Browse and select previously uploaded images
}

// TODO: Add version history
const VersionHistory = () => {
  // View and restore previous versions
}
```

---

## 🚀 Deployment Checklist

- [ ] Test image upload in production
- [ ] Configure CDN for image storage
- [ ] Set up database for articles
- [ ] Configure API endpoints
- [ ] Add error tracking (Sentry, etc.)
- [ ] Set up rate limiting
- [ ] Add authentication checks
- [ ] Configure CORS
- [ ] Test on multiple browsers
- [ ] Performance audit with Lighthouse
- [ ] Set up monitoring

---

## 📝 API Contract

### Endpoints Required

```
POST   /api/articles              # Create new article
GET    /api/articles              # List articles
GET    /api/articles/:id          # Get article
PUT    /api/articles/:id          # Update article
DELETE /api/articles/:id          # Delete article
POST   /api/articles/:id/publish  # Publish article
POST   /api/articles/:id/archive  # Archive article
POST   /api/upload                # Upload image
GET    /api/articles/search?q=... # Search articles
```

---

## 📞 Support

For questions or issues with the implementation, refer to:
1. Component source code with inline comments
2. This developer guide
3. Test files for usage examples

---

**Last Updated**: February 23, 2026
**Version**: 1.0.0
