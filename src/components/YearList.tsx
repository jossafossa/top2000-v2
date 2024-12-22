import { Position } from "./Position";
import { useTop2000 } from "./Context";
import { LazyScroller } from "./LazyScroller";

type YearListProps = {
  height: number;
};

export const YearList = ({ height }: YearListProps) => {
  const { positions, isLoading } = useTop2000();

  return (
    <LazyScroller
      height={height}
      items={positions || []}
      isLoading={isLoading}
      renderItem={(position, index) => (
        <Position key={`${position.id}-${index}`} {...position} />
      )}
    />
  );
};
