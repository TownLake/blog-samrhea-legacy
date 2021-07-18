// @flow strict
import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/Products';
import { useSiteMetadata } from '../hooks';
import type { MarkdownRemark } from '../types';

type Props = {
  data: {
    markdownRemark: MarkdownRemark
  }
};

const ProductTemplate = ({ data }: Props) => {
  const { title: siteTitle, subtitle: siteSubtitle } = useSiteMetadata();
  const { html: pageBody } = data.markdownRemark;
  const { frontmatter } = data.markdownRemark;
  const { title: pageTitle, description: pageDescription = '', socialImage } = frontmatter;
  const metaDescription = pageDescription || siteSubtitle;
  const socialImageUrl = socialImage?.publicURL;

  return (
    <Layout title={`${pageTitle} - ${siteTitle}`} description={metaDescription} socialImage={socialImageUrl} >
      <Sidebar />
      <ProductGrid title={pageTitle}>
        <div dangerouslySetInnerHTML={{ __html: pageBody }} />
      </ProductGrid>
    </Layout>
  );
};

export default ProductTemplate;