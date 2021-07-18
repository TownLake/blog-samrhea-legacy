import React from 'react';
import styles from './Page.module.scss';
import "./product-grid.css";

type Props = {
  title?: string,
  children: React.Node
};

const Page = ({ title, children }: Props) => {

  return (
    <div className={styles['page']}>
      <div className={styles['page__inner']}>
        { title && <h1 className={styles['page__title']}>{title}</h1>}
        <div className={styles['page__body']}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Page;