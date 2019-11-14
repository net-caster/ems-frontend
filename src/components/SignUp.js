import React, { useContext } from "react";

import { FormContext } from "../contexts/FormContext";
import { AuthContext } from "../contexts/AuthContext";

import useForm from "../hooks/useForm";

import signupValidator from "../middleware/signupValidator";

const SignUp = () => {
  const {
    handleChange,
    handleSubmit,
    formValues,
    formErrors,
    setFormErrors
  } = useForm(submit, signupValidator);
  const [formState, setFormState] = useContext(FormContext);
  const [authState, setAuthState] = useContext(AuthContext);

  if (!formState.showSignup) return null;

  const toggleForm = () => {
    if (!formState.showLogin) {
      setFormState({
        ...formState,
        showLogin: true,
        showSignup: false
      });
    }
  };

  const signupUrl = "https://react-ems.herokuapp.com/auth/signup";
  const signupOptions = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formValues)
  };

  const loginUrl = "https://react-ems.herokuapp.com/auth/login";
  const loginOptions = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formValues)
  };

  async function submit() {
    setFormState({ ...formState, showLoading: true });

    try {
      const request = await fetch(signupUrl, signupOptions);
      const response = await request.json();

      if (response.errorEmail) {
        setFormErrors({ ...formErrors, email: response.errorEmail });
        setFormState({ ...formState, showLoading: false });
        return;
      }

      if (response.redirect) {
        const loginReq = await fetch(loginUrl, loginOptions);
        const loginRes = await loginReq.json();

        localStorage.setItem("data", JSON.stringify(loginRes));

        setAuthState({
          ...authState,
          isAuth: loginRes.isAuth,
          userId: loginRes.user.id
        });

        location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="form-box">
      <div className="form-container">
        <div className="btn btn-login" onClick={toggleForm}>
          <span>Login >></span>
        </div>
        <span className="form-heading">Welcome to EMS Technologies LTD.</span>
        <span className="form-title">Sign Up</span>
        <form onSubmit={handleSubmit} className="form signup-form" noValidate>
          <div className="form-group">
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className={`signup-form__name ${formErrors.name && "invalid"}`}
              placeholder="Name"
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
              onChange={handleChange}
              className={`signup-form__email ${formErrors.email && "invalid"}`}
              placeholder="E-Mail Address"
              value={formValues.email || ""}
            />
          </div>
          <div className="errors-container">
            {formErrors.email && (
              <span className="help inavild">{formErrors.email}</span>
            )}
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className={`signup-form__password ${formErrors.password &&
                "invalid"}`}
              placeholder="Enter Password"
              value={formValues.password || ""}
            />
            <input
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              className={`signup-form__passwordconfirm ${formErrors.confirmPassword &&
                "invalid"}`}
              placeholder="Re-Enter Password"
              value={formValues.confirmPassword || ""}
            />
          </div>
          <div className="errors-container">
            {formErrors.password && (
              <span className="help inavild">{formErrors.password}</span>
            )}
            {formErrors.confirmPassword && (
              <span className="help inavild">{formErrors.confirmPassword}</span>
            )}
          </div>
          <span className="password-tip">
            Password must be at least 8 characters long.
          </span>
          <button type="submit" className="btn btn-submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
