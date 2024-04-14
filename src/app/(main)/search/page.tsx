"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { type Organization, type Event } from '@prisma/client';
import { api } from '@/trpc/react';
import { s } from 'vitest/dist/reporters-MmQN-57K.js';


export default async function SearchPage() {
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showOrganizations, setShowOrganizations] = useState<boolean>(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const term = new URLSearchParams(window.location.search).get('term') ?? '';
            setSearchTerm(term);
        }
    }, []);

    const eventSearch = api.events.searchEvents.useQuery({ searchTerm });
    const orgSearch = api.organizations.searchOrganizations.useQuery({ searchTerm });

    useEffect(() => {
        if (showOrganizations) {
            setSearchResults(orgSearch.data?.map((org: Organization) => org.name) || []);
        } else {
            setSearchResults(eventSearch.data?.map((event: Event) => event.title) || []);
        }
    }, [eventSearch.data, orgSearch.data, showOrganizations]);

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Search Results</h1>
            <Button onClick={() => setShowOrganizations(false)}>
                Events
            </Button>
            <Button onClick={() => setShowOrganizations(true)}>
                Organizations
            </Button>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {searchResults.map((result, index) => (
                    <li key={index}>{result}</li>
                ))}
            </ul>
        </div>
    );
}