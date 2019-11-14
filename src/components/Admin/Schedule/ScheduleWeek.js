import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import "../../../assets/styles/scss/schedule.scss";

import useShifts from "../../../hooks/useShifts";

const moment = require("moment");

const ScheduleWeek = () => {
  const { shifts } = useShifts();
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [weekAllWages, setWeekAllWages] = useState(0);
  const [weekAllHours, setWeekAllHours] = useState(0);
  const [week, setWeek] = useState(moment().isoWeek());
  const [dates, setDates] = useState([]);

  useEffect(() => {
    document.title = "Dashboard | Week Schedule";
  }, []);

  useEffect(() => {
    generateWeek();
    setFilteredShifts(shifts.filter(shift => shift.week === week));
  }, [weekAllWages, week, shifts]);

  useEffect(() => {
    let tempWages = 0;
    let tempHours = 0;
    filteredShifts.forEach(shift => {
      tempWages = parseFloat(shift.shift_wage) + tempWages;
      tempHours = parseFloat(shift.shift_hours) + tempHours;
    });
    setWeekAllWages(parseFloat(Math.round(tempWages * 100) / 100).toFixed(2));
    setWeekAllHours(tempHours);
  }, [filteredShifts]);

  const generateWeek = () => {
    let startDay = moment()
      .isoWeek(week)
      .startOf("isoWeek");
    let endDay = moment()
      .isoWeek(week)
      .endOf("isoWeek");
    let currDay = startDay;

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    const monthsOfYear = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    let tempArray = [];

    while (currDay < endDay) {
      tempArray.push({
        week: week,
        date: currDay.date(),
        dayInWeek: currDay.day(),
        dayOfWeek: daysOfWeek[moment(currDay).day()],
        month: currDay.month(),
        year: currDay.year(),
        monthOfYear: monthsOfYear[currDay.month()]
      });
      currDay = moment(currDay).add(1, "day");
    }

    setDates(tempArray);
  };

  const currWeek = () => {
    setWeek(moment().isoWeek());
  };

  const nextWeek = () => {
    setWeek(week + 1);
  };

  const previousWeek = () => {
    setWeek(week - 1);
  };

  return (
    <div className="week-schedule__container">
      <div className="week-schedule__buttons">
        <button onClick={previousWeek}>PREV</button>
        <button onClick={currWeek}>...</button>
        <button onClick={nextWeek}>NEXT</button>
      </div>
      <div className="week-schedule__info">
        <div className="week-schedule__info__cell">
          <span className="schedule-info__cell__title">Total Wages:</span>
          <span className="schedule-info__cell__value">
            &#163; {weekAllWages}
          </span>
        </div>
        <div className="week-schedule__info__cell">
          <span className="schedule-info__cell__title">Total Hours:</span>
          <span className="schedule-info__cell__value">{weekAllHours}</span>
        </div>
      </div>
      <div className="week-container">
        <ul className="week-container__row">
          {dates.map(day => {
            if (
              moment().year() === day.year &&
              moment().month() === day.month &&
              moment().date() === day.date
            ) {
              return (
                <li key={day.date} className="week-cell">
                  <div className="week-cell__block">
                    <span className="week-cell__block--date week-cell__block--curr">
                      {day.date}
                    </span>
                    <span className="week-cell__block--day week-cell__block--curr">
                      {day.dayOfWeek}
                    </span>
                    <span className="week-cell__block--month week-cell__block--curr">
                      {day.monthOfYear}
                    </span>
                  </div>
                  <div className="shift-cell">
                    {shifts.map(shift => {
                      if (
                        shift.day === day.date &&
                        shift.week_day === day.dayInWeek &&
                        shift.week === day.week &&
                        shift.year === day.year
                      ) {
                        return (
                          <div key={shift.id} className="shift-cell__block">
                            <span className="shift-cell__block--info shift-cell__block--name">
                              {shift.name}:
                            </span>
                            <div className="shift-cell__details">
                              <span className="shift-cell__block--info shift-cell__block--time">
                                {shift.shift_start.replace(/:[\d]+$/, "")} -{" "}
                                {shift.shift_end.replace(/:[\d]+$/, "")}
                              </span>
                              <span className="shift-cell__block--info shift-cell__block--hours">
                                {shift.shift_hours}h
                              </span>
                              <span className="shift-cell__block--info shift-cell__block--pay">
                                &#163; {shift.shift_wage}
                              </span>
                              <NavLink to={`/auth/schedule/${shift.id}`}>
                                <div className="shift-cell__edit--icon" />
                              </NavLink>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </li>
              );
            }
            if (day.dayInWeek === 0 || day.dayInWeek === 6) {
              return (
                <li key={day.date} className="week-cell">
                  <div className="week-cell__block">
                    <span className="week-cell__block--date week-cell__block--weekend">
                      {day.date}
                    </span>
                    <span className="week-cell__block--day week-cell__block--weekend">
                      {day.dayOfWeek}
                    </span>
                    <span className="week-cell__block--month week-cell__block--weekend">
                      {day.monthOfYear}
                    </span>
                  </div>
                  <div className="shift-cell">
                    {shifts.map(shift => {
                      if (
                        shift.day === day.date &&
                        shift.week_day === day.dayInWeek &&
                        shift.week === day.week &&
                        shift.year === day.year
                      ) {
                        return (
                          <div key={shift.id} className="shift-cell__block">
                            <span className="shift-cell__block--info shift-cell__block--name">
                              {shift.name}:
                            </span>
                            <div className="shift-cell__details">
                              <span className="shift-cell__block--info shift-cell__block--time">
                                {shift.shift_start.replace(/:[\d]+$/, "")} -{" "}
                                {shift.shift_end.replace(/:[\d]+$/, "")}
                              </span>
                              <span className="shift-cell__block--info shift-cell__block--hours">
                                {shift.shift_hours}h
                              </span>
                              <span className="shift-cell__block--info shift-cell__block--pay">
                                &#163; {shift.shift_wage}
                              </span>
                              <NavLink to={`/auth/schedule/${shift.id}`}>
                                <div className="shift-cell__edit--icon" />
                              </NavLink>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </li>
              );
            }
            return (
              <li key={day.date} className="week-cell">
                <div className="week-cell__block">
                  <span className="week-cell__block--date">{day.date}</span>
                  <span className="week-cell__block--day">{day.dayOfWeek}</span>
                  <span className="week-cell__block--month">
                    {day.monthOfYear}
                  </span>
                </div>
                <div className="shift-cell">
                  {shifts.map(shift => {
                    if (
                      shift.day === day.date &&
                      shift.week_day === day.dayInWeek &&
                      shift.week === day.week &&
                      shift.year === day.year
                    ) {
                      return (
                        <div key={shift.id} className="shift-cell__block">
                          <span className="shift-cell__block--info shift-cell__block--name">
                            {shift.name}:
                          </span>
                          <div className="shift-cell__details">
                            <span className="shift-cell__block--info shift-cell__block--time">
                              {shift.shift_start.replace(/:[\d]+$/, "")} -{" "}
                              {shift.shift_end.replace(/:[\d]+$/, "")}
                            </span>
                            <span className="shift-cell__block--info shift-cell__block--hours">
                              {shift.shift_hours}h
                            </span>
                            <span className="shift-cell__block--info shift-cell__block--pay">
                              &#163; {shift.shift_wage}
                            </span>
                            <NavLink to={`/auth/schedule/${shift.id}`}>
                              <div className="shift-cell__edit--icon" />
                            </NavLink>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ScheduleWeek;
