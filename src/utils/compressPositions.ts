// import { ApiPosition, Position } from "../store";
// import { getPositionId } from "./getPositionId";

// type CompressedPosition = Position & {
//   positions: Record<string, number>;
// };

// export function compressPositions(
//   years: Record<string, ApiPosition[]>
// ): CompressedPosition[] {
//   const songMap = new Map();

//   for (const [year, songs] of Object.entries(years)) {
//     songs.forEach(({ position: { current }, ...track }) => {
//       const key = getPositionId(track);
//       if (!songMap.has(key)) {
//         songMap.set(key, { positions: {}, ...track });
//       }
//       songMap.get(key).positions[year] = current;
//     });
//   }

//   // Convert the map back to an array
//   return Array.from(songMap.values());
// }

// export function decompressPositions(
//   songs: CompressedPosition[]
// ): Record<string, ApiPosition[]> {
//   const years: Record<string, Position[]> = {};

//   songs.forEach(({ positions, ...track }) => {
//     for (const [year, position] of Object.entries(positions)) {
//       if (!years[year]) years[year] = [];
//       years[year].push({ ...track, position });
//     }
//   });

//   // sort by position
//   for (const [year, list] of Object.entries(years)) {
//     years[year] = list.sort((a, b) => a.position - b.position);
//   }

//   return years;
// }
