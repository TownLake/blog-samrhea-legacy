import React from "react";

import classNames from "classnames";
import { Link } from "gatsby";

import { PAGINATION } from "@/constants";

import * as styles from "./Pagination.module.scss";

type Props = {
  prevPagePath: string;
  nextPagePath: string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

const Pagination = ({
  prevPagePath,
  nextPagePath,
  hasNextPage,
  hasPrevPage,
}: Props) => {
  const prevClassName = classNames(styles.previousLink, {
    [styles.disable]: !hasPrevPage,
  });

  const nextClassName = classNames(styles.nextLink, {
    [styles.disable]: !hasNextPage,
  });

  return (
    <div className={styles.pagination}>
      <div className={styles.previous}>
        <Link
          rel="prev"
          to={hasPrevPage ? prevPagePath : "/"}
          className={prevClassName}
        >
          {PAGINATION.PREV_PAGE}
        </Link>
      </div>
      <div className={styles.next}>
        <Link
          rel="next"
          to={hasNextPage ? nextPagePath : "/"}
          className={nextClassName}
        >
          {PAGINATION.NEXT_PAGE}
        </Link>
      </div>
    </div>
  );
};

export default Pagination;
