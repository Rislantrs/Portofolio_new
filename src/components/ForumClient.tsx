"use client";

import { useEffect, useState, useMemo } from "react";
import {
  MessageSquare,
  Star,
  PlusCircle,
  ArrowLeft,
  Send,
  CornerDownRight,
  Filter,
  AlertTriangle,
  HelpCircle,
  MessageCircle,
  ThumbsUp,
  X,
  TrendingUp,
  Activity,
  Layers,
  ChevronRight
} from "lucide-react";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  parentId: string | null;
}

interface Thread {
  id: string;
  title: string;
  author: string;
  avatar: string;
  category: "Review" | "QA" | "General" | "Bug";
  rating: number | null;
  content: string;
  createdAt: string;
  comments: Comment[];
}

const categories = [
  { id: "All", label: "All Topics", icon: <MessageSquare size={12} /> },
  { id: "Review", label: "Reviews", icon: <Star size={12} /> },
  { id: "QA", label: "Q&A Help", icon: <HelpCircle size={12} /> },
  { id: "General", label: "General Chat", icon: <MessageCircle size={12} /> },
  { id: "Bug", label: "Bug Reports", icon: <AlertTriangle size={12} /> },
];

const avatars = ["👨‍💻", "🚀", "💡", "🎨", "😸", "🌟", "🤔", "⚡", "👾", "🔥", "🐱", "🦊", "🍕", "🎈"];

