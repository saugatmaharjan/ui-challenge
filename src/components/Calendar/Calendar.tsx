import {
  For,
  Setter,
  createComputed,
  createMemo,
  createSignal,
} from "solid-js";
import {
  addMonths,
  addYears,
  eachDayOfInterval,
  eachYearOfInterval,
  endOfMonth,
  format,
  getDate,
  isSameDay,
  isSameMonth,
  isThisMonth,
  isToday,
  lastDayOfWeek,
  startOfMonth,
  startOfWeek,
  subMonths,
  subYears,
} from "date-fns";

import "./calendar.scss";

const YEAR_FORMAT = "yyy";
const MONTH_FORMAT = "MMM";
const FULL_MONTH_FORMAT = "MMMM";
const DAY_FORMAT = "dd";

export default function Calendar() {
  const [currentDate, setCurrentDate] = createSignal(new Date());

  // find start of the month of the current date
  const startDateOfMonth = createMemo(() => startOfMonth(currentDate()));
  // find end of the month of the current date
  const endDateOfMonth = createMemo(() => endOfMonth(currentDate()));
  // find start day of week for current date
  const startDayOfWeek = createMemo(() => startOfWeek(startDateOfMonth()));
  // find last day of week for current date
  const endDayOfWeek = createMemo(() => lastDayOfWeek(endDateOfMonth()));

  const allDates = createMemo(() =>
    eachDayOfInterval({
      start: startDayOfWeek(),
      end: endDayOfWeek(),
    })
  );

  const startYear = createMemo(() => subYears(currentDate(), 2));
  const endYear = createMemo(() => addYears(currentDate(), 2));

  const allYears = createMemo(() =>
    eachYearOfInterval({
      start: startYear(),
      end: endYear(),
    })
  );

  console.log(allYears());

  return (
    <main class="container">
      <h1 class="title">Calendar</h1>
      <div class="calendar">
        {Navigation({
          currentDate: currentDate(),
          setCurrentDate,
        })}
        <DaysName />
        {/* <Dates dates={allDates()} /> */}
        {Dates({
          dates: allDates(),
          currentDate: currentDate(),
          setCurrentDate,
        })}
      </div>
    </main>
  );
}

export const Navigation = ({
  currentDate,
  setCurrentDate,
}: {
  currentDate: Date;
  setCurrentDate: Setter<Date>;
}) => {
  const previousMonth = subMonths(currentDate, 1);
  const nextMonth = addMonths(currentDate, 1);
  return (
    <div class="navigation">
      <button onClick={() => setCurrentDate(previousMonth)}>
        {format(previousMonth, MONTH_FORMAT).toUpperCase()}
      </button>
      <div class="current-month-name">
        {format(currentDate, FULL_MONTH_FORMAT).toUpperCase()}
      </div>
      <button onClick={() => setCurrentDate(nextMonth)}>
        {format(nextMonth, MONTH_FORMAT).toUpperCase()}
      </button>
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

export const Dates = ({
  dates,
  currentDate,
  setCurrentDate,
}: {
  dates: Date[];
  currentDate: Date;
  setCurrentDate: Setter<Date>;
}) => {
  const today = (date: Date) => isSameDay(currentDate, date);
  const dateNotInCurrentMonth = (date: Date) => isSameMonth(currentDate, date);
  return (
    <div class="grid">
      <For each={dates}>
        {(date) => (
          <div
            class={`day-number ${today(date) ? "today" : ""} ${
              !dateNotInCurrentMonth(date) ? "extra-date" : ""
            }`}
            onClick={() => {
              console.log(date);
              setCurrentDate(date);
            }}
          >
            {getDate(date)}
          </div>
        )}
      </For>
    </div>
  );
};
