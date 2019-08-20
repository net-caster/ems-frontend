import React, { useContext } from 'react';

import { FormContext } from '../../../contexts/FormContext';

const ConfirmDeleteBox = (props) => {
	const [ formState, setFormState ] = useContext(FormContext);

	if (!formState.showDeleteAccount) return null;

	return (
		<div className="modal-window">
			<div className="modal-backdrop" />
			<div className="confirmDelete-modal">
				<span>Are you sure you wish to delete your account?</span>
				<div className="modal-buttons">
					<button className="delete-employee__button" onClick={props.delete}>
						Delete
					</button>
					<button className="cancel-delete__button" onClick={props.cancel}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmDeleteBox;
