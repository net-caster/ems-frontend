import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../contexts/AuthContext";

const useShifts = () => {
  const [authState] = useContext(AuthContext);

  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    fetchAllShifts();
  }, []);

  const url = "https://react-ems.herokuapp.com/auth/get-shifts";
  const options = {
    credentials: "include",
    userId: authState.userId
  };

  const fetchAllShifts = async () => {
    try {
      const result = await fetch(url, options);
      const data = await result.json();

      setShifts(data.shifts);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    shifts
  };
};

export default useShifts;
