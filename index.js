const projects = [
	{ title: "Project 1", description: "A - Dit is project 1." },
	{ title: "Project 2", description: "B - Dit is project 2." },
	{ title: "Project 3", description: "C - Dit is project 3." },
	{ title: "Project 4", description: "D - Dit is project 4." }
];

const projectList = document.querySelector("#project-list");
const projectSort = document.querySelector("#project-sort");

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
	const fields = [
		{
			input: contactForm.elements.name,
			error: document.querySelector("#contact-name-error"),
			label: "Naam",
			message: "Vul je naam in. Dit veld is verplicht."
		},
		{
			input: contactForm.elements.email,
			error: document.querySelector("#contact-email-error"),
			label: "E-mailadres",
			message: "Vul een geldig e-mailadres in, bijvoorbeeld naam@voorbeeld.nl."
		},
		{
			input: contactForm.elements.message,
			error: document.querySelector("#contact-message-error"),
			label: "Bericht",
			message: "Schrijf je bericht. Dit veld is verplicht."
		}
	];
	const errorSummary = document.querySelector("#contact-error-summary");
	const formStatus = document.querySelector("#contact-form-status");
	let hasSubmitted = false;

	const getError = (field) => {
		if (!field.input.value.trim()) return field.message;
		if (field.input.type === "email" && !field.input.validity.valid) {
			return "Vul een geldig e-mailadres in, bijvoorbeeld naam@voorbeeld.nl.";
		}
		return "";
	};

	const updateValidation = () => {
		const invalidFields = [];
		fields.forEach((field) => {
			const message = getError(field);
			field.error.textContent = message;
			field.input.setAttribute("aria-invalid", String(Boolean(message)));
			if (message) invalidFields.push({ ...field, message });
		});

		if (invalidFields.length) {
			const heading = document.createElement("h3");
			heading.textContent = "Controleer de volgende velden:";
			const list = document.createElement("ul");
			invalidFields.forEach((field) => {
				const item = document.createElement("li");
				const link = document.createElement("a");
				link.href = `#${field.input.id}`;
				link.textContent = `${field.label}: ${field.message}`;
				item.append(link);
				list.append(item);
			});
			errorSummary.replaceChildren(heading, list);
			errorSummary.hidden = false;
		} else {
			errorSummary.replaceChildren();
			errorSummary.hidden = true;
		}
		return invalidFields;
	};

	contactForm.noValidate = true;
	contactForm.addEventListener("submit", (event) => {
		event.preventDefault();
		hasSubmitted = true;
		formStatus.textContent = "";
		const invalidFields = updateValidation();
		if (invalidFields.length) {
			errorSummary.focus();
			return;
		}
		formStatus.textContent = "Je gegevens zijn geldig, maar het formulier is niet verzonden. Er is nog geen verzendfunctie ingesteld.";
	});

	fields.forEach(({ input }) => {
		input.addEventListener("input", () => {
			if (hasSubmitted) updateValidation();
		});
	});
}

if (projectList) {
	const renderProjects = () => {
		const sortedProjects = [...projects];
		if (projectSort?.value === "az" || projectSort?.value === "za") {
			const sortDirection = projectSort.value === "az" ? 1 : -1;
			sortedProjects.sort((first, second) =>
				sortDirection * first.title.localeCompare(second.title, "nl")
			);
		}

		projectList.replaceChildren();
		sortedProjects.forEach((project) => {
			const article = document.createElement("article");
			article.className = "project-box";

			const title = document.createElement("h3");
			title.textContent = project.title;

			const description = document.createElement("p");
			description.textContent = project.description;

			article.append(title, description);
			projectList.append(article);
		});
	};

	projectSort?.addEventListener("change", renderProjects);
	renderProjects();
}

document.querySelectorAll(".blog-box").forEach((blog, index) => {
	const title = blog.querySelector("h3");
	if (!title) return;

	const content = document.createElement("div");
	content.id = `blog-content-${index + 1}`;

	while (title.nextSibling) {
		content.append(title.nextSibling);
	}

	const toggle = document.createElement("button");
	toggle.type = "button";
	toggle.className = "blog-toggle";
	toggle.textContent = "Toon blog";
	toggle.setAttribute("aria-expanded", "false");
	toggle.setAttribute("aria-controls", content.id);
	content.hidden = true;

	title.after(toggle, content);

	toggle.addEventListener("click", () => {
		const isExpanded = toggle.getAttribute("aria-expanded") === "true";
		toggle.setAttribute("aria-expanded", String(!isExpanded));
		toggle.textContent = isExpanded ? "Toon blog" : "Verberg blog";
		content.hidden = isExpanded;
	});
});

const weatherForm = document.querySelector("#weather-form");

if (weatherForm) {
	const weatherPanel = document.querySelector("#weather-panel");
	const weatherCity = document.querySelector("#weather-city");
	const weatherStatus = document.querySelector("#weather-status");
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
		weatherStatus.hidden = false;
		weatherStatus.textContent = `Weer voor ${city} ophalen...`;
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
			weatherStatus.textContent = `Actueel weer voor ${locationName}.`;
		} catch (error) {
			weatherStatus.hidden = true;
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
