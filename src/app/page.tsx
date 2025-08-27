import NewsWithPagination from "./components/NewsList";
import NewsList from "./components/NewsList";
import TagSelector from "./components/TagSelector";

export default async function Page() {
  // SSR ดึงข่าวทั้งหมดมาก่อน (SEO)
  const res = await fetch("https://onefeed-th-api.artzakub.com/api/v1/news", {
    method: "POST",
    body: JSON.stringify({
      source: ["MacThai", "DroidSans", "เกมถูกบอกด้วย"], // เอามาหมด
      page: 1,
      limit: 50,
    }),
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const news = await res.json();

  return (
    <div className="w-screen p-1 bg-white text-black">
      <TagSelector />
      <h1 className="text-xl font-bold my-10">ข่าวล่าสุด</h1>
      <NewsWithPagination initialNews={news.data} />
    </div>
  );
}
