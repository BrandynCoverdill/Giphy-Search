import 'normalize.css';
import './styles.css';

// Normally, we need to encode our API keys, but going along with The Odin Project,
// this will be learned at a later point in time.
const apiKey = 'VlDBQdZvUBcEKIWa07x8xnguzSCHYyke';

// Global variables
const input = document.querySelector('#search');
const submitBtn = document.querySelector('button[type="submit"]');
const recentSearches = document.querySelector('.search-history');
const inputError = document.querySelector('input + span');
const gifContainer = document.querySelector('.gif-container');

// Focus on the input when page loads
input.focus();

/**
 * Capture user input and do the following:
 * - Put the user input in their recent searches
 * - Fetch api for gifs
 * - Display those gifs in the gif container
 * - Refocus on the input
 */
submitBtn.addEventListener('click', (e) => {
	e.preventDefault();

	// Put the user input in their recent searches
	if (input.validity.valid) {
		inputError.classList.remove('active');
		const inputValue = document.createElement('p');
		inputValue.textContent = input.value;
		recentSearches.prepend(inputValue);

		// Have recent searches clickable to research the same gifs
		document.querySelectorAll('.search-history > p').forEach((el) => {
			el.addEventListener('click', (e) => {
				e.preventDefault();

				// Populate input
				input.value = el.textContent;

				// Make gif container empty
				gifContainer.textContent = '';

				// fetch data
				fetchData(input.value);

				// Highlight and select input
				input.select();
				input.focus();
			});
		});

		// Clear gif container
		gifContainer.textContent = '';

		// fetch api data
		fetchData(input.value);
	} else {
		inputError.textContent = 'Please enter a search query.';
		inputError.classList.add('active');
	}

	// highlight and refocus on the input
	input.select();
	input.focus();
});

/**
 * Fetches the Giphy API for gifs and returns an array
 */
async function fetchData(value) {
	try {
		// fetch api data
		const response = await fetch(
			`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${input.value}`,
			{
				mode: 'cors',
			}
		);
		// Convert object into a promise
		const gifData = await response.json();

		// If response came back with zero data
		if (gifData.data[0] === undefined) {
			const nothingToDisplay = document.createElement('p');
			nothingToDisplay.textContent =
				'Sorry, the term you have searched came up empty. :(';
			gifContainer.appendChild(nothingToDisplay);
		} else {
			// Data successfully came back
			gifData.data.forEach((gif) => {
				const gifUrl = document.createElement('a');
				const gifImage = document.createElement('img');
				gifUrl.setAttribute('href', gif.images.original.url);
				gifImage.src = gif.images.original.url;
				gifUrl.appendChild(gifImage);
				gifContainer.appendChild(gifUrl);
			});
		}
	} catch (err) {
		const error = document.createElement('p');
		error.textContent = err;
		gifContainer.appendChild(error);
	}
}
