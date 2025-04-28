import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './Search.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState({
        users: [],
        events: [],
        news: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const searchCollections = async () => {
            if (query.length < 2) {
                setSuggestions({ users: [], events: [], news: [] });
                return;
            }

            setLoading(true);
            const queryLower = query.toLowerCase();

            try {
                // Search users
                const usersRef = collection(db, 'users');
                const usersSnapshot = await getDocs(usersRef);
                const matchingUsers = usersSnapshot.docs
                    .filter(doc => {
                        const data = doc.data();
                        return (data.firstName + ' ' + data.lastName)
                            .toLowerCase()
                            .includes(queryLower);
                    })
                    .map(doc => ({
                        id: doc.id,
                        name: `${doc.data().firstName} ${doc.data().lastName}`,
                        type: 'user'
                    }))
                    .slice(0, 5);

                // Search events
                const eventsRef = collection(db, 'events');
                const eventsSnapshot = await getDocs(eventsRef);
                const matchingEvents = eventsSnapshot.docs
                    .filter(doc => 
                        doc.data().title.toLowerCase().includes(queryLower) ||
                        doc.data().description.toLowerCase().includes(queryLower)
                    )
                    .map(doc => ({
                        id: doc.id,
                        title: doc.data().title,
                        type: 'event'
                    }))
                    .slice(0, 5);

                // Search news
                const newsRef = collection(db, 'news');
                const newsSnapshot = await getDocs(newsRef);
                const matchingNews = newsSnapshot.docs
                    .filter(doc => 
                        doc.data().title.toLowerCase().includes(queryLower)
                    )
                    .map(doc => ({
                        id: doc.id,
                        title: doc.data().title,
                        type: 'news'
                    }))
                    .slice(0, 5);

                setSuggestions({
                    users: matchingUsers,
                    events: matchingEvents,
                    news: matchingNews
                });
            } catch (error) {
                console.error('Error searching:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchCollections, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleSearch = (e) => {
        setQuery(e.target.value);
    };

    const handleSuggestionClick = (item) => {
        // Navigate to appropriate page based on type
        if (item.type === 'event') {
            window.location.href = `/register/${item.id}`;
        } else if (item.type === 'user') {
            window.location.href = `/profile/${item.id}`;
        }
        // Clear suggestions after click
        setSuggestions({ users: [], events: [], news: [] });
    };

    return (
        <div className="search">
            <h1>Search</h1>
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Search users, events, or news..."
                    autoFocus
                />
                {loading && <div className="search-loading">Searching...</div>}
                
                {(suggestions.users.length > 0 || 
                  suggestions.events.length > 0 || 
                  suggestions.news.length > 0) && (
                    <div className="suggestions-container">
                        {suggestions.users.length > 0 && (
                            <div className="suggestion-section">
                                <h3>Users</h3>
                                {suggestions.users.map(user => (
                                    <div 
                                        key={user.id} 
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(user)}
                                    >
                                        👤 {user.name}
                                    </div>
                                ))}
                            </div>
                        )}

                        {suggestions.events.length > 0 && (
                            <div className="suggestion-section">
                                <h3>Events</h3>
                                {suggestions.events.map(event => (
                                    <div 
                                        key={event.id} 
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(event)}
                                    >
                                        📅 {event.title}
                                    </div>
                                ))}
                            </div>
                        )}

                        {suggestions.news.length > 0 && (
                            <div className="suggestion-section">
                                <h3>News</h3>
                                {suggestions.news.map(item => (
                                    <div 
                                        key={item.id} 
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(item)}
                                    >
                                        📰 {item.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;