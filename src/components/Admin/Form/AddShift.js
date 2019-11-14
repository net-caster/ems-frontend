import React, { useContext, useEffect, useState } from "react";

import "../../../assets/styles/scss/add-shift.scss";

import { AuthContext } from "../../../contexts/AuthContext";
import { FormContext } from "../../../contexts/FormContext";
import { DateContext } from "../../../contexts/DateContext";

import shiftValidator from "../../../middleware/shiftValidator";
import useTime from "../../../hooks/useTime";
import AlertError from "../../AlertError";
import AlertSuccess from "../../AlertSuccess";

import moment from "moment";

const AddShift = () => {
  const {
    time,
    totalHours,
    totalPay,
    setTotalPay,
    hoursStartUp,
    hoursStartDown,
    hoursEndUp,
    hoursEndDown,
    minutesStartUp,
    minutesStartDown,
    minutesEndUp,
    minutesEndDown,
    deductUp,
    deductDown
  } = useTime();
  const [dateStates, setDateStates] = useContext(DateContext);
  const [authState] = useContext(AuthContext);
  const [formState, setFormState] = useContext(FormContext);
  const [employees, setEmployees] = useState([]);
  const [selEmp, setSelEmp] = useState([]);

  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [msg, setMsg] = useState("");

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  useEffect(() => {
    fetchEmployees();
    document.title = "Dashboard | Add Shift";
  }, []);

  useEffect(() => {
    totalPay;
  }, [selEmp, totalHours, time]);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submitShift();
    }
  }, [formErrors]);

  useEffect(() => {
    let { year, month, day } = dateStates;

    const dateId = `${year}${month + 1 < 10 ? "0" + (month + 1) : month + 1}${
      day < 10 ? "0" + day : day
    }`;

    setFormValues({
      ...formValues,
      employeeId: selEmp.map(emp => emp.id)[0],
      name: selEmp.map(emp => emp.name)[0],
      payRate: selEmp.map(emp => emp.payRate)[0],
      userId: authState.userId,
      date: `${year}-${month + 1}-${day}`,
      dateId: dateId,
      weekNum: moment(new Date(year, month, day)).isoWeek(),
      hourStart: time.hourStart.toString(),
      minutesStart: time.minutesStart.toString(),
      hourEnd: time.hourEnd.toString(),
      minutesEnd: time.minutesEnd.toString(),
      deduct: parseInt(time.deductBreak),
      shiftHours: totalHours,
      shiftWage: parseFloat(totalPay[0]),
      year: year,
      month: month,
      day: day,
      weekDay: new Date(year, month, day).getDay()
    });
  }, [time, totalPay, dateStates.year, dateStates.month, dateStates.day]);

  useEffect(() => {
    setTotalPay(
      selEmp.map(emp =>
        parseFloat(Math.round(emp.payRate * totalHours * 100) / 100).toFixed(2)
      )
    );
  }, [selEmp, totalHours]);

  const urlGet = "https://react-ems.herokuapp.com/auth/get-employees";
  const optionsGet = {
    credentials: "include",
    userId: authState.userId
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(urlGet, optionsGet);

      const data = await response.json();

      setEmployees(data.employees);
    } catch (err) {
      console.log(err);
    }
  };

  const urlPost = "https://react-ems.herokuapp.com/auth/add-shift";
  const optionsPost = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formValues),
    userId: authState.userId
  };

  const submitShift = async () => {
    try {
      const result = await fetch(urlPost, optionsPost);
      const data = await result.json();

      if (data.errMsg) {
        setFormState({ ...formState, showAlertError: true });
        setErrMsg(data.errMsg);
        return;
      }
      if (data.redirect && data.msg) {
        setFormState({ ...formState, showAlertSuccess: true });
        setMsg(data.msg);
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    setFormErrors(shiftValidator(formValues));
    setIsSubmitting(true);
  };

  const changeDates = event => {
    let { name, value } = event.target;
    setDateStates({ ...dateStates, [name]: parseInt(value) });
  };

  const selectEmployee = event => {
    let { value } = event.target;
    setSelEmp(employees.filter(employee => employee.name === value));
  };

  const nextDate = () => {
    setDateStates({ ...dateStates, day: dateStates.day + 1 });
    dateStates.day === dateStates.daysInMonth.length &&
      setDateStates({ ...dateStates, month: dateStates.month + 1, day: 1 });
    dateStates.month === 11 &&
      dateStates.day === dateStates.daysInMonth.length &&
      setDateStates({
        ...dateStates,
        year: dateStates.year + 1,
        month: 0,
        day: 1
      });
  };

  const previousDate = () => {
    setDateStates({ ...dateStates, day: dateStates.day - 1 });
    dateStates.day === 1 &&
      setDateStates({
        ...dateStates,
        month: dateStates.month - 1,
        day: new Date(dateStates.year, dateStates.month, 0).getDate()
      });
    dateStates.month === 0 &&
      dateStates.day === 1 &&
      setDateStates({
        ...dateStates,
        year: dateStates.year - 1,
        month: 11,
        day: new Date(dateStates.year, dateStates.month, 0).getDate()
      });
  };

  const jumpToCurrDate = () => {
    setDateStates({
      ...dateStates,
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDate()
    });
  };

  const closeAlert = () => {
    setFormState({
      ...formState,
      showAlertError: false,
      showAlertSuccess: false
    });
  };

  const shiftBody = (
    <div className="add-shift__box">
      <div className="shift-employees__list">
        <input
          data-id={selEmp.map(el => el.id)}
          className={`add-shift__name ${formErrors.employee && "invalid"}`}
          onChange={selectEmployee}
          list="employees-list"
        />
        <datalist id="employees-list">
          {employees.map(employee => (
            <option
              key={employee.id}
              data-id={employee.id}
              value={employee.name}
            >
              {employee.name} - &#163;{employee.payRate}
            </option>
          ))}
        </datalist>
        <div className="errors-container">
          {formErrors.employee && (
            <span className="help inavild">{formErrors.employee}</span>
          )}
        </div>
      </div>
      <div className="time-date">
        <div className="date-box">
          <div className="date-box__picker">
            <div className="date-box__picker--options">
              <select
                name="year"
                className="date-box__select years"
                onChange={changeDates}
                readOnly
                disabled
              >
                <option value={dateStates.year}>{dateStates.year}</option>
              </select>
              <select
                name="month"
                className="date-box__select months"
                onChange={changeDates}
                value={dateStates.month}
              >
                {dateStates.months.map((month, idx) => (
                  <option key={idx} value={idx}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                name="day"
                className="date-box__select days"
                onChange={changeDates}
                value={dateStates.day}
              >
                {dateStates.daysInMonth.map(day => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="date-box__picker--controls">
              <div className="prev-date__btn" onClick={previousDate} />
              <div className="curr-date__btn" onClick={jumpToCurrDate} />
              <div className="next-date__btn" onClick={nextDate} />
            </div>
          </div>
          <div className="date-box__info">
            <div className="info-box__group">
              <div className="info-box__cells">
                <div className="info-cell">
                  <span className="info-cell__prop info-cell__prop__date">
                    Date:
                  </span>
                </div>
                <div className="info-cell">
                  <span className="info-cell__value info-cell__value__date">{`${
                    dateStates.year
                  }-${dateStates.month + 1}-${dateStates.day}`}</span>
                </div>
              </div>
              <div className="info-box__cells">
                <div className="info-cell">
                  <span className="info-cell__prop info-cell__prop__year">
                    Year:
                  </span>
                </div>
                <div className="info-cell">
                  <span className="info-cell__value info-cell__value__year">
                    {dateStates.year}
                  </span>
                </div>
              </div>
              <div className="info-box__cells">
                <div className="info-cell">
                  <span className="info-cell__prop info-cell__prop__month">
                    Month:
                  </span>
                </div>
                <div className="info-cell">
                  <span className="info-cell__value info-cell__value__month">
                    {dateStates.months[dateStates.month]}
                  </span>
                </div>
              </div>
              <div className="info-box__cells">
                <div className="info-cell">
                  <span className="info-cell__prop info-cell__prop__day">
                    Day:
                  </span>
                </div>
                <div className="info-cell">
                  <span className="info-cell__value info-cell__value__day">
                    {dateStates.day}
                    ,&nbsp;
                    {
                      daysOfWeek[
                        new Date(
                          dateStates.year,
                          dateStates.month,
                          dateStates.day
                        ).getDay()
                      ]
                    }
                  </span>
                </div>
              </div>
              <div className="info-box__cells">
                <div className="info-cell">
                  <span className="info-cell__prop info-cell__prop__week">
                    Week:
                  </span>
                </div>
                <div className="info-cell">
                  <span className="info-cell__value info-cell__value__week">
                    {moment(
                      new Date(
                        dateStates.year,
                        dateStates.month,
                        dateStates.day
                      )
                    ).isoWeek()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="time-box">
          <div className="time-box__start">
            <div className="time-box__hours time-box__inputs">
              <div className="time-box__hours--up" onClick={hoursStartUp}>
                ^
              </div>
              <input
                name="hour_start"
                type="text"
                value={time.hourStart}
                readOnly
              />
              <div className="time-box__hours--down" onClick={hoursStartDown}>
                ^
              </div>
            </div>
            <span className="time-seperator">:</span>
            <div className="time-box__minutes time-box__inputs">
              <div className="time-box__minutes--up" onClick={minutesStartUp}>
                ^
              </div>
              <input
                name="minutes_start"
                type="text"
                value={time.minutesStart}
                readOnly
              />
              <div
                className="time-box__minutes--down"
                onClick={minutesStartDown}
              >
                ^
              </div>
            </div>
          </div>
          <div className="time-box__end">
            <div className="time-box__hours time-box__inputs">
              <div className="time-box__hours--up" onClick={hoursEndUp}>
                ^
              </div>
              <input
                name="hour_end"
                type="text"
                value={time.hourEnd}
                readOnly
              />
              <div className="time-box__hours--down" onClick={hoursEndDown}>
                ^
              </div>
            </div>
            <span className="time-seperator">:</span>
            <div className="time-box__minutes time-box__inputs">
              <div className="time-box__minutes--up" onClick={minutesEndUp}>
                ^
              </div>
              <input
                name="minutes_end"
                type="text"
                value={time.minutesEnd}
                readOnly
              />
              <div className="time-box__minutes--down" onClick={minutesEndDown}>
                ^
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="break-deduction">
        <div className="break-deduction__text">
          <span>Break Deduction:</span>
        </div>
        <div className="break-deduction__options">
          <div className="break-deduction__options--down" onClick={deductDown}>
            &lt;
          </div>
          <input name="deduct" type="text" value={time.deductBreak} readOnly />
          <div className="break-deduction__options--up" onClick={deductUp}>
            &gt;
          </div>
        </div>
      </div>
      <div className="shift-info">
        <div className="shift-hours">
          <span className="shift-hours__title">
            Total Hours:{" "}
            <input
              className={`${
                formErrors.shiftHours ? "invalid-inputs" : "shift-hours__count"
              }`}
              name="shift_hours"
              value={totalHours}
              readOnly
            />
          </span>
          <div className="errors-container">
            {formErrors.shiftHours && (
              <span className="help inavild">{formErrors.shiftHours}</span>
            )}
          </div>
        </div>
        <div className="shift-wage">
          <span className="shift-wage__title">
            Total Pay: &nbsp; &#163;
            <input
              className="shift-wage__count"
              name="shift_wage"
              value={totalPay}
              readOnly
            />
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="add-shift__container">
      {errMsg && <AlertError message={errMsg} action={closeAlert} />}
      {msg && <AlertSuccess message={msg} action={closeAlert} />}
      <form className="add-shift__form" onSubmit={handleSubmit}>
        {shiftBody}
        <button
          type="submit"
          className="add-shift__form--submit form-submit__btn"
        >
          Add Shift
        </button>
      </form>
    </div>
  );
};

export default AddShift;
