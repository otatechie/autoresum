import { Helmet } from 'react-helmet-async';

export function SEO({
    title,
    description,
    keywords = [],
    type = 'website',
    image = '/images/og-image.jpg',
    noindex = false
}) {
    const siteTitle = 'AutoResum';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            {description && <meta name="description" content={description} />}
            {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={fullTitle} />
            {description && <meta property="twitter:description" content={description} />}
            <meta property="twitter:image" content={image} />

            {/* Robots */}
            {noindex && <meta name="robots" content="noindex,nofollow" />}
        </Helmet>
    );
} 