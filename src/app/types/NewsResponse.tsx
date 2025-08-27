type NewsResponse = {
  data?: NewsItem[];
}

type NewsItem = {
  title: string;
  source: string;
  publishedAt: string;
  image: string;
  link: string;
}