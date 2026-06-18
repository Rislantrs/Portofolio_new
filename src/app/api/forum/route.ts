import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "src/lib/forumData.json");

async function readDb() {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading forum DB:", err);
    return [];
  }
}

async function writeDb(data: unknown) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing forum DB:", err);
    return false;
  }
}

export async function GET() {
  const threads = await readDb();
  return NextResponse.json(threads);
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { action } = payload;
    const db = await readDb();

    if (action === "create_thread") {
      const { title, author, avatar, category, rating, content } = payload;

      if (!title || !author || !category || !content) {
        return NextResponse.json(
          { error: "Title, author, category, and content are required fields." },
          { status: 400 }
        );
      }

      const newThread = {
        id: `thread-${Date.now()}`,
        title: title.trim(),
        author: author.trim(),
        avatar: avatar || "💬",
        category,
        rating: category === "Review" ? Number(rating) || 5 : null,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        comments: [],
      };

      db.unshift(newThread);
      await writeDb(db);
      return NextResponse.json(newThread);
    }

    if (action === "add_comment") {
      const { threadId, author, avatar, content, parentId } = payload;

      if (!threadId || !author || !content) {
        return NextResponse.json(
          { error: "ThreadId, author, and content are required." },
          { status: 400 }
        );
      }

      const threadIndex = db.findIndex((t: { id: string }) => t.id === threadId);
      if (threadIndex === -1) {
        return NextResponse.json({ error: "Thread not found." }, { status: 404 });
      }

      const newComment = {
        id: `comment-${Date.now()}`,
        author: author.trim(),
        avatar: avatar || "💬",
        content: content.trim(),
        createdAt: new Date().toISOString(),
        parentId: parentId || null,
      };

      db[threadIndex].comments.push(newComment);
      await writeDb(db);
      return NextResponse.json(db[threadIndex]);
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err) {
    console.error("Error in forum API:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
