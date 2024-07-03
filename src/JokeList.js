// JokeList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

const JokeList = ({ numJokesToGet = 5 }) => {
    const [jokes, setJokes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getJokes = async () => {
            try {
                let jokes = [];
                let seenJokes = new Set();
                while (jokes.length < numJokesToGet) {
                    let res = await axios.get('https://icanhazdadjoke.com', {
                        headers: { Accept: 'application/json' },
                    });
                    let joke = res.data;
                    if (!seenJokes.has(joke.id)) {
                        seenJokes.add(joke.id);
                        jokes.push({ ...joke, votes: 0 });
                    }
                }
                setJokes(jokes);
                setIsLoading(false);
            } catch (err) {
                console.error(err);
            }
        };

        getJokes();
    }, [numJokesToGet]);

    const vote = (id, delta) => {
        setJokes((jokes) => jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j)));
    };

    if (isLoading) {
        return (
            <div className="loading">
                <i className="fas fa-4x fa-spinner fa-spin" />
            </div>
        );
    }

    return (
        <div className="JokeList">
            <button className="JokeList-getmore" onClick={() => setIsLoading(true)}>
                Get New Jokes
            </button>
            {jokes
                .sort((a, b) => b.votes - a.votes)
                .map((j) => (
                    <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote} />
                ))}
        </div>
    );
};

export default JokeList;
