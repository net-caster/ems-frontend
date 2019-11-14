import React, { useState, createContext, useEffect } from "react";

import useShifts from "../hooks/useShifts";
import moment from "moment";

export const DateContext = createContext();

export const DateProvider = props => {
  const today = new Date();
  const currDay = today.getDate();
  const currYear = today.getFullYear();
  const currMonth = today.getMonth();
  const currWeek = moment().isoWeek();

  const { shifts } = useShifts();

  const [queries, setQueries] = useState({
    year: null,
    month: null,
    day: null,
    clicked: false
  });
  const [dateStates, setDateStates] = useState({
    day: currDay,
    year: currYear,
    month: currMonth,
    week: currWeek,
    monthOfYear: [],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    daysOfWeek: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
    daysInMonth: [],
    queryYear: null,
    queryMonth: null,
    queryDay: null
  });

  const dependencies = [dateStates.month, dateStates.year, shifts];

  useEffect(() => {
    generateMonth();
  }, dependencies);

  const handleClick = event => {
    const year = parseInt(event.currentTarget.getAttribute("data-year"));
    const month = parseInt(event.currentTarget.getAttribute("data-month"));
    const date = parseInt(event.currentTarget.getAttribute("data-date"));

    setQueries({
      ...queries,
      year: year,
      month: month,
      day: date,
      clicked: true
    });
  };

  const generateMonth = () => {
    const firstDay = (year, month) => {
      return new Date(year, month, 0).getDay();
    };

    const daysOfMonth = (year, month) => {
      return 32 - new Date(year, month, 32).getDate();
    };

    let days = [];
    let daysInMonth = [];
    let weeks = [];

    let date = 1;
    let int = 1;

    for (let i = 0; i < 6; i++) {
      let cell = <td />;
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay(dateStates.year, dateStates.month)) {
          cell = <td key={int++} className="empty-block" />;
        } else if (date > daysOfMonth(dateStates.year, dateStates.month)) {
          break;
        } else {
          const dateId = `${dateStates.year}${
            dateStates.month + 1 < 10
              ? "0" + (dateStates.month + 1)
              : dateStates.month + 1
          }${date < 10 ? "0" + date : date}`;
          cell = (
            <td key={dateId} id={dateId} className="day-block">
              <button
                data-year={dateStates.year}
                data-month={dateStates.month}
                data-date={date}
                onClick={handleClick}
              >
                <div className="day-block__tags">
                  {shifts.map(shift => {
                    if (
                      date === shift.day &&
                      dateStates.month === shift.month &&
                      dateStates.year === shift.year
                    ) {
                      return (
                        <li key={int++} className="calendar-tag__name">
                          &bull;
                        </li>
                      );
                    }
                  })}
                </div>
                <div className="day-block__dates">
                  <span className="day-text">{date}</span>
                  <span className="weekday-text">
                    {
                      dateStates.daysOfWeek[
                        new Date(
                          `${dateStates.year}-${dateStates.month + 1}-${date}`
                        ).getDay()
                      ]
                    }
                  </span>
                </div>
              </button>
            </td>
          );
          daysInMonth.push(date);
          if (
            new Date(
              `${dateStates.year}-${dateStates.month + 1}-${date}`
            ).getDay() === 6 ||
            new Date(
              `${dateStates.year}-${dateStates.month + 1}-${date}`
            ).getDay() === 0
          ) {
            cell = (
              <td key={dateId} id={dateId} className="day-block">
                <button
                  data-year={dateStates.year}
                  data-month={dateStates.month}
                  data-date={date}
                  onClick={handleClick}
                >
                  <div className="day-block__tags--weekend">
                    {shifts.map(shift => {
                      if (
                        date === shift.day &&
                        dateStates.month === shift.month &&
                        dateStates.year === shift.year
                      ) {
                        return (
                          <li key={int++} className="calendar-tag__name">
                            &bull;
                          </li>
                        );
                      }
                    })}
                  </div>
                  <div className="day-block__dates--weekend">
                    <span className="weekend-day__text">{date}</span>
                    <span className="weekend-date__text">
                      {
                        dateStates.daysOfWeek[
                          new Date(
                            `${dateStates.year}-${dateStates.month + 1}-${date}`
                          ).getDay()
                        ]
                      }
                    </span>
                  </div>
                </button>
              </td>
            );
          }
          if (
            date === currDay &&
            dateStates.year === currYear &&
            dateStates.month === currMonth
          ) {
            cell = (
              <td key={dateId} id={dateId} className="day-block curr-day">
                <button
                  data-year={dateStates.year}
                  data-month={dateStates.month}
                  data-date={date}
                  onClick={handleClick}
                >
                  <div className="day-block__tags--curr">
                    {shifts.map(shift => {
                      if (
                        date === shift.day &&
                        dateStates.month === shift.month &&
                        dateStates.year === shift.year
                      ) {
                        return (
                          <li key={int++} className="calendar-tag__name">
                            &bull;
                          </li>
                        );
                      }
                    })}
                  </div>
                  <div className="day-block__dates--curr">
                    <span className="day-text curr-day__block--text">
                      {date}
                    </span>
                    <span className="curr-weekday__block--text">
                      {
                        dateStates.daysOfWeek[
                          new Date(
                            `${dateStates.year}-${dateStates.month + 1}-${date}`
                          ).getDay()
                        ]
                      }
                    </span>
                  </div>
                </button>
              </td>
            );
          }
          date++;
        }
        days.push(cell);
      }
    }

    while (days.length > 0) {
      weeks.push(days.slice(0, 7));
      days = days.slice(7);
    }

    setDateStates({
      ...dateStates,
      monthOfYear: weeks,
      daysInMonth: daysInMonth
    });
  };

  return (
    <DateContext.Provider
      value={[dateStates, setDateStates, queries, setQueries]}
    >
      {props.children}
    </DateContext.Provider>
  );
};
