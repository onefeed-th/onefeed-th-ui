// components/NewsCard.tsx
export interface NewsItem {
  id?: string;
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  image?: string;
}

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col">
      {/* รูปข่าว */}
      <div className="h-full flex justify-center items-center bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full object-cover"
          />
        ) : (
          <div className="text-gray-400">No Image</div>
        )}
      </div>

      {/* เนื้อหาข่าว */}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold line-clamp-2">{item.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{item.source}</p>
        <p className="text-xs text-gray-400">{item.publishedAt}</p>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm block mt-auto"
        >
          อ่านต่อ
        </a>
      </div>
    </div>
  );
}
