import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../../contexts/AuthContext";
import { FormContext } from "../../../contexts/FormContext";

import AlertSuccess from "../../AlertSuccess";

import useTime from "../../../hooks/useTime";
import checkAuth from "../../../middleware/checkAuth";

const EditShift = ({ match }) => {
  const {
    time,
    setTime,
    totalPay,
    setTotalPay,
    totalHours,
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
  const { checkSession } = checkAuth();
  const [formState, setFormState] = useContext(FormContext);
  const [authState] = useContext(AuthContext);
  const [formValues, setFormValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workShift, setWorkShift] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [redirect, setRedirect] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchShift();
  }, []);

  useEffect(() => {
    setTotalPay(
      parseFloat(
        Math.round(workShift.payRate * totalHours * 100) / 100
      ).toFixed(2)
    );
  }, [totalHours, time]);

  useEffect(() => {
    document.title = `Shift for ${workShift.name}`;
  }, [workShift]);

  useEffect(() => {
    setFormValues({
      ...formValues,
      hourStart: time.hourStart.toString(),
      minutesStart: time.minutesStart.toString(),
      hourEnd: time.hourEnd.toString(),
      minutesEnd: time.minutesEnd.toString(),
      shiftHours: totalHours,
      shiftWage: parseFloat(totalPay),
      deduct: parseInt(time.deductBreak)
    });
  }, [time, totalPay]);

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submitEditShift();
    }
  }, [formErrors, isSubmitting]);

  const urlGet = `https://react-ems.herokuapp.com/auth/get-shift/${match.params.shiftId}`;
  const optionsGet = {
    credentials: "include",
    userId: authState.userId
  };

  const urlPut = `https://react-ems.herokuapp.com/auth/edit-shift/${match.params.shiftId}`;
  const optionsPut = {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formValues)
  };

  const urlDelete = `https://react-ems.herokuapp.com/auth/delete-shift/${match.params.shiftId}`;
  const optionsDelete = {
    method: "DELETE",
    credentials: "include"
  };

  const fetchShift = async () => {
    setFormState({ ...formState, showLoading: true });

    try {
      const result = await fetch(urlGet, optionsGet);
      const data = await result.json();

      setTimeout(() => {
        setWorkShift(data.workShift);

        const {
          shift_start,
          shift_end,
          break_length,
          name,
          date
        } = data.workShift;

        setTime({
          ...time,
          hourStart: shift_start.split(":")[0],
          minutesStart: shift_start.split(":")[1],
          hourEnd: shift_end.split(":")[0],
          minutesEnd: shift_end.split(":")[1],
          deductBreak: break_length === null ? "00" : break_length
        });
        setFormState({ ...formState, showLoading: false });
      }, 600);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const submitEditShift = async () => {
    try {
      const result = await fetch(urlPut, optionsPut);
      const data = await result.json();

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

    checkSession();

    setIsSubmitting(true);

    if (totalHours === 0) {
      setFormErrors({
        ...formErrors,
        totalHours: "Total hours must not be 0!"
      });
    } else {
      setFormErrors({});
    }
  };

  const deleteShift = async () => {
    try {
      const result = await fetch(urlDelete, optionsDelete);
      const data = await result.json();

      if (data.redirect && data.delMsg) {
        setFormState({ ...formState, showAlertSuccess: true });
        setRedirect(data.redirect);
        setMsg(data.delMsg);
        return;
      }

      setMsg(data.msg);
    } catch (err) {
      console.log(err);
    }
  };

  const closeAlert = () => {
    setFormState({
      ...formState,
      showAlertError: false,
      showAlertSuccess: false
    });

    if (redirect) {
      location.href = "#/auth/schedule";
    }
  };

  const editFormBody = (
    <div className="edit-shift__form__body">
      <h1 className="edit-shift__title">{workShift.name}</h1>
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
            <div className="time-box__minutes--down" onClick={minutesStartDown}>
              ^
            </div>
          </div>
        </div>
        <div className="time-box__end">
          <div className="time-box__hours time-box__inputs">
            <div className="time-box__hours--up" onClick={hoursEndUp}>
              ^
            </div>
            <input name="hour_end" type="text" value={time.hourEnd} readOnly />
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
                formErrors.totalHours ? "invalid-inputs" : "shift-hours__count"
              }`}
              name="shift_hours"
              value={totalHours}
              readOnly
            />
          </span>
          <div className="errors-container">
            {formErrors.totalHours && (
              <span className="help inavild">{formErrors.totalHours}</span>
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

  const editForm = (
    <form onSubmit={handleSubmit} className="edit-shift__form">
      {editFormBody}
      <div className="form-btns">
        <button
          type="submit"
          className="edit-shift__form--submit form-submit__btn"
        >
          Edit Shift
        </button>
        <button
          className="shift-delete__btn form-submit__btn"
          onClick={deleteShift}
        >
          Delete Shift
        </button>
      </div>
    </form>
  );

  return (
    <div className="edit-shift__container">
      {msg && <AlertSuccess message={msg} action={closeAlert} />}
      {workShift.id && editForm}
    </div>
  );
};

export default EditShift;
