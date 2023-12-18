const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=1712fdb06dc130f0755cb6c3ff82c5c7&page=1'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=1712fdb06dc130f0755cb6c3ff82c5c7&page=1&query=';

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')


// get initial movies
getMovies(API_URL);

async function getMovies(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.results) {
            showMovies(data.results);
        } else {
            console.error('No results found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function showMovies(movies) {
    main.innerHTML = '';

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview } = movie;

        // Check if the poster_path is truthy (not null or undefined)
        if (poster_path) {
            const imageSrc = IMG_PATH + poster_path;

            // Create an image element
            const imgElement = document.createElement('img');
            imgElement.src = imageSrc;
            imgElement.alt = title;

            // Check if the image can be loaded successfully
            imgElement.onerror = () => {
                console.error(`Error loading image for ${title}`);
                imgElement.remove(); // Remove the img element if the image cannot be loaded
            };

            // Create the rest of the movie elements
            const movieEl = document.createElement('div');
            movieEl.classList.add('movie');

            movieEl.innerHTML = `
                <div class="movie-info">
                    <h3>${title}</h3>
                    <span class="${getClassByRate(vote_average)}">${vote_average}</span>
                </div>
                <div class="overview">
                    <h3>Overview</h3>
                    ${overview}
                </div>
            `;

            // Append the img element only if it was successfully created
            movieEl.appendChild(imgElement);

            // Append the movie element to the main container
            main.appendChild(movieEl);
        } else {
            console.error(`Invalid poster_path for ${title}`);
        }
    });
}

function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);

        search.value = '';
    } else {
        window.location.reload();
    }
});
