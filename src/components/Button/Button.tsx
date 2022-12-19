import React from "react";

import cn from "classnames";
import { Link } from "gatsby";

import * as styles from "./Button.module.scss";

interface Props {
  className?: string;
  title: string;
  to: string;
}

const Button: React.FC<Props> = ({ className, title, to }: Props) => (
  <Link className={cn(styles.button, className)} to={to}>
    {title}
  </Link>
);

export default Button;
