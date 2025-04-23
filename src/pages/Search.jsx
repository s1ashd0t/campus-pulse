import React, { useState } from 'react';
import './Search.css';

const Search = () => {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        setQuery(e.target.value);
        // TODO: Implement search functionality
    };

    return (
        <div className="search">
            <h1>Search Events</h1>
            <input
                type="text"
                className="search-input"
                value={query}
                onChange={handleSearch}
                placeholder="Enter event name or keywords..."
                autoFocus
            />
        </div>
    );
};

export default Search;