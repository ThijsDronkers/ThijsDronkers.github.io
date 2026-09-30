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