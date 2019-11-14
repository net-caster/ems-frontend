import React, { useEffect, useContext } from "react";
import { Switch, Route } from "react-router-dom";

import "../../assets/styles/scss/dashboard.scss";
import "../../assets/styles/scss/form.scss";

import Welcome from "../../components/Welcome";
import Profile from "../../components/Admin/Profile/Profile";
import Employees from "../../components/Admin/Employees/Employees";
import EmployeeDetails from "../../components/Admin/Employees/EmployeeDetails";
import MonthCalendar from "../../components/Admin/Schedule/MonthCalendar";
import ScheduleWeek from "../../components/Admin/Schedule/ScheduleWeek";
import EditShift from "../../components/Admin/Form/EditShift";
import AddEmployee from "../../components/Admin/Form/AddEmployee";
import AddShift from "../../components/Admin/Form/AddShift";
import DashNav from "./DashNav";
import Loading from "../../components/Loading";
import NotFound from "../NotFound";

import { AuthContext } from "../../contexts/AuthContext";
import { DateProvider } from "../../contexts/DateContext";

const Dashboard = () => {
  const [authState, setAuthState] = useContext(AuthContext);

  const data = JSON.parse(localStorage.getItem("data"));

  useEffect(() => {
    setAuthState({
      ...authState,
      isAuth: data.isAuth,
      userId: data.user.id,
      expiryDate: data.expiryDate
    });

    if (localStorage.getItem("redirect")) {
      location.href = "#/auth";
      localStorage.removeItem("redirect");
    }

    document.title = "Dashboard";
  }, []);

  return (
    <DateProvider>
      <div className="dashboard-container">
        <Loading />
        <DashNav />
        <Switch>
          <Route
            path="/auth"
            exact
            component={authState.isAuth ? Welcome : null}
          />
          <Route
            path="/auth/profile"
            component={authState.isAuth ? Profile : null}
          />
          <Route
            path="/auth/employees"
            exact
            component={authState.isAuth ? Employees : null}
          />
          <Route
            path="/auth/employees/:employeeId"
            component={authState.isAuth ? EmployeeDetails : null}
          />
          <Route
            path="/auth/add-employee"
            component={authState.isAuth ? AddEmployee : null}
          />
          <Route
            path="/auth/schedule"
            exact
            component={authState.isAuth ? ScheduleWeek : null}
          />
          <Route
            path="/auth/schedule/:shiftId"
            component={authState.isAuth ? EditShift : null}
          />
          <Route
            path="/auth/add-shift"
            component={authState.isAuth ? AddShift : null}
          />
          <Route
            path="/auth/calendar"
            component={authState.isAuth ? MonthCalendar : null}
          />
          <Route path="/auth/not-found" component={NotFound} />
        </Switch>
      </div>
    </DateProvider>
  );
};

export default Dashboard;
