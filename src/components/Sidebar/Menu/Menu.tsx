import React from "react";

import { Link } from "gatsby";

import * as styles from "./Menu.module.scss";

type Props = {
  menu: Array<{
    label: string;
    path: string;
  }>;
};

const Menu: React.FC<Props> = ({ menu }: Props) => (
  <nav className={styles.menu}>
    <ul className={styles.list}>
      {menu.map((item) => (
        <li className={styles.item} key={item.path}>
          <Link
            to={item.path}
            className={styles.link}
            activeClassName={styles.active}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export default Menu;
