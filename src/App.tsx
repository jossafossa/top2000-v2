import { YearsHandler, YearsProvider } from "@components/YearsContext";
import styles from "./App.module.scss";
import { Top2000Handler, Top2000Provider } from "@components/Top2000Context";
import { Filters } from "@components/Filters/Filters.tsx";
import { List } from "@components/List/List.tsx";
import {
  SongsHandler,
  SongsProvider,
} from "@components/SongsContext/SongsContext.ts";
import { ArtistsHandler, ArtistsProvider } from "@components/ArtistsContext";

function App() {
  const top2000 = Top2000Handler();
  const years = YearsHandler();
  const songs = SongsHandler();
  const artists = ArtistsHandler();

  const { selectedYear, positions } = years;

  const yearTitle = selectedYear === "all" ? "all years" : selectedYear;

  return (
    <YearsProvider value={years}>
      <SongsProvider value={songs}>
        <ArtistsProvider value={artists}>
          <Top2000Provider value={top2000}>
            <article className={styles.container}>
              <header>
                <h1>
                  Top {positions?.length} from {yearTitle}
                </h1>

                <Filters />
              </header>

              <section>
                <List />
              </section>
            </article>
          </Top2000Provider>
        </ArtistsProvider>
      </SongsProvider>
    </YearsProvider>
  );
}

export default App;
