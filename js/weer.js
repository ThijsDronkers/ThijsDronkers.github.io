const weatherForm = document.querySelector("#weather-form");

if (weatherForm) {
	const weatherPanel = document.querySelector("#weather-panel");
	const weatherCity = document.querySelector("#weather-city");
	const weatherError = document.querySelector("#weather-error");
	const weatherRetry = document.querySelector("#weather-retry");
	const weatherResult = document.querySelector("#weather-result");
	const weatherCodeDescriptions = {
		0: "Onbewolkt",
		1: "Overwegend helder",
		2: "Half bewolkt",
		3: "Bewolkt",
		45: "Mistig",
		48: "Rijpmist",
		51: "Lichte motregen",
		53: "Motregen",
		55: "Zware motregen",
		56: "Lichte aanvriezende motregen",
		57: "Zware aanvriezende motregen",
		61: "Lichte regen",
		63: "Regen",
		65: "Zware regen",
		66: "Lichte aanvriezende regen",
		67: "Zware aanvriezende regen",
		71: "Lichte sneeuw",
		73: "Sneeuw",
		75: "Zware sneeuw",
		77: "Sneeuwkorrels",
		80: "Lichte regenbuien",
		81: "Regenbuien",
		82: "Zware regenbuien",
		85: "Lichte sneeuwbuien",
		86: "Zware sneeuwbuien",
		95: "Onweer",
		96: "Onweer met lichte hagel",
		99: "Onweer met zware hagel"
	};

	const loadWeather = async (city) => {
		weatherPanel.setAttribute("aria-busy", "true");
		weatherError.hidden = true;
		weatherRetry.hidden = true;
		weatherResult.hidden = true;

		try {
			const locationUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
			locationUrl.search = new URLSearchParams({
				name: city,
				count: "1",
				language: "nl",
				format: "json"
			});
			const locationResponse = await fetch(locationUrl);
			if (!locationResponse.ok) throw new Error("request-failed");

			const locationData = await locationResponse.json();
			const location = locationData.results?.[0];
			if (!location) throw new Error("location-not-found");

			const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
			forecastUrl.search = new URLSearchParams({
				latitude: String(location.latitude),
				longitude: String(location.longitude),
				current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
				temperature_unit: "celsius",
				wind_speed_unit: "kmh",
				timezone: "auto"
			});
			const forecastResponse = await fetch(forecastUrl);
			if (!forecastResponse.ok) throw new Error("request-failed");

			const forecastData = await forecastResponse.json();
			const current = forecastData.current;
			if (!current) throw new Error("invalid-response");

			const locationName = [location.name, location.admin1, location.country]
				.filter(Boolean)
				.join(", ");
			document.querySelector("#weather-location").textContent = locationName;
			document.querySelector("#weather-temperature").textContent = `${Math.round(current.temperature_2m)} \u00B0C`;
			document.querySelector("#weather-condition").textContent = weatherCodeDescriptions[current.weather_code] ?? "Weerconditie onbekend";
			document.querySelector("#weather-feels-like").textContent = `${Math.round(current.apparent_temperature)} \u00B0C`;
			document.querySelector("#weather-humidity").textContent = `${current.relative_humidity_2m}%`;
			document.querySelector("#weather-wind").textContent = `${Math.round(current.wind_speed_10m)} km/u`;
			weatherResult.hidden = false;
		} catch (error) {
			weatherError.textContent = error.message === "location-not-found"
				? `Ik kan "${city}" niet vinden. Controleer de spelling en probeer een andere plaatsnaam.`
				: "Het weer kon niet worden opgehaald. Controleer je internetverbinding en probeer het opnieuw.";
			weatherError.hidden = false;
			weatherRetry.hidden = false;
		} finally {
			weatherPanel.setAttribute("aria-busy", "false");
		}
	};

	weatherForm.addEventListener("submit", (event) => {
		event.preventDefault();
		loadWeather(weatherCity.value.trim());
	});
	weatherRetry.addEventListener("click", () => loadWeather(weatherCity.value.trim()));
	loadWeather(weatherCity.value.trim());
}