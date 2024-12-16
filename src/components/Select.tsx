import classNames from "classnames";
import { SelectHTMLAttributes } from "react";
import styles from "./Select.module.scss";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({className, ...props}: SelectProps) => {
  return (<select {...props} className={classNames(className, styles.select)} />);
}