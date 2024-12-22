import { memo } from "react";
import { type EnhancedTrack } from "../assets/Top2000Api";
import styles from "./Song.module.scss";
import { Label } from "./Label";

type SongProps = EnhancedTrack;

export const Song = memo(function Song({
  title,
  artist,
  image,
  id,
  position,
  positions,
  totalChange,
  changes,
  averageChange,
}: SongProps) {
  return (
    <div className={styles.container}>
      <span className={styles.position}>
        <strong>{position}</strong>
      </span>

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

        <div title={JSON.stringify(positions, null, 2)}>positions</div>
        <div title={JSON.stringify(changes, null, 2)}>changes</div>
        <Label>{totalChange}</Label>
        <Label>{averageChange}</Label>
      </article>
    </div>
  );
});
