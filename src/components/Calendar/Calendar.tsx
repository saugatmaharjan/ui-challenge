import { For } from "solid-js";
import "./calendar.scss";

export default function Calendar() {
  return (
    <main class="container">
      <h1 class="title">Calendar</h1>
      <div class="calendar">
        <Navigation />
        <DaysName />
        <Grid />
      </div>
    </main>
  );
}

export const Navigation = () => {
  return (
    <div class="navigation">
      <button>FEB</button>
      <div class="current-month-name">MARCH</div>
      <button>JUNE</button>
    </div>
  );
};

export const DaysName = () => {
  return (
    <div class="grid day-name-row">
      <div>SUN</div>
      <div>MON</div>
      <div>TUE</div>
      <div>WED</div>
      <div>THU</div>
      <div>FRI</div>
      <div>SAT</div>
    </div>
  );
};

export const Grid = () => {
  return (
    <div class="grid">
      <For each={[...Array(30).keys()]}>
        {(day) => <div class="day-number">{day + 1}</div>}
      </For>
    </div>
  );
};
