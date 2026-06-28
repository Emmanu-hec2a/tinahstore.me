import { Helmet } from 'react-helmet-async';

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  schemaData
}) {
  const siteName = 'TinahStore';
  const defaultDescription = 'Hand-finished leather and canvas pieces, designed in Nairobi for everyday movement. Shop high-quality totes, backpacks, and crossbody bags.';
  const defaultKeywords = 'leather bags Nairobi, canvas bags, handmade bags Kenya, TinahStore, luxury totes, artisan bags';
  const defaultImage = 'https://tinahstore.store/og-image.png'; // Make sure to provide a default OG image
  const siteUrl = 'https://tinahstore.store';

  const fullTitle = title ? `${title} | ${siteName}` : `TinahStore | Bags that carry more than your things`;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image || defaultImage;
  const metaUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={metaUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Structured Data */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
    </Helmet>
  );
}
