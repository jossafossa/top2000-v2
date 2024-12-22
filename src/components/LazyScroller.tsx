import { useEffect, useRef, useState } from "react";
import styles from "./LazyScroller.module.scss";
import classNames from "classnames";
import { Spinner } from "./Spinner";

export function LazyScroller<T>({
  height,
  items,
  isLoading,
  renderItem,
}: {
  height: number;
  items: T[];
  isLoading: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
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

  if (!items) {
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
        <div className={styles.inner} style={{ height: items.length * height }}>
          {items.map(
            (item, index) =>
              inView(index) && (
                <div
                  className={styles.track}
                  key={index}
                  style={{ top: `${index * height}px` }}
                >
                  {renderItem(item, index)}
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
