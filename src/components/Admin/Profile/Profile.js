import React, { useContext, useState, useEffect } from 'react';

import { AuthContext } from '../../../contexts/AuthContext';
import { FormContext } from '../../../contexts/FormContext';

import ConfirmDeleteBox from './ConfirmDelete';

import '../../../assets/styles/scss/profile.scss';
import EditUser from '../Form/EditProfile';

import checkAuth from '../../../middleware/checkAuth';

const Profile = () => {
	const [ formState, setFormState ] = useContext(FormContext);
	const [ authState, setAuthState ] = useContext(AuthContext);

	const { checkSession } = checkAuth();
	const [ user, setUser ] = useState({});
	const [ count, setCount ] = useState(0);

	useEffect(() => {
		fetchUser();
		document.title = 'Dashboard | Profile';
	}, []);

	const urlGet = 'https://react-ems.herokuapp.com/auth/get-user';
	const optionsGet = {
		credentials: 'include',
		userId: authState.userId
	};

	const urlDelete = 'https://react-ems.herokuapp.com/auth/delete-user';
	const optionsDelete = {
		method: 'DELETE',
		credentials: 'include',
		userId: authState.userId
	};

	const fetchUser = async () => {
		setFormState({ ...formState, showLoading: true });

		try {
			const result = await fetch(urlGet, optionsGet);
			const data = await result.json();

			setTimeout(() => {
				setUser(data.user);
				setCount(data.numOfEmployees);
				setFormState({ ...formState, showLoading: false });
			}, 500);
		} catch (err) {
			console.log(err);
		}
	};

	const showEditBox = () => {
		checkSession();
		setFormState({ ...formState, showEditUser: true });
	};

	const showDeleteBox = () => {
		checkSession();
		setFormState({ ...formState, showDeleteAccount: true });
	};

	const cancelDelete = () => {
		setFormState({ ...formState, showDeleteAccount: false });
	};

	const deleteUser = async () => {
		try {
			const result = await fetch(urlDelete, optionsDelete);
			const data = await result.json();

			if (data.redirect) {
				setAuthState({ ...authState, isAuth: false });

				localStorage.removeItem('data');
				localStorage.removeItem('user');
				localStorage.removeItem('token');

				setFormState({ ...formState, showLoading: true });

				setTimeout(() => {
					location.reload();
				}, 1000);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const renderedProfile = (
		<div className="profile-card">
			<div className="profile-card__group">
				<div className="profile-card__cells">
					<div className="profile-card__cell">
						<span className="card-cell__title">Name:</span>
					</div>
					<div className="profile-card__cell">
						<span className="card-cell__name">{user.name}</span>
					</div>
				</div>
				<div className="profile-card__cells">
					<div className="profile-card__cell">
						<span className="card-cell__title">Company:</span>
					</div>
					<div className="profile-card__cell">
						<span className="card-cell__company">{user.company}</span>
					</div>
				</div>
				<div className="profile-card__cells">
					<div className="profile-card__cell">
						<span className="card-cell__title">E-Mail:</span>
					</div>
					<div className="profile-card__cell">
						<span className="card-cell__email">{user.email}</span>
					</div>
				</div>
				<div className="profile-card__cells">
					<div className="profile-card__cell">
						<span className="card-cell__title">Employee count:</span>
					</div>
					<div className="profile-card__cell">
						<span className="card-cell__count">{count}</span>
					</div>
				</div>
			</div>
			<div className="profile-buttons">
				<button className="profile-buttons__edit" onClick={showEditBox}>
					Edit Profile
				</button>
				<button className="profile-buttons__delete" onClick={showDeleteBox}>
					Delete Account
				</button>
			</div>
		</div>
	);

	return (
		<div className="profile-container">
			<EditUser user={user} />
			<ConfirmDeleteBox cancel={cancelDelete} delete={deleteUser} />
			{user.id && renderedProfile}
		</div>
	);
};

export default Profile;
