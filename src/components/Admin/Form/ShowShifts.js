import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { FormContext } from '../../../contexts/FormContext';
import { DateContext } from '../../../contexts/DateContext';

const ShowShifts = props => {
    const [formState, setFormState] = useContext(FormContext);
    const [dateStates, setDateStates, queries, setQueries] = useContext(DateContext);

    if (!formState.showShiftsModal) return null;

    const closeModal = () => {
        setFormState({ ...formState, showShiftsModal: false });
        setQueries({ ...queries, clicked: false });
    };

    const redirectToAddShift = () => {
        setFormState({ ...formState, showShiftsModal: false });
        setQueries({ ...queries, clicked: false });
        setDateStates({ ...dateStates, year: queries.year, month: queries.month, day: queries.day });
    };

    let renderShifts = props.shifts.map(shift => (<div key={shift.id} className="shifts-modal__block">
        <span className="shifts-modal__block--info shifts-modal__block--name">{shift.name}:</span>
        <div className="shifts-modal__details">
            <span className="shifts-modal__block--info shifts-modal__block--time">{shift.shift_start.replace(/:[\d]+$/, '')} - {shift.shift_end.replace(/:[\d]+$/, '')}</span>
            <span className="shifts-modal__block--info shifts-modal__block--hours">{shift.shift_hours}h</span>
            <span className="shifts-modal__block--info shifts-modal__block--pay">&#163; {shift.shift_wage}</span>
            <NavLink to={`/auth/schedule/${shift.id}`} onClick={closeModal}>
                <div className="shifts-modal__edit--icon" />
            </NavLink>
        </div>
    </div>));

    let addShiftRedirect = <div className="add-shift__link">
        <NavLink to={'/auth/add-shift'} onClick={redirectToAddShift}>
            <span className="btn add-shift__link--btn">Add Shift</span>
        </NavLink>
    </div>

    return (
        <div className="shifts-modal__window">
            <div className="shifts-modal__backdrop" />
            <div className="shifts-modal__content">
                {addShiftRedirect}
                <div className="shifts-modal__content--list">
                    {renderShifts}
                </div>
                <span className="btn shifts-modal__btn--close" onClick={closeModal}>Close</span>
            </div>
        </div>
    );
};

export default ShowShifts;