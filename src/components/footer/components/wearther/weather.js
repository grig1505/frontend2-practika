import { useEffect, useState } from 'react';
import styled from 'styled-components';

const WeatherContainer = ({ className }) => {
	const [city, setCity] = useState('');
	const [temperature, setTemperature] = useState('');
	const [weatherDesc, setWeatherDesc] = useState('');
	useEffect(() => {
		fetch(
			'https://api.openweathermap.org/data/2.5/weather?lat=59.834576&lon=30.209908&units=metric&lang=ru&appid=493343746628d186bbfd20bde975117b',
		)
			.then((res) => res.json())
			.then(({ name, main, weather }) => {
				setCity(name);
				setTemperature(Math.round(main.temp));
				setWeatherDesc(weather[0].description);
			});
	}, []);
	return (
		<div className={className}>
			<div>
				{city},{' '}
				{new Date().toLocaleString('ru', { day: 'numeric', month: 'long' })}
			</div>

			<div>
				{temperature} градусов, {weatherDesc}
			</div>
		</div>
	);
};

export const Weather = styled(WeatherContainer)`
	display: flex;
	flex-direction: column;
	gap: 5px 0;
	font-weight: bold;
`;
