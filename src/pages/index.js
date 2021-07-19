import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";
import styles from "./styles.module.css";

const features = [
  {
    title: <>完备的 TypeScript 支持</>,
    description: <>支持完备的 TypeScript 类型推导和提示，拒绝 "AnyScript"。</>,
  },
  {
    title: <>应用模块化</>,
    description: <>一个完整的应用由多个 Model 共同协作组成，避免复杂和臃肿。</>,
  },
  {
    title: <>多容器支持</>,
    description: <>支持对同一个 Model 动态注册多个独立的 Container。</>,
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title="Nyax - 一个 Redux 框架" description="一个 Redux 框架">
      <div className="admonition admonition-warning alert alert--warning">
        这是 Nyax 0.5.x 版本的文档。<a href="https://nyax.js.org">点击这里</a>
        浏览最新版本的文档。
      </div>
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--outline button--secondary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/introduction/getting-started")}
            >
              快速开始
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
