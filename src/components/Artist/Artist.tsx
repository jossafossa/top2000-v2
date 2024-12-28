import { memo } from "react";
import { type Artist as ArtistT } from "@assets/Top2000Api";
import styles from "./Artist.module.scss";

type ArtistProps = ArtistT;

export const Artist = memo(function Artist(props: ArtistProps) {
  const { artist, image, tracks } = props;

  return (
    <div className={styles.container} onClick={() => console.log(tracks)}>
      {/* <span className={styles.position}>
        <strong>{position}</strong>
      </span> */}

      <article className={styles.track}>
        <header>
          <picture>
            <img src={image} />
          </picture>
        </header>

        <section>
          <h2>{artist}</h2>
        </section>

        <footer>
          <span>{tracks.length} songs</span>
        </footer>
      </article>
    </div>
  );
});
