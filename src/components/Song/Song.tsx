import { memo } from "react";
import { type EnhancedTrack } from "@assets/Top2000Api";
import styles from "./Song.module.scss";
import { Label } from "@components/Label";
import { useTop2000 } from "@components/Top2000Context";

type SongProps = EnhancedTrack;

export const Song = memo(function Song(props: SongProps) {
  const { title, artist, image, position } = props;
  const { sortType } = useTop2000();

  return (
    <div className={styles.container}>
      <span className={styles.position}>
        <strong>{position}</strong>
      </span>

      <article className={styles.track}>
        <header>
          <picture>
            <img src={image} />
          </picture>
        </header>

        <section>
          <h2>{title}</h2>

          <h3>{artist}</h3>
        </section>

        <Label title={sortType}>{props[sortType]}</Label>
      </article>
    </div>
  );
});
