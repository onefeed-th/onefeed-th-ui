// components/TagSelector.tsx (Client Component)
"use client";

import { useState, useEffect } from "react";

type TagResponse = {
  data: string[];
};

export default function TagSelector() {
  const [selected, setSelected] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("selectedTags");
    if (saved) setSelected(JSON.parse(saved));
  }, []);

  useEffect(() => {
    // Fetch tags from the API or define them here
    const fetchTags = async () => {
      const response = await fetch("https://onefeed-th-api.artzakub.com/api/v1/tags");
      const data: TagResponse = await response.json();
      setTags(data.data);
    };
    fetchTags();
  }, []);

  const handleClick = (tag: string) => {
    let updated: string[];
    if (selected.includes(tag)) {
      updated = selected.filter((t) => t !== tag);
    } else {
      updated = [...selected, tag];
    }
    setSelected(updated);
    localStorage.setItem("selectedTags", JSON.stringify(updated));
  };

  return (
    <div className="w-full lg:justify-between flex flex-wrap gap-2">
      {tags.map((tag) => (
        <div
          key={tag}
          onClick={() => handleClick(tag)}
          className={`p-2 border rounded cursor-pointer ${selected.includes(tag)
            ? "bg-blue-500 text-white border-blue-600"
            : "border-gray-300 hover:bg-gray-200"
            }`}
        >
          {tag}
        </div>
      ))}
    </div>
  );
}
