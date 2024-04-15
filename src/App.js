import { useEffect, useState } from "react";

const menuItems = [
  "HOME",
  "GENRE",
  "COUNTRY",
  "MOVIES",
  "TV SHOWS",
  "TOP IMDB",
  "ANDROID APP",
];

const headerDesc =
  "Want to know where you can watch Tv series or web series for free in 2020? This website is one of the best websites to stream your favourite series online. We bring to you world class series watching experience in HDR quality. Free series streaming and download. Experience like never before. Watch brand new series or old classic ones 720p and 180p with HD quality online. Watch recently released web series and TV series only here. Don’t miss any season or episode, stream today!";

// https://api.themoviedb.org/3/movie/upcoming?api_key=${APIKEY}&with_origin_country=IN&language=en-US&page=$1
// https://api.themoviedb.org/3/trending/tv/day?api_key=${APIKEY}&with_origin_country=IN&page=1
// `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&with_origin_country=IN&language=en-US&query=${query}&page=1&include_adult=false`

const APIKEY = "1efe3716ab36633b8d2d333ff6caf35b";

export default function App() {
  const [currentSelection, setCurrentSelection] = useState("movie");
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [moviesResult, setMovieResult] = useState([]);

  useEffect(
    function () {
      async function searchMovies() {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&with_origin_country=IN&language=en-US&query=${query}&page=1&include_adult=false`
        );
        const data = await res.json();
        setMovieResult(data.results);
      }

      if (query.length < 3) {
        setMovieResult([]);
        return;
      }
      searchMovies();
    },
    [query]
  );

  useEffect(
    function () {
      async function fetchMovies() {
        const res = await fetch(
          `https://api.themoviedb.org/3/trending/${currentSelection}/day?api_key=${APIKEY}&with_origin_country=US&page=1`
        );
        const data = await res.json();
        console.log(data.results);
        setMovies(data.results.slice(0, 16));
      }
      fetchMovies();
    },
    [currentSelection]
  );

  useEffect(function () {
    async function fetchMovies() {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${APIKEY}&with_origin_country=IN&language=en-US&page=1`
      );
      const data = await res.json();

      setUpcoming(data.results.slice(0, 16));
    }
    fetchMovies();
  }, []);

  return (
    <div>
      <Header menuItems={menuItems} />
      <SearchBar query={query} setQuery={setQuery} />
      <SearchResult moviesResult={moviesResult} />
      <div className="header-desc">{headerDesc}</div>
      <Movies
        movies={movies}
        title={"Trending"}
        currentSelection={currentSelection}
        setCurrentSelection={setCurrentSelection}
      />
      <Movies movies={upcoming} title={"Coming Soon"} />
    </div>
  );
}

function SearchResult({ moviesResult }) {
  return moviesResult.length > 0 ? (
    <div className="searchContainer">
      {moviesResult.map((item, index) => {
        return <MovieItem item={item} key={index} />;
      })}
    </div>
  ) : null;
}

function Movies({ movies, title, setCurrentSelection, currentSelection }) {
  return (
    <>
      <div style={{display: "flex"}}>
        <h2>{title}</h2>
        {title === "Trending" ? (
          <div className="trend-btn-grp">
            <button
              className={`trend-btns ${
                currentSelection === "movie" ? "active" : ""
              }`}
              onClick={() => setCurrentSelection("movie")}
            >
              <i className="fa fa-play-circle mr-2">&nbsp; </i>Movies
            </button>
            <button
              className={`trend-btns ${
                currentSelection === "tv" ? "active" : ""
              }`}
              onClick={() => setCurrentSelection("tv")}
            >
              <i className="fa fa-list mr-2"></i>&nbsp; TV Shows
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="moviesCotainer">
        {movies.map((item, index) => {
          return <MovieItem item={item} key={index} />;
        })}
      </div>
    </>
  );
}

function MovieItem({ item }) {
  return item.poster_path ? (
    <div className="movie">
      <div className="poster">
        <div className="quality">HD</div>
        <div className="rating">{Number(item.vote_average).toPrecision(2)}</div>
        <i className="fa fa-play play"></i>
        <img
          src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
          alt="poster"
          draggable={false}
        />
      </div>
      <p>{item.original_title ? item.original_title : item.original_name}</p>

      <p className="poster-desc">
        <span>
          {item.release_date
            ? String(item.release_date).split("-")[0]
            : String(item.first_air_date).split("-")[0]}
        </span>
        {item.media_type && (
          <span className="type">
            <span style={{ textTransform: "uppercase" }}>
              {String(item.media_type).charAt(0)}
            </span>
            {String(item.media_type).substring(1)}
          </span>
        )}
      </p>
    </div>
  ) : null;
}

function SearchBar({ query, setQuery }) {
  return (
    <>
      <div className="sub-header">
        <h5>Find Movies, TV shows and more</h5>
        <div className="search-container">
          <div className="searchIcon">
            <i className="fa fa-search"></i>
          </div>
          <input
            type="text"
            placeholder="Enter Keyword.."
            className="searchbar"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="searchbtn">
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <div className="header-fix"></div>
    </>
  );
}

function Header({ menuItems }) {
  return (
    <>
      <div id="header">
        <div className="logo">
          <img
            src="https://cataz.to/images/group_1/theme_9/logo.png?v=0.1"
            alt="img"
            draggable="false"
          />
        </div>

        <Menu menuItems={menuItems} />

        <div>
          <button className="login">
            {" "}
            <i className="far fa-user" style={{ marginRight: "10px" }}></i>Login
          </button>
        </div>
      </div>
    </>
  );
}

function Menu({ menuItems }) {
  return (
    <div className="menu">
      <ul>
        {menuItems.map((item, index) => {
          return <li key={index}>{item}</li>;
        })}
      </ul>
    </div>
  );
}
