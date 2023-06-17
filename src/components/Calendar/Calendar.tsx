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
  getYear,
  isSameDay,
  isSameMonth,
  isSameYear,
  lastDayOfWeek,
  startOfMonth,
  startOfWeek,
  subMonths,
  subYears,
} from "date-fns";

import "./calendar.scss";
import { events } from "~/data/events";
import ProfilePicture from "~/assets/pro-pic.jpg";
import { range } from "~/utils";

const MONTH_FORMAT = "MMM";
const FULL_MONTH_FORMAT = "MMMM";
const FULL_DATE_FORMAT = "yyyy-MM-dd";

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

  const startYear = createMemo(() => subYears(currentDate(), 4));
  const endYear = createMemo(() => addYears(currentDate(), 4));

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
        {Events({ currentDate: currentDate() })}
        {Years({
          allYears: allYears(),
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
        <span class="arrow">{`← `}</span>
        {format(previousMonth, MONTH_FORMAT).toUpperCase()}
      </button>
      <div class="current-month-name">
        {format(currentDate, FULL_MONTH_FORMAT).toUpperCase()}
      </div>
      <button onClick={() => setCurrentDate(nextMonth)}>
        {format(nextMonth, MONTH_FORMAT).toUpperCase()}
        <span class="arrow">{` →`}</span>
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
  const allEventDates = Object.keys(events);

  return (
    <div class="grid">
      <For each={dates}>
        {(date) => (
          <div
            class={`day-number ${today(date) ? "today" : ""} ${
              !dateNotInCurrentMonth(date) ? "extra-date" : ""
            } ${
              allEventDates.includes(format(date, FULL_DATE_FORMAT))
                ? "event-day"
                : ""
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

export const Years = ({
  allYears,
  currentDate,
  setCurrentDate,
}: {
  allYears: Date[];
  currentDate: Date;
  setCurrentDate: Setter<Date>;
}) => {
  const isCurrentYear = (date: Date) => isSameYear(date, currentDate);
  return (
    <aside class="years">
      <div
        class="year-navigation"
        onClick={() => setCurrentDate(subYears(currentDate, 1))}
      >
        ↑
      </div>
      <ul class="years-list">
        <For each={allYears}>
          {(year, i) => (
            <li>
              <button
                class={`year ${isCurrentYear(year) ? "active-year" : ""}`}
              >
                <div
                  style={{
                    transform: `scale(${range(
                      [1, 4],
                      [0.9, 0.4],
                      Math.abs(5 - (i() + 1))
                    )})`,
                  }}
                >
                  {getYear(year)}
                </div>
              </button>
            </li>
          )}
        </For>
      </ul>
      <div
        class="year-navigation"
        onClick={() => setCurrentDate(addYears(currentDate, 1))}
      >
        ↓
      </div>
    </aside>
  );
};

export const Events = ({ currentDate }: { currentDate: Date }) => {
  const todayEvents = events[format(currentDate, FULL_DATE_FORMAT)];

  return (
    <aside class="events">
      <img class="profile-picture" src={ProfilePicture} />
      <ul class="events-list">
        <For each={todayEvents} fallback={<p class="no-events">No events</p>}>
          {(event) => (
            <li class="event">
              <div class="event-time">{event.time}</div>
              <h4 class="event-title">{event.title}</h4>
              <p class="event-description">{event.description}</p>
              <div class="place">
                <svg
                  fill="#000000"
                  width="800px"
                  height="800px"
                  viewBox="-64 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                  class="marker"
                >
                  <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z" />
                </svg>
                <span>{event.place}</span>
              </div>
            </li>
          )}
        </For>
      </ul>
    </aside>
  );
};
