const movieDiv = document.getElementById('movies')
const tvDiv = document.getElementById('tv')


const apikey = '377924c3814a64b86719d125f958f891'
const apiURL = "https://api.themoviedb.org/3"
const posterURL185 = "https://image.tmdb.org/t/p/w185"
const posterURL342 = "https://image.tmdb.org/t/p/w342"
const apikeyURL = `api_key=${apikey}`

/* const mediaType = 'movie' // all, movie, tv, person
const duration = 'day' // day or week
const pageno = 1 */

const genCard = (imgURL, mid, sid = '', title = '', rating = '', index) => {
    return `<div class="m-1 d-inline-block">
                <img class="img-fluid ${sid}" src="${imgURL}" alt="${title}" onclick="movieModal('${sid}',${index})" data-bs-toggle='modal' data-bs-target='#trendingModal'>
            </div>`
}

const moreinfobtn = document.getElementById('moreinfo')

// Modal

const tModalImage = document.getElementById('trendingModalImage')
const tModalMTitle = document.getElementById('trendingModalMovieTitle')
const tModalMOverview = document.getElementById('trendingModalMovieOverview')
const tModalReleaseDate = document.getElementById('trendingModalReleaseDate')
const tModalRaing = document.getElementById('trendingModalRating')

const movieModal = (c, i) => {
    if (c == 'timg') {
        const cmovie = trendingMovies[i]
        tModalImage.setAttribute('src', posterURL342 + cmovie['poster_path'])
        tModalMTitle.innerText = cmovie['title']
        tModalMOverview.innerText = cmovie['overview']
        tModalReleaseDate.innerText = cmovie['release_date']
        tModalRaing.innerText = cmovie['vote_average']
        moreinfobtn.onclick = () => { 
            window.location.href = `movie.html?mid=${cmovie['id']}`
        }
    }
}

// ----------------------------- Search bar
const searchForm = document.forms[0]
searchForm.onsubmit = (event) => {
    event.preventDefault()
    const query = searchForm.elements['search'].value
    if (query.trim() != "") {
        searchForm.elements['search'].value = query.trim()
        searchForm.submit()
    }
}

//------------------------- Trending Section

let trendingMovies = []

const fetchTrending = async (mediaType = 'movie', duration = 'day', pageno = 1) => {
    const trendingURL = `${apiURL}/trending/${mediaType}/${duration}?api_key=${apikey}&page=${pageno}`
    let response = await fetch(trendingURL)
    const rText = await response.text()
    const movies = JSON.parse(rText)['results']
    trendingMovies = movies
    for (let i = 0; i < movies.length; i++) {
        movie = movies[i]
        let posterpath = posterURL185 + movie['poster_path']
        let cardhtml = genCard(posterpath, movie['id'], 'timg', movie['title'], movie['vote_average'], i)
        document.getElementById('tcards').innerHTML += cardhtml
    }
}


fetchTrending().then(() => {
    const tlbtn = document.getElementById('trendingLbtn')
    const trbtn = document.getElementById('trendingRbtn')
    const tcards = document.getElementById('tcards')
    const tcard = document.getElementsByClassName('timg')[0]
    tlbtn.onclick = () => {
        tcards.scrollLeft -= tcard.width

    }
    trbtn.onclick = () => {
        tcards.scrollLeft += tcard.width
    }
})



// upcoming movies
const fetchUpcoming = async () => {

}
// const upcomingURL = `${apiURL}/movie/upcoming?${apikeyURL}&page=${pageno}`

