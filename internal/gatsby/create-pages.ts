import { GatsbyNode } from "gatsby";

import * as constants from "./constants";
import * as queries from "./queries";
import * as utils from "./utils";

type CreateWithPagination = (parameters: {
  limit: number;
  group?: string;
  template: string;
  total: number;
  page: number;
  path: string;
}) => void;

const getPaginationPath = (basePath: string, page: number): string =>
  [basePath === "/" ? "" : basePath, "page", page].join("/");

const createPages: GatsbyNode["createPages"] = async ({ graphql, actions }) => {
  const { createPage } = actions;

  createPage({
    path: constants.routes.notFoundRoute,
    component: constants.templates.notFoundTemplate,
    context: {},
  });

  createPage({
    path: constants.routes.tagsListRoute,
    component: constants.templates.tagsTemplate,
    context: {},
  });

  createPage({
    path: constants.routes.categoriesListRoute,
    component: constants.templates.categoriesTemplate,
    context: {},
  });

  const pages = await queries.pagesQuery(graphql);

  pages.forEach((edge) => {
    const { node } = edge;

    if (node?.frontmatter?.template === "page" && node?.fields?.slug) {
      createPage({
        path: node?.frontmatter?.slug || node.fields.slug,
        component: constants.templates.pageTemplate,
        context: { slug: node.fields.slug },
      });
    } else if (node?.frontmatter?.template === "post" && node?.fields?.slug) {
      createPage({
        path: node?.frontmatter?.slug || node.fields.slug,
        component: constants.templates.postTemplate,
        context: { slug: node.fields.slug },
      });
    }
  });

  const createWithPagination: CreateWithPagination = ({
    group,
    template,
    page,
    path,
    total,
    limit,
  }) => {
    createPage({
      component: template,
      path: page === 0 ? path : getPaginationPath(path, page),
      context: {
        group,
        limit,
        offset: page * limit,
        pagination: {
          currentPage: page,
          prevPagePath:
            page <= 1 ? path : getPaginationPath(path, utils.decrement(page)),
          nextPagePath: getPaginationPath(path, utils.increment(page)),
          hasNextPage: page !== utils.decrement(total),
          hasPrevPage: page !== 0,
        },
      },
    });
  };

  const categories = await queries.categoriesQuery(graphql);
  const metadata = await queries.metadataQuery(graphql);
  const postsLimit = metadata?.postsLimit ?? 1;

  categories.forEach((category) => {
    const total = Math.ceil(category.totalCount / postsLimit);
    const path = utils.concat(
      constants.routes.categoryRoute,
      "/",
      utils.toKebabCase(category.fieldValue),
    );

    for (let page = 0; page < total; page += 1) {
      createWithPagination({
        limit: postsLimit,
        group: category.fieldValue,
        template: constants.templates.categoryTemplate,
        total,
        page,
        path,
      });
    }
  });

  const tags = await queries.tagsQuery(graphql);

  tags.forEach((tag) => {
    const path = utils.concat(
      constants.routes.tagRoute,
      "/",
      utils.toKebabCase(tag.fieldValue),
    );

    const total = Math.ceil(tag.totalCount / postsLimit);

    for (let page = 0; page < total; page += 1) {
      createWithPagination({
        limit: postsLimit,
        group: tag.fieldValue,
        template: constants.templates.tagTemplate,
        total,
        page,
        path,
      });
    }
  });

  const path = constants.routes.indexRoute;
  const template = constants.templates.indexTemplate;
  const posts = await queries.postsQuery(graphql);
  const total = Math.ceil((posts?.edges?.length ?? 0) / postsLimit);

  for (let page = 0; page < total; page += 1) {
    createWithPagination({
      limit: postsLimit,
      template,
      total,
      page,
      path,
    });
  }
};

export { createPages };
