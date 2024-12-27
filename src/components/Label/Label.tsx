import { PropsWithChildren } from "react";
import styles from "./Label.module.scss";
import classNames from "classnames";

type LabelProps = PropsWithChildren<{
  active?: boolean;
  title?: string;
  style?: "positive" | "negative" | "neutral";
}>;

export const Label = ({
  children,
  active,
  title,
  style = "neutral",
}: LabelProps) => {
  return (
    <span
      title={title}
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
