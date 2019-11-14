import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  HashRouter,
  Redirect
} from "react-router-dom";

import "./assets/styles/scss/index.scss";
import "./assets/styles/scss/form.scss";

import Home from "./pages/Home";
import Dashboard from "./pages/Admin/Dashboard";
import MainNav from "./pages/MainNav";
import UserNav from "./pages/Admin/UserNav";
import NotFound from "./pages/NotFound";

import { FormProvider } from "./contexts/FormContext";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  const [authData, setAuthData] = useState(
    JSON.parse(localStorage.getItem("data")) || "undefined"
  );

  const checkSession = () => {
    const currentTime = new Date().getTime() / 1000;

    if (authData === null) {
      setAuthData({ ...authData, isAuth: false });
      return;
    }

    if (Math.floor(currentTime) > authData.expiryDate) {
      setAuthData({ ...authData, isAuth: false });
      localStorage.removeItem("data");
      return;
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthProvider>
      <FormProvider>
        {authData.isAuth ? <UserNav /> : <MainNav />}
        {!authData.isAuth && <Redirect to="/" />}
        <Switch>
          <Route
            path="/"
            exact
            component={!authData.isAuth ? Home : Dashboard}
          />
          <Route path="/auth" component={authData.isAuth ? Dashboard : Home} />
          <Route path="" component={NotFound} />
        </Switch>
      </FormProvider>
    </AuthProvider>
  );
};

export default App;
