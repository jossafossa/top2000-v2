import { Track } from "@assets/Top2000Api";

export const useRelativePositions = (
  tracks: Track[],
  comparePositions: Track[]
) => {
  const compareToPrevious = comparePositions.length === 0;
  return tracks.map((track) => {
    const comparePosition = comparePositions.find(
      (comparePosition) => comparePosition.id === track.id
    );
    const { position, apiPrefPosition } = track;
    const previousPosition = compareToPrevious
      ? apiPrefPosition || tracks.length
      : comparePosition?.position ?? tracks.length;

    const change = previousPosition - position;

    return {
      ...track,
      change,
      isNew: previousPosition === tracks.length,
    };
  });
};
