const searchBtn = document.getElementById('search-btn')
const searchInput = document.getElementById('search-input')
const omdb_key = process.env.OMDB_API_KEY
let moviesWithFullData = []

searchBtn.addEventListener('click', handleSearchClick)

async function handleSearchClick(){
    const res = await fetch(`https://www.omdbapi.com/?apikey=${omdb_key}&s=${searchInput.value}&type=movie`)
    const data = await res.json()
    if(data.Response === 'False'){
        searchInput.value = 'Searching something with no data'
        document.querySelector('main').innerHTML = `
            <div class="no-movies-found-div">
                <p>Unable to find what you’re looking for. Please try another search.</p>
            </div>
        `  
    }else{
        const movies = data.Search
        moviesWithFullData = await getMoviesWithFullData(movies)  
        renderMovies(moviesWithFullData)
        removeTrailingDivider()
        addMovieToWatchList()        
    }  
}

function addMovieToWatchList(){
    document.addEventListener('click', (e) => {
        const movieId = e.target.dataset.addMovieId
        
        if(movieId){
            if (localStorage.getItem(`movie-${movieId}`)) {
                alert('Movie already in your Watchlist.')
            }else{
                const movie = moviesWithFullData.find(m => m.id == movieId)  
                localStorage.setItem(`movie-${movieId}`, JSON.stringify(movie))
                document.getElementById(`${movieId}`).innerHTML = `<i class="fa-solid fa-circle-check" data-add-movie-id="${movieId}"></i> Watchlist`          
            }
        }
    })
}

async function getMoviesWithFullData(movies) {
    const moviePromises = movies.map(async (movie) => {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${omdb_key}&i=${movie.imdbID}`);
        const data = await res.json();
        const { Title, Runtime, Genre, Plot, Poster, imdbID, imdbRating } = data;
        return {
            id: imdbID,
            title: Title,
            duration: Runtime,
            genre: Genre,
            plot: Plot,
            poster: Poster,
            rating: imdbRating
        };
    });

    return Promise.all(moviePromises);
}

function renderMovies(movies){
    document.querySelector('main').innerHTML = `
        <div id="movies" class="movies content-wrapper">
        </div>
    `
    
    document.getElementById('movies').innerHTML = movies.map((movie) => {
        const {
            id,
            title,
            duration,
            genre,
            plot,
            rating,
            poster: originalPoster
        } = movie;
        
        const poster = originalPoster === 'N/A'
            ? '/images/poster-placeholder.png'
            : originalPoster;
            
        const buttonHtml = localStorage.getItem(`movie-${id}`) 
            ? `<i class="fa-solid fa-circle-check" data-add-movie-id="${id}"></i>Watchlist`
            : `<i class="fa-solid fa-circle-plus" data-add-movie-id="${id}"></i>Watchlist`
        
        return `
            <div class="movie">
                <img class="poster" src=${poster}>
                <div class="movie-header">
                    <div class="title-add">
                        <h2>${title}</h2>
                        <button id="${id}" class="add-to-watchlist-btn" data-add-movie-id="${id}">${buttonHtml}</button>
                    </div>
                    <div class="duration-genre-rating">
                        <p class="duration">${duration}</p>
                        <p class="genre">${genre}</p>
                        <p class="rating"><i class="fa-solid fa-star"></i>  ${rating}</p>                                   
                    </div>
                    <p class="plot">${plot}</p>     
                </div>
            </div>
            <div class="movie-divider"></div>
        `
    }).join('')
}


function removeTrailingDivider(){
    const dividers = document.querySelectorAll('.movie-divider')
    const movies = document.getElementById('movies')
    
    if (dividers.length > 0){
        dividers[dividers.length - 1].style.display = 'none'
        movies.style.marginBottom = '3.75em'
    }
}