/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://azdevs.ca',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/api/' },
    ],
  },
};
