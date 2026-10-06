
async function fetchData() {
	const pokemonName = document.getElementById("pokemonName").value.trim().toLowerCase();
	const pokemonError = document.getElementById("pokemonError");
	const pokemonSprite = document.getElementById("pokemonSprite");
	pokemonError.textContent = "";

	if (!pokemonName) {
		pokemonError.textContent = "Vul een Pokémonnaam in die wel bestaat.";
		return;
	}

	try {
		const response = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemonName)}`
		);

		if (response.status === 404) {
			pokemonError.textContent = "Deze Pokémon bestaat niet. Vul een naam in van een Pokémon die wel bestaat.";
			return;
		}

		if (!response.ok) {
			throw new Error(`PokéAPI gaf status ${response.status}`);
		}

		const data = await response.json();
		pokemonSprite.src = data.sprites.front_default;
		pokemonSprite.alt = `Afbeelding van ${pokemonName}`;
		pokemonSprite.style.display = "block";
	} catch (error) {
		console.error("Pokémon ophalen is mislukt:", error);
		pokemonError.textContent = "De Pokémon kon niet worden opgehaald. Controleer je internetverbinding en probeer het opnieuw.";
	}
}