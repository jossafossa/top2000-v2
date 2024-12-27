import { Position } from "@components/Position";
import { LazyScroller } from "@components/LazyScroller";
import { useYears } from "@components/YearsContext";

type YearListProps = {
  height: number;
};

export const YearList = ({ height }: YearListProps) => {
  const { positions, isLoading } = useYears();

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
