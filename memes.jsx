const { useState, useEffect } = React;

const Memes = () => {
    const [memes, setMemes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState(
        JSON.parse(localStorage.getItem('favorites')) || []
    );
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        axios.get('https://api.imgflip.com/get_memes')
            .then(response => {
                setMemes(response.data.data.memes);
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
    }, [darkMode]);

    const filteredMemes = memes.filter(meme =>
        meme.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleFavorite = meme => {
        if (favorites.some(favorite => favorite.id === meme.id)) {
            setFavorites(favorites.filter(favorite => favorite.id !== meme.id));
        } else {
            setFavorites([...favorites, meme]);
        }
    };

    return (
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">Meme Generator</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    onChange={event => setSearchTerm(event.target.value)}
                  />
                </li>
              </ul>
              <button className="btn btn-outline-success my-2 my-sm-0" onClick={() => setDarkMode(!darkMode)}>
                Toggle Dark Mode
              </button>
            </div>
          </nav>
    
          <div className="memes">
            {filteredMemes.map((meme, index) => (
              <div key={index} className="meme">
                <h2>{meme.name}</h2>
                <img src={meme.url} alt={meme.name} />
                <button className="btn btn-primary" onClick={() => toggleFavorite(meme)}>
                  {favorites.some(favorite => favorite.id === meme.id) ? 'Unfavorite' : 'Favorite'}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    };
    
    ReactDOM.render(<Memes />, document.getElementById('root'));