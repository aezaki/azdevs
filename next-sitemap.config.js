/**
 * @file next-sitemap.config.js
 * @description Configuration for next-sitemap. Runs as a postbuild script to
 *              generate sitemap.xml and robots.txt in the /public directory.
 *
 * @notes robots.txt disallows /api/ to prevent search engines from indexing
 *        or crawling the contact form endpoint.
 */

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://azdevs.ca',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      // Prevent crawlers from hitting the contact API endpoint
      { userAgent: '*', disallow: '/api/' },
    ],
  },
};
