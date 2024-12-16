import { Positions } from "./components/Positions.tsx";
import styles from "./App.module.scss";
import { Top2000Handler, Top2000Provider } from "./components/Context.tsx";
import { Filters } from "./components/Filters.tsx";

function App() {
  const top2000 = Top2000Handler();

  const { selectedYear } = top2000;

  return (
    <Top2000Provider value={top2000}>
      <article className={styles.container}>
        <header>
          <h1>Top 2000 van {selectedYear}</h1>
          <Filters />
        </header>
        <section>
          <Positions height={86} />
        </section>
      </article>
    </Top2000Provider>
  );
}

export default App;
