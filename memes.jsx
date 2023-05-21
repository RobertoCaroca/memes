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
        <div className="memes">
            <button onClick={() => setDarkMode(!darkMode)}>
                Toggle Dark Mode
            </button>
            <input
                type="text"
                placeholder="Search..."
                onChange={event => setSearchTerm(event.target.value)}
            />
            {filteredMemes.map((meme, index) => (
                <div key={index} className="meme">
                    <h2>{meme.name}</h2>
                    <img src={meme.url} alt={meme.name} />
                    <button onClick={() => toggleFavorite(meme)}>
                        {favorites.some(favorite => favorite.id === meme.id) ? 'Unfavorite' : 'Favorite'}
                    </button>
                </div>
            ))}
        </div>
    );
};

ReactDOM.render(<Memes />, document.getElementById('root'));
