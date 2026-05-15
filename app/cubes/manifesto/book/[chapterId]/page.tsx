import { notFound } from "next/navigation";
import { BookReader } from "@/components/manifesto/BookReader";
import { bookChapters, getChapter } from "@/data/manifesto/book";

type Params = { params: { chapterId: string } };

export function generateStaticParams() {
  return bookChapters.map((c) => ({ chapterId: c.id }));
}

export function generateMetadata({ params }: Params) {
  const chapter = getChapter(params.chapterId);
  if (!chapter) return { title: "five manifesto — book" };
  return {
    title: `${chapter.title} — five book`,
    description: chapter.subtitle,
  };
}

export default function ChapterPage({ params }: Params) {
  const chapter = getChapter(params.chapterId);
  if (!chapter) notFound();
  const idx = bookChapters.findIndex((c) => c.id === chapter.id);
  const prev = idx > 0 ? bookChapters[idx - 1] : undefined;
  const next = idx < bookChapters.length - 1 ? bookChapters[idx + 1] : undefined;
  return <BookReader chapter={chapter} prev={prev} next={next} />;
}
