"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import NewsCard from "./NewsCard";

export default function NewsWithPagination({ initialNews }: { initialNews: NewsItem[] }) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [parsedTags, setParsedTags] = useState<string[]>([]);

  useEffect(() => {
    const tags = localStorage.getItem("selectedTags");
    const parsedTags = tags ? JSON.parse(tags) : [];
    setParsedTags(parsedTags);
    fetchNews(page, parsedTags);
  }, [page]);


  const fetchNews = async (pageNum: number, tags: string[]) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news`, {
        method: "POST",
        body: JSON.stringify({
          source: tags,
          page: pageNum,
          limit: 20,
        }),
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const data: NewsResponse = await res.json();
      setNews(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (news.length === 0 && !loading) {
    return <div>No news available</div>;
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        {news.map((item) => (
          <NewsCard key={item.link} item={item} />
        ))}
      </div>

      {/* Pagination buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => {
            setPage((p) => p - 1)
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Prev
        </button>

        <span className="px-4 py-2">Page {page}</span>

        <button
          onClick={() => {
            setPage((p) => p + 1)
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
}
