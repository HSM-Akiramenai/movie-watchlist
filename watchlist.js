const mainEl = document.querySelector('main')
const movies = []

document.addEventListener('click', handleRemoveBtnClick)

getMoviesFromLS()

function handleRemoveBtnClick(e){
    const movieId = e.target.dataset.removeMovieId
    
    if(movieId){
        localStorage.removeItem(`movie-${movieId}`)
        movies.length = 0
        getMoviesFromLS()
    }
}

function getMoviesFromLS(){
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('movie-')) {  
            movies.push(JSON.parse(localStorage.getItem(key))); 
        }
    }
    
    if(movies.length > 0){  
        renderWatchlistMovies(movies)
    }else{
        mainEl.innerHTML = `
            <div class="empty-watchlist-container">
                <p class="empty-watchlist-text">Your watchlist is looking a little empty...</p>
                <nav class="empty-watchlist-nav">
                    <i class="fa-solid fa-circle-plus"></i>
                    <a class="empty-watchlist-link" href="/index.html">Let’s add some movies!</a>
                </nav>
            </div>
        `
    }
}


function renderWatchlistMovies(movies){
    mainEl.innerHTML = `
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
            poster,
            rating
        } = movie
        
        return `
            <div class="movie">
                <img class="poster" src=${poster}>
                <div class="movie-header">
                    <div class="title-add">
                        <h2>${title}</h2>
                        <button class="remove-from-watchlist-btn" data-remove-movie-id="${id}"><i class="fa-solid fa-circle-minus" data-remove-movie-id="${id}"></i>Remove</button>
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
    
    removeTrailingDivider()
}

function removeTrailingDivider(){
    const dividers = document.querySelectorAll('.movie-divider')
    const movies = document.getElementById('movies')
    
    if (dividers.length > 0){
        dividers[dividers.length - 1].style.display = 'none'
        movies.style.marginBottom = '3.75em'
    }
}