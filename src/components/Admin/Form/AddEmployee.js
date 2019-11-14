import React, { useState, useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";

import useForm from "../../../hooks/useForm";
import addEmployeeValidator from "../../../middleware/addEmployeeValidator";

import { AuthContext } from "../../../contexts/AuthContext";
import { FormContext } from "../../../contexts/FormContext";

const AddEmployeeForm = () => {
  const { handleChange, handleSubmit, formValues, formErrors } = useForm(
    submitAdd,
    addEmployeeValidator
  );
  const [authState, setAuthState] = useContext(AuthContext);
  const [redirect, setRedirect] = useState(false);
  const [formState, setFormState] = useContext(FormContext);

  useEffect(() => {
    document.title = "Dashboard | Add Employee";
  }, []);

  const url = "https://react-ems.herokuapp.com/auth/add-employee";
  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formValues),
    userId: authState.userId
  };

  async function submitAdd() {
    setFormState({ ...formState, showLoading: true });

    try {
      const result = await fetch(url, options);
      const data = await result.json();

      setTimeout(() => {
        setRedirect(data.redirect);
        setFormState({ ...formState, showLoading: false });
      }, 750);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <form className="form employee-form" onSubmit={handleSubmit} noValidate>
      {redirect && <Redirect to="/auth/employees" />}
      <div className="employee-fields">
        <div className="form-group">
          <input
            type="text"
            name="name"
            className={`form-item__name ${formErrors.name && "invalid"}`}
            onChange={handleChange}
            placeholder="Employee Name"
            value={formValues.name || ""}
          />
        </div>
        <div className="errors-container">
          {formErrors.name && (
            <span className="help inavild">{formErrors.name}</span>
          )}
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            className="form-item__email"
            onChange={handleChange}
            placeholder="Employee E-Mail"
            value={formValues.email || ""}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="payRate"
            className={`form-item__payRate ${formErrors.payRate && "invalid"}`}
            onChange={handleChange}
            placeholder="Employee Wage"
            value={formValues.payRate || ""}
          />
        </div>
        <div className="errors-container">
          {formErrors.payRate && (
            <span className="help inavild">{formErrors.payRate}</span>
          )}
        </div>
      </div>
      <button className="item-form__btn" type="submit">
        Add
      </button>
    </form>
  );
};

export default AddEmployeeForm;
