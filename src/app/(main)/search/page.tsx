"use client";
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '@/trpc/react';
import { createClient } from '@/utils/supabase/client';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchResults = async () => {
        const params = new URLSearchParams(location.search);
        const term = params.get('term') || '';
        
        const supabase = createClient();
        
        const { data, error } = api.events.search.useQuery({ searchTerm: term });
        if (error) {
            console.error('Error fetching search results:', error);
        } else {
            setResults(data || 'null'); // Update the type of `results` and provide a default value of an empty array
        }
    };

    fetchResults();
  }, [location.search]);

return (
    <div>
        <h1>Search Results</h1>
        <ul>
            {results.map((result: any, index: number) => (
                <li key={index}>{result.name}</li>
            ))}
        </ul>
    </div>
);
};

export default SearchResults;