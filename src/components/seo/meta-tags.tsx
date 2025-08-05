"use client";

import Head from "next/head";

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  structuredData?: object;
}

export function MetaTags({
  title = "PrintVerse - Custom Design & Print Solutions",
  description = "Create custom designs for t-shirts, mugs, and more with our advanced design tools. High-quality printing and fast delivery.",
  keywords = "custom design, t-shirt printing, mug printing, personalized gifts, design tools",
  image = "/og-image.jpg",
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  structuredData,
}: MetaTagsProps) {
  const fullTitle = title.includes("PrintVerse")
    ? title
    : `${title} | PrintVerse`;
  const fullUrl = url
    ? `${process.env.NEXT_PUBLIC_SITE_URL}${url}`
    : process.env.NEXT_PUBLIC_SITE_URL;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author || "PrintVerse"} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="PrintVerse" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@printverse" />

      {/* Article Specific Meta Tags */}
      {type === "article" && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Product Specific Meta Tags */}
      {type === "product" && (
        <>
          <meta property="product:price:amount" content="" />
          <meta property="product:price:currency" content="USD" />
          <meta property="product:availability" content="in stock" />
        </>
      )}

      {/* Canonical URL */}
      {url && <link rel="canonical" href={fullUrl} />}

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      {/* Default Structured Data for Organization */}
      {!structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PrintVerse",
              url: process.env.NEXT_PUBLIC_SITE_URL,
              logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
              description: "Custom design and print solutions",
              sameAs: [
                "https://facebook.com/printverse",
                "https://twitter.com/printverse",
                "https://instagram.com/printverse",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-555-123-4567",
                contactType: "customer service",
                email: "support@printverse.com",
              },
            }),
          }}
        />
      )}
    </Head>
  );
}
