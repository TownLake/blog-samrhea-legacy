import { CreatePagesArgs } from "gatsby";

interface MetadataQueryResult {
  site: {
    siteMetadata: {
      postsLimit?: number;
    };
  };
}

const metadataQuery = async (graphql: CreatePagesArgs["graphql"]) => {
  const result = await graphql<MetadataQueryResult>(`
    query SiteMetaData {
      site {
        siteMetadata {
          postsLimit
        }
      }
    }
  `);

  return result?.data?.site.siteMetadata ?? {};
};

export default metadataQuery;
