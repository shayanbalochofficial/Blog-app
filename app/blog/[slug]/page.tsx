import Image from "next/image";
import { urlForImage } from "../../../sanity/lib/image";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { client } from "../../../sanity/lib/client";

export const revalidate = 60; // Revalidate every 60 seconds

// Static parameter generation for dynamic routes
export async function generateStaticParams() {
  const query = `*[_type == 'post']{ "slug": slug.current }`;
  const slugs: { slug: string }[] = await client.fetch(query);

  if (!slugs || slugs.length === 0) {
    console.warn("No slugs found for static generation!");
    return [];
  }

  return slugs.map((item) => ({ slug: item.slug }));
}

export const dynamicParams = true; // Allow runtime resolution of params

// TypeScript interface for props
interface PageProps {
  params: {
    slug?: string;
  };
}

// Page Component
export default async function Page({ params }: PageProps) {
  if (!params || !params.slug) {
    console.warn("Missing or invalid params passed to the page component.");
    return (
      <article className="mt-12 mb-24 px-4 sm:px-8 lg:px-16 xl:px-32 flex flex-col gap-y-12">
        <Link href="/">
          <h1 className="underline">Return Home</h1>
        </Link>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark dark:text-light tracking-tight leading-tight">
          Invalid Page Parameters
        </h1>
      </article>
    );
  }

  const query = `*[_type == 'post' && slug.current == $slug]{
    title, summary, image, content,
    author->{bio, image, name}
  }[0]`;

  const post = await client.fetch(query, { slug: params.slug });

  if (!post) {
    console.warn(`No post found for slug: ${params.slug}`);
    return (
      <article className="mt-12 mb-24 px-4 sm:px-8 lg:px-16 xl:px-32 flex flex-col gap-y-12">
        <Link href="/">
          <h1 className="underline">Return Home</h1>
        </Link>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark dark:text-light tracking-tight leading-tight">
          Post Not Found
        </h1>
      </article>
    );
  }

  return (
    <article className="mt-12 mb-24 px-4 sm:px-8 lg:px-16 xl:px-32 flex flex-col gap-y-12">
      <Link href="/">
        <h1 className="underline">Return Home</h1>
      </Link>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark dark:text-light tracking-tight leading-tight">
        {post.title}
      </h1>

      {post.image && (
        <div className="w-full relative overflow-hidden rounded-lg shadow-lg">
          <Image
            src={urlForImage(post.image)}
            width={1200}
            height={800}
            alt={post.title}
            className="object-cover w-full h-[400px] sm:h-[500px] md:h-[600px]"
          />
        </div>
      )}

      <section className="prose lg:prose-xl text-dark/80 dark:text-light/80 font-medium">
        <PortableText value={post.content || []} />
      </section>

      {post.summary && (
        <section>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-accentDarkPrimary uppercase mb-4">
            Summary
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed text-dark/80 dark:text-light/80 text-justify italic">
            {post.summary}
          </p>
        </section>
      )}

      {post.author && (
        <section className="flex items-start gap-6 sm:gap-8 md:gap-12 mb-12">
          {post.author.image && (
            <div className="relative">
              <Image
                src={urlForImage(post.author.image)}
                width={96}
                height={96}
                alt={post.author.name}
                className="object-cover rounded-full border-4 border-white shadow-md"
              />
            </div>
          )}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-dark dark:text-light">
              {post.author.name}
            </h3>
            <p className="italic text-lg sm:text-xl text-dark/80 dark:text-light/80">
              {post.author.bio}
            </p>
          </div>
        </section>
      )}
    </article>
  );
}
