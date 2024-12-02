import Link from "next/link";

interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  summary: string;
  image?: {
    asset: {
      url: string;
    };
  };
  content: Array<{
    _type: string;
    [key: string]: string;
  }>;
  author: {
    _type: string;
    _ref: string;
  };
}

export default function BlogCard({ post }: { post: Post }) {
  return (
    <section
      key={post._id}
      className="group relative flex flex-col justify-between h-[500px] max-w-sm mx-auto rounded-lg bg-light/90 dark:bg-dark/40 shadow-xl hover:scale-105 transition-transform ease-out duration-700 transform"
    >
      {/* Featured Image */}
      {post.image?.asset?.url && (
        <div
          className="w-full h-48 bg-cover bg-center rounded-t-lg"
          style={{ backgroundImage: `url(${post.image.asset.url})` }}
        />
      )}

      {/* Content Section */}
      <div className="flex flex-col justify-between p-6 bg-light dark:bg-dark/60 rounded-b-lg">
        {/* Title */}
        <h2 className="text-2xl font-bold text-dark dark:text-light mb-2 hover:text-accentDarkPrimary transition-colors duration-300">
          {post.title}
        </h2>

        {/* Summary */}
        <p className="text-dark/70 dark:text-light/70 text-base leading-relaxed line-clamp-4 mb-4">
          {post.summary}
        </p>

        {/* Read More Button */}
        <Link
          href={`/blog/${post.slug}`}
          className="w-full px-6 py-2 text-center bg-accentDarkSecondary text-black border border-black hover:bg-black hover:text-white font-semibold rounded-md hover:bg-accentDarkPrimary transition-colors duration-300"
        >
          Read More
        </Link>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-25 transition-opacity duration-300 rounded-lg pointer-events-none" />
    </section>
  );
}
