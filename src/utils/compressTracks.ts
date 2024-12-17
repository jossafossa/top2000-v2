// import { ApiTrack, Track } from "../store";
// import { getTrackId } from "./getTrackId";

// type CompressedTrack = Track & {
//   positions: Record<string, number>;
// };

// export function compressTracks(
//   years: Record<string, ApiTrack[]>
// ): CompressedTrack[] {
//   const songMap = new Map();

//   for (const [year, songs] of Object.entries(years)) {
//     songs.forEach(({ position: { current }, ...track }) => {
//       const key = getTrackId(track);
//       if (!songMap.has(key)) {
//         songMap.set(key, { positions: {}, ...track });
//       }
//       songMap.get(key).positions[year] = current;
//     });
//   }

//   // Convert the map back to an array
//   return Array.from(songMap.values());
// }

// export function decompressTracks(
//   songs: CompressedTrack[]
// ): Record<string, ApiTrack[]> {
//   const years: Record<string, Track[]> = {};

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
