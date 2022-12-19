import { CreatePagesArgs } from "gatsby";

import * as types from "../types";

export interface PagesQueryResult {
  allMarkdownRemark: {
    edges?: Array<types.Edge>;
  };
}

const pagesQuery = async (graphql: CreatePagesArgs["graphql"]) => {
  const result = await graphql<PagesQueryResult>(`
    {
      allMarkdownRemark(filter: { frontmatter: { draft: { ne: true } } }) {
        edges {
          node {
            frontmatter {
              template
              slug
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  return result?.data?.allMarkdownRemark?.edges ?? [];
};

export default pagesQuery;
