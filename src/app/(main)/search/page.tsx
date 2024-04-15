"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import  { Card } from '@/components/ui/card'
import { type Organization, type Event, User } from '@prisma/client';
import EventPreview from "@/components/events/EventPreview";
import  Link  from "next/link";
import { api } from '@/trpc/react';

export default function SearchPage() {
    const [searchOrganizationResults, setOrganizationSearchResults] = useState<Organization[]>([]);
    const [searchEventResults, setEventSearchResults] = useState<Event[]>([]);
    const [searchUserResults, setUserSearchResults] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showOrganizations, setShowOrganizations] = useState<boolean>(false);
    const [showUsers, setShowUsers] = useState<boolean>(false);
    const [showEvents, setShowEvents] = useState<boolean>(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const term = new URLSearchParams(window.location.search).get('term') ?? '';
            setSearchTerm(term);
        }
    }, []);

    const eventSearch = api.events.searchEvents.useQuery({ searchTerm });
    const orgSearch = api.organizations.searchOrganizations.useQuery({ searchTerm });
    const userSearch = api.users.searchUsers.useQuery({ searchTerm });

    useEffect(() => {
        if (showOrganizations) {
            setOrganizationSearchResults(orgSearch.data?.map((org: Organization) => ({
                id: org.id,
                name: org.name,
                description: org.description,
                email: org.email,
                type: org.type,
                image: org.image,
                universityName: org.universityName,
                instagram: org.instagram,
                facebook: org.facebook,
                discord: org.discord,
            })) || []);
        } else if (showUsers) {
            setUserSearchResults(userSearch.data?.map((user: User) => ({
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                points: user.points,
                bio: user.bio,
                github: user.github,
                linkedin: user.linkedin,
                website: user.website,
                isVerifiedStudent: user.isVerifiedStudent,
                universityName: user.universityName,
            })) || []);
        } else if (showEvents){
            setEventSearchResults(eventSearch.data?.map((event: Event) => ({
                id: event.id,
                title: event.title,
                location: event.location,
                locationDetails: event.locationDetails,
                date: event.date,
                description: event.description,
                image: event.image,
                type: event.type,
                duration: event.duration,
                userHostId: event.userHostId,
                orgHostId: event.orgHostId,
            })) || []);
        }
    }, [eventSearch.data, orgSearch.data, showOrganizations, showUsers]);

    return (
        <div className="mt-12 flex w-full max-w-screen-2xl flex-col px-12">
            <p className="mb-4 text-2xl font-bold">Search Results</p>

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                <Button onClick={() => { setShowEvents(true); setShowOrganizations(false); setShowUsers(false); }} style={{ marginRight: '10px' }}>
                    Events
                </Button>
                <Button onClick={() => { setShowEvents(false); setShowOrganizations(true); setShowUsers(false); }} style={{ marginRight: '10px' }}>
                    Organizations
                </Button>
                <Button onClick={() => { setShowEvents(false); setShowOrganizations(false); setShowUsers(true); }} style={{ marginRight: '10px' }}>
                    Users
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', width: '100%' }}>
                    {showUsers && searchUserResults.map((result, index) => (
                        <Link key={index}
                            href={`/user/${result.id}`}>
                            <Card>{result.username}</Card>
                        </Link>
                    ))}
                    {showOrganizations && searchOrganizationResults.map((result, index) => (
                        <Link key={index}
                            href={`/org/${result.id}`}>
                            <Card>{result.name}</Card>
                        </Link>
                    ))}

                    {showEvents && searchEventResults.map((result, index) => (
                        <EventPreview key={index} event={result} />
                    ))}
                </ul>
            </div>
        </div>
    );
}