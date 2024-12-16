import { useState } from "react";
import styles from "./Sorter.module.scss";
import { Label } from "./Label";

type SorterProps = {
  name: string;
  label: string;
  onChange: (direction: boolean) => void;
  active: boolean;
};

export const Sorter = ({ name, label, onChange, active }: SorterProps) => {
  const [order, setOrder] = useState(true);

  const change = (direction: boolean) => {
    setOrder(direction);
    onChange(direction);
  };

  return (
    <label>
      <input
        className={styles.input}
        type="checkbox"
        name={name}
        onChange={({ target }) => change(target.checked)}
      />
      <Label active={active}>
        {label}

        <span className={styles.icon}>
          {active && (order ? "▼" : "▲")}
        </span>
      </Label>
    </label>
  );
};
