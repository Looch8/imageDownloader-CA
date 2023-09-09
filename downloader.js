// syncrhonous library foir download file IO
// check if directory exists
const fs = require("node:fs");

// Asyncrhonous, making a directory can take time
// but we do want to wait for this to finish
const { mkdir } = require("node:fs/promises");

// Streaming data, safer than traditional file saving/downloading/etc
// this is syncrhonous, so we wait and it IS blocking
const { readable } = require("node:stream");

// Wait for streaming to finish, this can take time but should be a promise
// but shouldnt be blokcing so it is a promise instead of async
const { finished } = require("node:stream/promises");

// Node file and direcotry path helper system
const path = require("node:path");

function downloadPokemonPicture(targetId = getRandomPokemonId()) {}

// Generate a random number or use a user-provided number
function getRandomPokemonId() {
	return Math.floor(Math.random() * 1010) + 1;
}

// retrieve pokmon data for that number
// retrieve the image url from the pokemon data
async function getPokemonPictureUrl(targetId = getRandomPokemonId()) {
	// Retieve the API data
	let response = await fetch(
		`https://pokeapi.co/api/v2/pokemon/${targetId}`
	).catch((error) => {
		throw new Error("API failure");
	});

	if (response.status == "404") {
		throw new Error("API did not have data for the requested ID.");
	}

	// Convert reponse into usable JSON
	let data = await response.json().catch((error) => {
		throw new Error("API did not return valid JSON");
	});

	let imageUrl = data.sprites.other["official-artwork"].front_default;
}

// download the image and save it to computer
// return the download image's file path
async function savePokemonPictureToDisk(
	targetUrl,
	targetDownloadFilename,
	targetDownloadDirectory = "."
) {
	let imageData = await fetch(targetUrl).catch((error) => {
		throw new Error("Image failed to download");
	});

	if (!fs.existsSync(targetDownloadDirectory)) {
		await mkdir(targetDownloadDirectory);
	}

	let fullFileDestination = path.join(
		targetDownloadDirectory,
		targetDownloadFilename
	);

	let fileDownloadStream = fs.createWriteStream(fullFileDestination);

	await finished(Readable.fromWeb(imageData.body))
		.pipe(fileDownloadStream)
		.catch((error) => {
			throw new Error("Image failed to save to disk");
		});
}

module.exports = {
	downloadPokemonPicture,
	savePokemonPictureToDisk,
	getPokemonPictureUrl,
	getRandomPokemonId,
};
