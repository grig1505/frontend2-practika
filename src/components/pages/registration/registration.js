import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { server } from '../../../bff/server';
import { Input, H2, Button, ErrorSReg } from '../../../components';
import { SetUser } from '../../../actions';
import { useResetForm } from '../../../hooks';
import styled from 'styled-components';
import { selectUserRole } from '../../selectors';
import { ROLE } from '../../../constants';

const regFormSchema = yup.object().shape({
	login: yup
		.string()
		.required('Заполните логин')
		.matches(/^\w+$/, 'Неверный логин. Допускаются только буквы и цифры')
		.min(3, 'Неверный логин. Минимум 3 символов')
		.max(15, 'Неверный логин. Масимум 15 символов'),

	password: yup
		.string()
		.required('Заполните пароль')
		.matches(/^[\w#%]+$/, 'Неверный пароль. Недоступные символы')
		.min(6, 'Неверный пароль. Минимум 6 символов')
		.max(25, 'Неверный пароль. Масимум 25 символов'),
	passcheck: yup
		.string()
		.required('Заполните повтор пароля')
		.oneOf([yup.ref('password'), null], 'Пароли  не совпадают'),
});

const RegistrationContainer = ({ className }) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
			passcheck: '',
		},
		resolver: yupResolver(regFormSchema),
	});
	useResetForm(reset);
	const [serverError, setServerError] = useState(null);
	const dispatch = useDispatch();
	const roleId = useSelector(selectUserRole);

	const onSubmit = ({ login, password }) => {
		server.register(login, password).then(({ error, res }) => {
			if (error) {
				setServerError(`Ошибка запроса ${error}`);
				return;
			}
			dispatch(SetUser(res));
		});
	};
	const formError =
		errors?.login?.message || errors?.password?.message || errors?.passcheck?.message;
	const errorMessage = formError || serverError;

	if (roleId !== ROLE.GUEST) {
		return <Navigate to="/" />;
	}

	return (
		<div className={className}>
			<H2>Регистрация</H2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					type="text"
					placeholder="Логин"
					{...register('login', {
						onChange: () => setServerError(null),
					})}
				/>
				<Input
					type="password"
					placeholder="Пароль"
					{...register('password', {
						onChange: () => setServerError(null),
					})}
				/>
				<Input
					type="password"
					placeholder="Повтор пароля"
					{...register('passcheck', {
						onChange: () => setServerError(null),
					})}
				/>
				<Button type="submit" disabled={!!formError}>
					Зарегистрироваться
				</Button>

				{errorMessage && <ErrorSReg>{errorMessage}</ErrorSReg>}
			</form>
		</div>
	);
};
export const Registration = styled(RegistrationContainer)`
	display: flex;
	flex-direction: column;
	align-content: center;
	justify-content: center;
	margin: 0 auto;
	width: fit-content;
	text-align: center;
	gap: 10px 0px;
	& > form {
		display: flex;
		flex-direction: column;
		gap: 10px 0;
		width: 260px;
		margin: 0 auto;
	}
	& > div > span {
		margin-top: 40px;
		color: rgba(36, 36, 36, 0.6);
		text-align: center;
	}
`;
