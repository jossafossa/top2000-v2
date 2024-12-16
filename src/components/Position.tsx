import { memo } from "react";
import { Track } from "../store";
import { Label } from "./Label";
import styles from "./Position.module.scss";

type PositionProps = Track;

export const Position = memo( function Position({
  title,
  artist,
  image,
  change,
  isNew,
  id,
}: PositionProps) {
  let style = "neutral";
  if (change > 0) style = "positive";
  if (change < 0) style = "negative";

  let changeLabel = "-";
  if (change > 0) changeLabel = `+${change}`;
  if (change < 0) changeLabel = `${change}`;

  return (
    <article className={styles.track} title={id}>
      <header>
        <picture>
          <img src={image} />
        </picture>
      </header>

      <section>
        <h2>{title}</h2>

        <h3>{artist}</h3>
      </section>

      <footer>
        {isNew ? <Label>new</Label> : null}
        <Label style={style as "positive" | "negative" | "neutral"}>
          {changeLabel}
        </Label>
      </footer>
    </article>
  );
});
