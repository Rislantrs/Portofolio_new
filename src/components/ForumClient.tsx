"use client";

import Link from "next/link";
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
  { id: "All", label: "All Topics", icon: <MessageSquare size={14} /> },
  { id: "Review", label: "Project Reviews", icon: <Star size={14} /> },
  { id: "QA", label: "Q&A Help", icon: <HelpCircle size={14} /> },
  { id: "General", label: "General Chat", icon: <MessageCircle size={14} /> },
  { id: "Bug", label: "Bug Reports", icon: <AlertTriangle size={14} /> },
];

const avatars = ["👨‍💻", "🚀", "💡", "🎨", "😸", "🌟", "🤔", "⚡", "👾", "🔥"];

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
          const data = await response.json();
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
        const createdThread = await response.json();
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
        const updatedThread = await response.json();
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

  // Recursive Comment Node Component with mobile-friendly indentation
  const CommentNode = ({ comment, allComments, depth = 0 }: { comment: Comment; allComments: Comment[]; depth: number }) => {
    const replies = allComments.filter((c) => c.parentId === comment.id);
    const isReplying = replyingToCommentId === comment.id;

    return (
      <div className="flex flex-col gap-2 mt-3">
        <div className="rounded-lg border border-white/5 bg-bg-elevated p-3 sm:p-4 transition hover:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg">{comment.avatar}</span>
              <span className="font-display text-[11px] sm:text-xs font-bold text-accent-light">{comment.author}</span>
            </div>
            <span className="font-mono text-[9px] text-text-subtle">
              {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-text-muted whitespace-pre-wrap">{comment.content}</p>
          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5">
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
                {isReplying ? "Cancel Reply" : "Reply"}
              </button>
            )}
          </div>
        </div>

        {/* Reply Box nested */}
        {isReplying && (
          <div className="ml-2 sm:ml-4 border-l border-accent/20 pl-2 sm:pl-4">
            <form onSubmit={(e) => handleAddComment(e, comment.id)} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="rounded border border-white/10 bg-bg px-3 py-2 font-sans text-xs text-white focus:border-accent focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-text-subtle uppercase shrink-0">Avatar:</span>
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
                placeholder={`Reply to ${comment.author}...`}
                required
                rows={2}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="rounded border border-white/10 bg-bg px-3 py-2 font-sans text-xs text-white focus:border-accent focus:outline-none resize-none"
              />
              <button
                type="submit"
                disabled={submittingComment}
                className="self-end flex items-center gap-1.5 px-4 py-2 rounded border border-accent/25 bg-accent/10 font-mono text-[9px] uppercase tracking-wider font-bold text-accent hover:bg-accent hover:text-black transition"
              >
                <CornerDownRight size={10} /> Submit Reply
              </button>
            </form>
          </div>
        )}

        {/* Nested replies */}
        {replies.length > 0 && (
          <div className="ml-2 sm:ml-4 border-l border-white/5 pl-2 sm:pl-4 flex flex-col gap-1.5">
            {replies.map((reply) => (
              <CommentNode key={reply.id} comment={reply} allComments={allComments} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-bg px-4 sm:px-6 md:px-12 py-6 sm:py-8 text-text selection:bg-accent selection:text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:gap-8">
        {/* Header section */}
        <header className="flex flex-col justify-between gap-6 border-b border-white/5 pb-6 sm:pb-8 lg:flex-row lg:items-end">
          <div className="flex max-w-4xl flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-3 font-display text-xs font-bold uppercase tracking-widest text-accent">
              <span className="h-[1px] w-8 bg-accent" />
              Community Discussion
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black leading-none tracking-tighter md:text-7xl">
              Visitor <span className="text-accent-light italic">Forum</span>
            </h1>
            <p className="max-w-2xl font-sans text-xs sm:text-sm leading-relaxed text-text-muted">
              Leave project ratings, reviews, suggestions, ask questions, or just say hello. Feel free to interact with other visitors as well.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <Link
              href="/"
              className="px-4 py-2.5 rounded border border-white/10 bg-white/5 font-display text-xs font-semibold uppercase tracking-wider transition hover:bg-white/15 active:scale-95"
            >
              Back Portfolio
            </Link>
            <button
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                setSelectedThreadId(null);
                setReplyingToCommentId(null);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded border border-accent bg-accent/10 font-display text-xs font-semibold uppercase tracking-wider text-accent transition hover:bg-accent hover:text-black active:scale-95"
            >
              {showCreateForm ? <X size={14} /> : <PlusCircle size={14} />}
              {showCreateForm ? "Close Form" : "New Thread"}
            </button>
          </div>
        </header>

        {loading && (
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-sans text-xs text-white/80 animate-pulse">
            Loading discussions and ulasan...
          </div>
        )}

        {/* Create Thread Form */}
        {showCreateForm && (
          <section className="rounded-lg border border-accent/20 bg-accent/5 p-4 sm:p-6 max-w-3xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <h2 className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-white">
                Start a New Topic
              </h2>
              <button onClick={() => setShowCreateForm(false)} className="text-text-subtle hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateThread} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">
                    Category
                  </label>
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
                  <label className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="rounded border border-white/10 bg-bg px-3 py-2.5 font-sans text-xs text-white focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">
                    Choose Avatar Emojis
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {avatars.map((av) => (
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
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">
                    Rating
                  </span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(null)}
                        className="p-1 -m-1 text-2xl transition hover:scale-115 focus:outline-none"
                        style={{ touchAction: "manipulation" }}
                      >
                        <Star
                          size={24}
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

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">
                  Subject Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Review or question headline"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="rounded border border-white/10 bg-bg px-3 py-2.5 font-sans text-xs text-white focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">
                  Message Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="rounded border border-white/10 bg-bg px-3 py-2.5 font-sans text-xs text-white focus:border-accent focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingThread}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded border border-accent bg-accent font-display text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-white active:scale-95"
              >
                {submittingThread ? "Posting..." : "Create Thread"}
              </button>
            </form>
          </section>
        )}

        {/* Dashboard Grid optimized for Android responsive layouts */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.6fr] items-start">
          {/* Left Panel (Filters & Thread list) */}
          <div
            className={`flex flex-col gap-4 lg:border-r lg:border-white/5 lg:pr-6 ${
              selectedThreadId && !showCreateForm ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Filter Card */}
            <div className="flex flex-col gap-3.5 bg-surface border border-white/5 rounded-lg p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle flex items-center gap-1.5">
                  <Filter size={10} /> Filter Categories
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded border border-white/10 bg-bg px-2.5 py-1 font-sans text-[10px] text-text-muted focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="comments">Most Replies</option>
                  <option value="rating">Highest Rating</option>
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
                        ? "border-accent bg-accent/10 text-white"
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
                      className={`w-full text-left rounded-lg border p-4 transition-all duration-300 active:scale-98 ${
                        isSelected
                          ? "border-accent/40 bg-white/5"
                          : "border-white/5 bg-surface hover:border-white/15 hover:bg-surface-elevated"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-1.5 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            {getCategoryBadge(thread.category)}
                            {thread.rating && (
                              <span className="flex items-center gap-0.5 text-yellow-500 font-mono text-[9px] font-bold">
                                <Star size={9} fill="#eab308" /> {thread.rating}
                              </span>
                            )}
                          </div>
                          <span className="font-display text-sm font-bold text-accent-light truncate">
                            {thread.title}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-text-subtle shrink-0">
                          {new Date(thread.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-text-muted truncate">
                        {thread.content}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5 text-[10px] text-text-subtle font-mono">
                        <span className="flex items-center gap-1.5">
                          <span className="text-sm">{thread.avatar}</span>
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
                <div className="rounded-lg border border-white/5 bg-surface p-6 text-center text-text-subtle font-sans text-xs">
                  No discussions found in this category.
                </div>
              )}
            </div>
          </div>

          {/* Right Panel (Thread details & Comments) */}
          <div
            className={`flex flex-col gap-4 ${
              !selectedThreadId && !showCreateForm ? "hidden lg:flex" : "flex"
            }`}
          >
            {selectedThread ? (
              <div className="rounded-lg border border-white/5 bg-surface p-4 sm:p-6 flex flex-col gap-5 sm:gap-6">
                {/* Mobile back button */}
                <button
                  onClick={() => {
                    setSelectedThreadId(null);
                    setReplyingToCommentId(null);
                  }}
                  className="lg:hidden flex items-center gap-1.5 font-mono text-[10px] font-bold text-text-subtle hover:text-white transition w-fit border border-white/10 bg-white/5 px-3 py-1.5 rounded"
                >
                  <ArrowLeft size={12} /> Back to Threads
                </button>

                {/* Topic Header */}
                <div className="flex flex-col gap-3 sm:gap-4 border-b border-white/5 pb-4 sm:pb-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl">{selectedThread.avatar}</span>
                      <div className="flex flex-col">
                        <span className="font-display text-xs font-black text-accent-light">
                          {selectedThread.author}
                        </span>
                        <span className="font-mono text-[9px] text-text-subtle">
                          {new Date(selectedThread.createdAt).toLocaleDateString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "numeric",
                            month: "long",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(selectedThread.category)}
                      {selectedThread.rating && (
                        <div className="flex items-center gap-1 rounded bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 text-yellow-500 font-mono text-[10px] font-bold">
                          <Star size={10} fill="#eab308" /> {selectedThread.rating} / 5
                        </div>
                      )}
                    </div>
                  </div>

                  <h2 className="font-display text-lg sm:text-xl md:text-2xl font-black text-white leading-tight">
                    {selectedThread.title}
                  </h2>

                  <p className="font-sans text-xs sm:text-sm leading-relaxed text-text-muted whitespace-pre-wrap">
                    {selectedThread.content}
                  </p>
                </div>

                {/* Comments / Replies */}
                <div>
                  <h3 className="font-display text-xs font-black text-accent-light uppercase tracking-widest border-l border-accent pl-2.5 mb-4">
                    Comments ({selectedThread.comments.length})
                  </h3>

                  <div className="flex flex-col gap-3 sm:gap-4">
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
                        No comments yet. Be the first to comment below!
                      </p>
                    )}
                  </div>
                </div>

                {/* Comment Editor */}
                {replyingToCommentId === null && (
                  <div className="border-t border-white/5 pt-5 mt-3 sm:mt-4">
                    <h3 className="font-display text-xs sm:text-sm font-extrabold text-white mb-4">
                      Add a Comment
                    </h3>
                    <form onSubmit={(e) => handleAddComment(e, null)} className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Robin"
                            value={commentAuthor}
                            onChange={(e) => setCommentAuthor(e.target.value)}
                            className="rounded border border-white/10 bg-bg px-3 py-2.5 font-sans text-xs text-white focus:border-accent focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">
                            Select Emojis
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {avatars.slice(0, 7).map((av) => (
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
                        <label className="font-mono text-[9px] uppercase tracking-widest text-text-subtle">
                          Comment Message
                        </label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Write your comment or ulasan..."
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          className="rounded border border-white/10 bg-bg px-3 py-2.5 font-sans text-xs text-white focus:border-accent focus:outline-none resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submittingComment}
                        className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded border border-accent bg-accent/10 font-mono text-[10px] uppercase tracking-wider font-bold text-accent hover:bg-accent hover:text-black transition self-start active:scale-95"
                      >
                        <Send size={10} /> Submit Comment
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-white/5 bg-surface p-12 text-center text-text-subtle font-sans text-sm">
                Select a thread from the list or click "New Thread" to start a discussion.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
