import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Link  } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { server } from '../../../bff/server';
import { Input, H2, Button, ErrorSReg } from '../../../components';
import { SetUser } from '../../../actions';
import styled from 'styled-components';
import { selectUserRole } from '../../selectors';
import { useResetForm } from '../../../hooks';
import { ROLE } from '../../../constants';

const authFormSchema = yup.object().shape({
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
});

const AuthorizationContainer = ({ className }) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
		},
		resolver: yupResolver(authFormSchema),
	});

	const [serverError, setServerError] = useState(null);
	const dispatch = useDispatch();
	const roleId = useSelector(selectUserRole);
	useResetForm(reset);
	const StyledLink = styled(Link)`
		color: #2c282d;
		font-weight: 700;
		text-decoration: none;
	`;

	const onSubmit = ({ login, password }) => {
		server.authorize(login, password).then(({ error, res }) => {
			if (error) {
				setServerError(`Ошибка запроса ${error}`);
				return;
			}
			dispatch(SetUser(res));
		});
	};
	const formError = errors?.login?.message || errors?.password?.message;
	const errorMessage = formError || serverError;

	if (roleId !== ROLE.GUEST) {
		return <Navigate to="/"></Navigate>;
	}

	return (
		<div className={className}>
			<H2>Авторизация</H2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input
					type="text"
					placeholder="Логин"
					{...register('login', {
						onChange: () => setServerError(null),
					})}
				/>
				<Input
					type="text"
					placeholder="Пароль"
					{...register('password', {
						onChange: () => setServerError(null),
					})}
				/>
				<Button type="submit" disabled={!!formError}>
					Авторизоваться
				</Button>

				{errorMessage && <ErrorSReg>{errorMessage}</ErrorSReg>}
			</form>
			<div>
				<span>Еще нет аккаунта? </span>
				<StyledLink to="/register">Зарегистрируйтесь!</StyledLink>
			</div>
		</div>
	);
};
export const Authorization = styled(AuthorizationContainer)`
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
