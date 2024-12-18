import { useEffect, useRef, useState } from "react";
import { Position } from "./Position";
import styles from "./Positions.module.scss";
import { useTop2000 } from "./Context";
import { Spinner } from "./Spinner";
import classNames from "classnames";

type PositionsProps = {
  height: number;
};

export const Positions = ({ height }: PositionsProps) => {
  const { positions, isLoading } = useTop2000();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const refCurrent = scrollRef.current;
    if (refCurrent) {
      refCurrent.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  if (!positions) {
    return null;
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollTop);
    }
  };
  const inView = (position: number) => {
    const marginPositions = 20;
    const viewHeight = scrollRef.current?.clientHeight || 0;

    return (
      position * height > scrollPosition - marginPositions * height &&
      position * height < scrollPosition + viewHeight + marginPositions * height
    );
  };

  return (
    <div className={styles.container}>
      <div className={classNames(styles.loader, isLoading && styles.active)}>
        <Spinner />
      </div>
      <div className={styles.scroll} ref={scrollRef}>
        <div
          className={styles.inner}
          style={{ height: positions.length * height }}
        >
          {positions.map(
            (position, index) =>
              inView(index) && (
                <div
                  className={styles.track}
                  key={`${position.id}-${index}`}
                  style={{ top: `${index * height}px` }}
                >
                  <Position {...position} />
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};
