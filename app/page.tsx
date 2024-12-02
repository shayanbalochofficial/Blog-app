import BlogCard from "../components/BlogCard";
import { client } from "../sanity/lib/client";

// import Link from "next/link";

export const revalidate = 60; //seconds

export default async function Home() {
  interface Post {
    _id: string; // Unique identifier for the document
    title: string; // Post title
    slug: {
      current: string; // The slug value
    };
    summary: string; // Summary of the post
    image?: {
      asset: {
        url: string; // Image URL
      };
    }; // Image is optional
    content: Array<{
      _type: string; // Content block type
      [key: string]: string; // Any other key-value pairs
    }>; // Array of content blocks
    author: {
      _type: string; // Reference type
      _ref: string; // Author reference ID
    }; // Reference to an author
  }

  const query = `*[_type=='post'] | order(_createdAt asc){
    summary,title,image,
    "slug":slug.current
  }`;

  const posts: Post[] = await client.fetch(query);

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#f0f4f8] to-[#e1e8f0] text-dark dark:bg-[#101010] dark:text-light">
      <h1 className="text-3xl font-extrabold uppercase my-12 text-center text-dark dark:text-light sm:text-4xl lg:text-5xl">
        Most Recent Blogs
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4 sm:px-8">
        {posts.map((post: Post) => {
          // Ensure that the key is unique and valid
          const key = post.slug.current && post._id ? `${post.slug.current}-${post._id}` : post._id || post.title;

          return <BlogCard post={post} key={key} />;
        })}
      </section>
    </main>
  );
}
