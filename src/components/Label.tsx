import { PropsWithChildren } from "react";
import styles from "./Label.module.scss";
import classNames from "classnames";

type LabelProps = PropsWithChildren<{
  active?: boolean;
  style?: "positive" | "negative" | "neutral";
}>;

export const Label = ({ children, active, style = "neutral" }: LabelProps) => {
  return (
    <span
      className={classNames(
        styles.label,
        active && styles.active,
        styles[style]
      )}
    >
      {children}
    </span>
  );
};
