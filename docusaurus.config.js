module.exports = {
  title: "Nyax",
  tagline: "一个 Redux 框架",
  url: "https://springnyan.github.io",
  baseUrl: "/nyax-docs-0.5.x/",
  favicon: "img/favicon.ico",
  organizationName: "SpringNyan", // Usually your GitHub org/user name.
  projectName: "nyax", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Nyax",
      logo: {
        alt: "Nyax Logo",
        src: "img/logo.svg",
      },
      links: [
        {
          label: "快速开始",
          to: "docs/introduction/getting-started",
          position: "right",
        },
        {
          label: "基本概念",
          to: "docs/concepts/basic-concepts",
          position: "right",
        },
        {
          label: "API",
          to: "docs/api/api-reference",
          position: "right",
        },
        {
          label: "GitHub",
          href: "https://github.com/SpringNyan/nyax",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "文档",
          items: [
            {
              label: "快速开始",
              to: "docs/introduction/getting-started",
            },
            {
              label: "基本概念",
              to: "docs/concepts/basic-concepts",
            },
            {
              label: "API 参考",
              to: "docs/api/api-reference",
            },
          ],
        },
        {
          title: "其它",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/SpringNyan/nyax",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SpringNyan. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: "docs",
          routeBasePath: "docs",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
