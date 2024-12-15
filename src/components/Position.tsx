import { Track } from "../store";
import styles from "./Position.module.scss";

type PositionProps = Track;

export const Position = ({
  position,
  title,
  artist,
  image,
  change,
}: PositionProps) => {
  return (
    <article className={styles.position}>
      <header>
        <img
          className={styles.image}
          src={image}
          alt={`${title} - ${artist} `}
        />
      </header>
      <section>
        <h2>
          {position}. {title}
        </h2>
        <p>{artist}</p>
      </section>
      <footer>
        {change !== undefined && <p>{change > 0 ? `+${change}` : change}</p>}
      </footer>
    </article>
  );
};