// 100% deterministic, locale-independent, and timezone-independent date formatter to prevent hydration mismatch
function formatDate(isoString: string) {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const day = d.getUTCDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes} UTC`;
  } catch {
    return isoString;
  }
}

export default function ForumClient() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "comments" | "rating">("newest");
  const [loading, setLoading] = useState(true);
  const [submittingThread, setSubmittingThread] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // New Thread Form state
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newAvatar, setNewAvatar] = useState("👨‍💻");
  const [newCategory, setNewCategory] = useState<"Review" | "QA" | "General" | "Bug">("Review");
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState("");
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  // New Comment/Reply state
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentAvatar, setCommentAvatar] = useState("👾");
  const [commentContent, setCommentContent] = useState("");

  // Load threads on mount
  useEffect(() => {
    async function loadThreads() {
      try {
        const response = await fetch("/api/forum");
        if (response.ok) {
          const data = (await response.json()) as Thread[];
          setThreads(data);
          if (data.length > 0) {
            setSelectedThreadId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Error loading forum threads:", err);
      } finally {
        setLoading(false);
      }
    }
    void loadThreads();
  }, []);

  // Community Metrics Calculation
  const totalThreads = threads.length;
  
  const avgRating = useMemo(() => {
    const reviews = threads.filter((t) => t.category === "Review" && t.rating !== null);
    if (reviews.length === 0) return 5.0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [threads]);

  const totalComments = useMemo(() => {
    return threads.reduce((acc, t) => acc + (t.comments?.length || 0), 0);
  }, [threads]);

  const bugCount = useMemo(() => {
    return threads.filter((t) => t.category === "Bug").length;
  }, [threads]);

  // Filtered and Sorted Threads
  const processedThreads = useMemo(() => {
    let result = [...threads];

    if (categoryFilter !== "All") {
      result = result.filter((t) => t.category === categoryFilter);
    }

    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "comments") {
      result.sort((a, b) => b.comments.length - a.comments.length);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [threads, categoryFilter, sortBy]);

  const selectedThread = useMemo(() => {
    return threads.find((t) => t.id === selectedThreadId) || null;
  }, [threads, selectedThreadId]);

  // Handle Thread Submission
  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim() || !newContent.trim()) return;

    setSubmittingThread(true);
    try {
      const response = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_thread",
          title: newTitle,
          author: newAuthor,
          avatar: newAvatar,
          category: newCategory,
          rating: newCategory === "Review" ? newRating : null,
          content: newContent,
        }),
      });

      if (response.ok) {
        const createdThread = (await response.json()) as Thread;
        setThreads((prev) => [createdThread, ...prev]);
        setSelectedThreadId(createdThread.id);
        setShowCreateForm(false);

        // Reset fields
        setNewTitle("");
        setNewAuthor("");
        setNewContent("");
        setNewCategory("Review");
        setNewRating(5);
      }
    } catch (err) {
      console.error("Error creating thread:", err);
    } finally {
      setSubmittingThread(false);
    }
  };

  // Handle Comment Submission
  const handleAddComment = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    if (!selectedThreadId || !commentAuthor.trim() || !commentContent.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_comment",
          threadId: selectedThreadId,
          author: commentAuthor,
          avatar: commentAvatar,
          content: commentContent,
          parentId,
        }),
      });

      if (response.ok) {
        const updatedThread = (await response.json()) as Thread;
        setThreads((prev) =>
          prev.map((t) => (t.id === updatedThread.id ? updatedThread : t))
        );
        setCommentContent("");
        setReplyingToCommentId(null);
      }
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    let classes = "bg-white/5 text-white/60 border-white/10";
    if (category === "Review") classes = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (category === "QA") classes = "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (category === "Bug") classes = "bg-rose-500/10 text-rose-400 border-rose-500/20";
    if (category === "General") classes = "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20";

    return (
      <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${classes}`}>
        {category}
      </span>
    );
  };

  // Recursive Comment Node Component with visual tree lines
  const CommentNode = ({ comment, allComments, depth = 0 }: { comment: Comment; allComments: Comment[]; depth: number }) => {
    const replies = allComments.filter((c) => c.parentId === comment.id);
    const isReplying = replyingToCommentId === comment.id;

    return (
      <div className="flex flex-col gap-2 mt-2">
        <div className="rounded-xl border border-white/[0.05] bg-bg-elevated/40 p-4 transition hover:border-white/10 shadow-sm relative group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">{comment.avatar}</span>
              <span className="font-display text-xs font-bold text-accent-light">{comment.author}</span>
            </div>
            <span className="font-mono text-[9px] text-text-subtle">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          
          <p className="mt-2 text-xs leading-relaxed text-text-muted whitespace-pre-wrap">{comment.content}</p>
          
          <div className="mt-3.5 flex items-center justify-between border-t border-white/5 pt-2.5">
            <button className="flex items-center gap-1.5 font-mono text-[9px] text-text-subtle hover:text-white transition">
              <ThumbsUp size={10} /> Helpful
            </button>
            {depth < 3 && (
              <button
                onClick={() => {
                  setReplyingToCommentId(isReplying ? null : comment.id);
                  setCommentContent("");
                }}
                className="font-mono text-[9px] text-accent hover:text-white transition uppercase font-bold"
              >
                {isReplying ? "Cancel" : "Reply"}
              </button>
            )}
          </div>
        </div>

        {/* Reply Box nested */}
        {isReplying && (
          <div className="ml-4 pl-4 border-l border-accent/20 my-2">
            <form onSubmit={(e) => handleAddComment(e, comment.id)} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-text-subtle">Your Name</label>
                  <input
                    type="text"
                    placeholder="Robin"
                    required
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="rounded border border-white/10 bg-bg px-3 py-2 font-sans text-xs text-white focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-text-subtle">Select Avatar</span>
                  <div className="flex flex-wrap gap-1">
                    {avatars.slice(0, 5).map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setCommentAvatar(av)}
                        className={`h-6 w-6 flex items-center justify-center rounded-full text-xs border transition ${
                          commentAvatar === av
                            ? "border-accent bg-accent/20"
                            : "border-white/5 bg-white/5"
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <textarea
                placeholder={`Write reply to ${comment.author}...`}
                required
                rows={2}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="rounded border border-white/10 bg-bg px-3 py-2 font-sans text-xs text-white focus:border-accent focus:outline-none resize-none"
              />
              <button
                type="submit"
                disabled={submittingComment}
                className="self-end flex items-center gap-1.5 px-4 py-1.5 rounded border border-accent/25 bg-accent/10 font-mono text-[9px] uppercase tracking-wider font-bold text-accent hover:bg-accent hover:text-black transition"
              >
                <CornerDownRight size={10} /> Submit Reply
              </button>
            </form>
          </div>
        )}

        {/* Nested replies with left border visual trees */}
        {replies.length > 0 && (
          <div className="ml-4 pl-4 border-l border-white/5 flex flex-col gap-2 relative">
            <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-white/10 to-transparent" />
            {replies.map((reply) => (
              <CommentNode key={reply.id} comment={reply} allComments={allComments} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="forum-shell mx-auto flex w-full flex-col gap-8 md:gap-10"
      style={{ maxWidth: "80rem", marginInline: "auto" }}
    >
      
      {/* ── HEADER SECTION ─────────────────────────────────────────────────── */}
      <header className="flex flex-col justify-between gap-6 border-b border-white/[0.06] pb-6 lg:flex-row lg:items-end">
        <div className="flex max-w-4xl flex-col gap-2 md:gap-3">
          <div className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-widest text-accent">
            <span className="h-[1px] w-8 bg-accent" />
            Community Discussion
          </div>
          <h1 className="font-display text-5xl font-black leading-none tracking-tighter md:text-7xl">
            Visitor <span className="text-accent-light italic">Forum</span>
          </h1>
          <p className="max-w-2xl font-sans text-sm leading-relaxed text-text-muted">
            Share ratings, suggest feature additions, request troubleshooting help, or start a general discussion. Connect and build alongside other visitors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-wider text-text-muted shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-light"></span>
            </span>
            Active Discussions
          </span>
          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setSelectedThreadId(null);
              setReplyingToCommentId(null);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent bg-accent/10 font-display text-[10px] font-bold uppercase tracking-widest text-accent transition hover:bg-accent hover:text-black"
          >
            {showCreateForm ? <X size={13} /> : <PlusCircle size={13} />}
            {showCreateForm ? "Close Panel" : "New Thread"}
          </button>
        </div>
      </header>

      {loading && (
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 font-sans text-sm text-white/80 animate-pulse">
          Retrieving forum records and synchronizing databases...
        </div>
      )}

      {/* ── SECTION 00: COMMUNITY STATUS (SUMMARY) ─────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/[0.05] bg-surface/40 p-4 backdrop-blur-md shadow-sm">
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle block">Topics Thread</span>
          <span className="font-display text-3xl font-black text-accent-light block mt-1">{totalThreads}</span>
          <span className="font-sans text-[10px] text-text-muted block mt-0.5">Community discussions</span>
        </div>
        <div className="rounded-xl border border-white/[0.05] bg-surface/40 p-4 backdrop-blur-md shadow-sm">
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle block flex items-center gap-1">
            <Star size={9} className="text-yellow-500 fill-yellow-500" />
            Visitor Rating
          </span>
          <span className="font-display text-3xl font-black text-accent-light block mt-1">{avgRating} <span className="text-sm font-sans text-text-muted font-normal">/ 5</span></span>
          <span className="font-sans text-[10px] text-text-muted block mt-0.5">Project reviews average</span>
        </div>
        <div className="rounded-xl border border-white/[0.05] bg-surface/40 p-4 backdrop-blur-md shadow-sm">
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle block">Total Replies</span>
          <span className="font-display text-3xl font-black text-accent-light block mt-1">{totalComments}</span>
          <span className="font-sans text-[10px] text-text-muted block mt-0.5">Interaction comments</span>
        </div>
        <div className="rounded-xl border border-white/[0.05] bg-surface/40 p-4 backdrop-blur-md shadow-sm">
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle block">Tickets Open</span>
          <span className="font-display text-3xl font-black text-accent-light block mt-1">{bugCount}</span>
          <span className="font-sans text-[10px] text-text-muted block mt-0.5">Reported bug profiles</span>
        </div>
      </section>

      {/* ── SECTION 01: DISCUSSIONS ENGINE ─────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-text-subtle">
          <span className="text-accent font-bold">01 /</span>
          <span>Discussions Engine</span>
          <div className="h-[1px] flex-1 bg-white/[0.06]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-6 items-start">
          
          {/* LEFT PANEL: Filters & Thread List */}
          <div className={`flex flex-col gap-4 ${selectedThreadId && !showCreateForm ? "hidden lg:flex" : "flex"}`}>
            
            {/* Filter & Sort Card */}
            <div className="rounded-xl border border-white/[0.06] bg-surface/40 p-4 backdrop-blur-md shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle flex items-center gap-1.5 font-bold">
                  <Filter size={10} className="text-accent" /> Categories
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded border border-white/10 bg-bg px-2.5 py-1 font-sans text-[10px] text-text-muted focus:outline-none"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="comments">Sort: Replies</option>
                  <option value="rating">Sort: Rating</option>
                </select>
              </div>

              {/* Category pills list */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[9px] transition active:scale-95 ${
                      categoryFilter === cat.id
                        ? "border-accent bg-accent/15 text-white shadow"
                        : "border-white/5 bg-transparent text-text-subtle hover:border-white/15 hover:text-white"
                    }`}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Threads List */}
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {processedThreads.length > 0 ? (
                processedThreads.map((thread) => {
                  const isSelected = thread.id === selectedThreadId;
                  return (
                    <button
                      key={thread.id}
                      onClick={() => {
                        setSelectedThreadId(thread.id);
                        setShowCreateForm(false);
                        setReplyingToCommentId(null);
                      }}
                      className={`w-full text-left rounded-xl border p-4 transition-all duration-300 hover:translate-x-1 active:scale-98 ${
                        isSelected
                          ? "border-accent/40 bg-white/5 shadow-md"
                          : "border-white/[0.05] bg-surface/40 hover:border-white/15 hover:bg-surface/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-1.5 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            {getCategoryBadge(thread.category)}
                            {thread.rating && (
                              <span className="flex items-center gap-0.5 text-yellow-500 font-mono text-[9px] font-bold">
                                <Star size={9} fill="#eab308" className="stroke-none" /> {thread.rating}
                              </span>
                            )}
                          </div>
                          <span className="font-display text-sm font-bold text-accent-light group-hover:text-accent transition truncate">
                            {thread.title}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-text-subtle shrink-0 mt-0.5">
                          {formatDate(thread.createdAt).split(",")[0]}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-text-muted line-clamp-2 leading-relaxed">
                        {thread.content}
                      </p>
                      <div className="mt-3.5 flex items-center justify-between border-t border-white/5 pt-2.5 text-[9px] text-text-subtle font-mono">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="text-sm leading-none">{thread.avatar}</span>
                          {thread.author}
                        </span>
                        <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          <MessageSquare size={10} /> {thread.comments.length}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-xl border border-white/5 bg-surface/20 p-8 text-center text-text-subtle font-sans text-xs">
                  No discussions found in this category.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Workspace Details / Create Form */}
          <div className={`flex flex-col gap-4 ${!selectedThreadId && !showCreateForm ? "hidden lg:flex" : "flex"}`}>
            
            {/* Create Thread Form Mode */}
            {showCreateForm && (
              <div className="rounded-2xl border border-accent/20 bg-accent/[0.02] p-5 sm:p-6 shadow-lg flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <h2 className="font-display text-lg font-bold tracking-tight text-white">
                      Start a New Topic
                    </h2>
                    <p className="font-sans text-xs text-text-muted mt-0.5">Open a community ticket or share feedback.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowCreateForm(false);
                      if (threads.length > 0) setSelectedThreadId(threads[0].id);
                    }} 
                    className="text-text-subtle hover:text-white p-1"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleCreateThread} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="rounded border border-white/10 bg-bg px-3 py-2.5 font-sans text-xs text-white focus:outline-none"
                      >
                        <option value="Review">Project Review (Rating)</option>
                        <option value="QA">Q&A Help</option>
                        <option value="General">General Chat</option>
                        <option value="Bug">Bug Report</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Alex"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="rounded border border-white/10 bg-bg px-3 py-2.5 font-sans text-xs text-white focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">Avatar Emoji</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {avatars.slice(0, 7).map((av) => (
                          <button
                            key={av}
                            type="button"
                            onClick={() => setNewAvatar(av)}
                            className={`h-7 w-7 flex items-center justify-center rounded-full text-sm border transition active:scale-95 ${
                              newAvatar === av
                                ? "border-accent bg-accent/20 scale-105"
                                : "border-white/5 bg-white/5 hover:border-white/15"
                            }`}
                          >
                            {av}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {newCategory === "Review" && (
                    <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">Review Rating</span>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(null)}
                            className="p-1 -m-1 text-2xl transition hover:scale-110 focus:outline-none"
                          >
                            <Star
                              size={20}
                              fill={star <= (hoveredStar ?? newRating) ? "#eab308" : "none"}
                              stroke={star <= (hoveredStar ?? newRating) ? "#eab308" : "rgba(255,255,255,0.2)"}
                              strokeWidth={1.5}
                            />
                          </button>
                        ))}
                        <span className="font-mono text-xs text-yellow-500 ml-2 font-bold">({newRating} / 5)</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">Subject Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Headline summary of review/query..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="rounded border border-white/10 bg-bg px-3 py-2.5 font-sans text-xs text-white focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">Discussion Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe detail here..."
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="rounded border border-white/10 bg-bg px-3 py-2.5 font-sans text-xs text-white focus:border-accent focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingThread}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-accent bg-accent font-display text-xs font-bold uppercase tracking-widest text-black transition hover:bg-white active:scale-95 w-full mt-2"
                  >
                    {submittingThread ? "Creating Thread..." : "Publish Topic"}
                  </button>
                </form>
              </div>
            )}

            {/* Selected Thread details workspace */}
            {selectedThread && !showCreateForm && (
              <div className="rounded-2xl border border-white/[0.06] bg-surface/40 backdrop-blur-md p-5 sm:p-6 shadow-lg flex flex-col gap-6">
                
                {/* Back button on mobile */}
                <button
                  onClick={() => {
                    setSelectedThreadId(null);
                    setReplyingToCommentId(null);
                  }}
                  className="lg:hidden flex items-center gap-1.5 font-mono text-[9px] font-bold text-text-subtle hover:text-white transition w-fit border border-white/10 bg-white/5 px-3 py-1.5 rounded"
                >
                  <ArrowLeft size={10} /> Back to Threads
                </button>

                {/* Thread Header Info */}
                <div className="flex flex-col gap-4 border-b border-white/5 pb-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{selectedThread.avatar}</span>
                      <div className="flex flex-col">
                        <span className="font-display text-xs font-black text-accent-light">
                          {selectedThread.author}
                        </span>
                        <span className="font-mono text-[9px] text-text-subtle">
                          {formatDate(selectedThread.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(selectedThread.category)}
                      {selectedThread.rating && (
                        <div className="flex items-center gap-1 rounded bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 text-yellow-500 font-mono text-[9px] font-bold">
                          <Star size={9} fill="#eab308" className="stroke-none" /> {selectedThread.rating} / 5
                        </div>
                      )}
                    </div>
                  </div>

                  <h2 className="font-display text-xl sm:text-2xl font-black text-white leading-tight mt-1">
                    {selectedThread.title}
                  </h2>

                  <p className="font-sans text-xs sm:text-sm leading-relaxed text-text-muted whitespace-pre-wrap">
                    {selectedThread.content}
                  </p>
                </div>

                {/* Reply section list */}
                <div>
                  <h3 className="font-display text-[10px] font-black text-accent-light uppercase tracking-widest border-l-2 border-accent pl-2.5 mb-4">
                    Replies ({selectedThread.comments.length})
                  </h3>

                  <div className="flex flex-col gap-3.5">
                    {selectedThread.comments.length > 0 ? (
                      selectedThread.comments
                        .filter((c) => c.parentId === null)
                        .map((comment) => (
                          <CommentNode
                            key={comment.id}
                            comment={comment}
                            allComments={selectedThread.comments}
                            depth={0}
                          />
                        ))
                    ) : (
                      <p className="font-sans text-xs text-text-subtle text-center py-6">
                        No comments yet. Share your inputs below!
                      </p>
                    )}
                  </div>
                </div>

                {/* Add primary Comment box */}
                {replyingToCommentId === null && (
                  <div className="border-t border-white/5 pt-5 mt-3">
                    <h3 className="font-display text-xs font-bold text-white mb-3.5">
                      Join the discussion
                    </h3>
                    <form onSubmit={(e) => handleAddComment(e, null)} className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">Your Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Robin"
                            value={commentAuthor}
                            onChange={(e) => setCommentAuthor(e.target.value)}
                            className="rounded border border-white/10 bg-bg px-3 py-2.5 font-sans text-xs text-white focus:border-accent focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">Select Avatar</span>
                          <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {avatars.slice(0, 6).map((av) => (
                              <button
                                key={av}
                                type="button"
                                onClick={() => setCommentAvatar(av)}
                                className={`h-7 w-7 flex items-center justify-center rounded-full text-xs border transition active:scale-95 ${
                                  commentAvatar === av
                                    ? "border-accent bg-accent/20 scale-105"
                                    : "border-white/5 bg-white/5"
                                }`}
                              >
                                {av}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">Comment Content</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Type comment message here..."
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          className="rounded border border-white/10 bg-bg px-3 py-2.5 font-sans text-xs text-white focus:border-accent focus:outline-none resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submittingComment}
                        className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full border border-accent bg-accent/10 font-mono text-[9px] uppercase tracking-wider font-bold text-accent hover:bg-accent hover:text-black transition self-start active:scale-95"
                      >
                        <Send size={10} /> Submit Comment
                      </button>
                    </form>
                  </div>
                )}

              </div>
            )}

            {/* Empty State */}
            {!selectedThread && !showCreateForm && (
              <div className="rounded-2xl border border-white/[0.06] bg-surface/40 p-12 text-center text-text-subtle font-sans text-xs flex flex-col items-center gap-3">
                <MessageSquare size={24} className="text-accent opacity-50" />
                Select a thread from the list or click "New Thread" to start a discussion.
              </div>
            )}

          </div>

        </div>
      </section>

    </div>
  );
}
