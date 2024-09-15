import React from "react";

import { Button } from "@/components/Button";

import * as styles from "./Tags.module.scss";

type Props = {
  tags: string[];
  tagSlugs: string[];
};

const Tags = ({ tags, tagSlugs }: Props) => (
  <div className={styles.tags}>
    <ul className={styles.list}>
      {tagSlugs
        ? tagSlugs.map((slug, i) => (
            <li className={styles.item} key={slug}>
              <Button title={tags[i]} key={slug} to={slug} />
            </li>
          ))
        : null}
    </ul>
  </div>
);

export default Tags;
