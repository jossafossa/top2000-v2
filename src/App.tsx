import styles from "./App.module.scss";
import { Top2000Handler, Top2000Provider } from "./components/Context.tsx";
import { Filters } from "./components/Filters.tsx";
import { List } from "./components/List.tsx";

function App() {
  const top2000 = Top2000Handler();

  const { selectedYear, positions } = top2000;

  const yearTitle = selectedYear === "all" ? "all years" : selectedYear;

  return (
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
  );
}

export default App;
