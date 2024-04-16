"use client"
import React, { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import  { Card } from '@/components/ui/card'
import { type Organization, type Event, User } from '@prisma/client';
import EventPreview from "@/components/events/EventPreview";
import OrgHostPreview from '@/components/organizations/OrgHostPreview';
import UserHostPreview from '@/components/user/UserHostPreview';
import  Link  from "next/link";
import { api } from '@/trpc/react';
import { Separator } from '@/components/ui/separator';

export default function SearchPage() {
    const [searchOrganizationResults, setOrganizationSearchResults] = useState<Organization[]>([]);
    const [searchEventResults, setEventSearchResults] = useState<Event[]>([]);
    const [searchUserResults, setUserSearchResults] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showOrganizations, setShowOrganizations] = useState<boolean>(false);
    const [showUsers, setShowUsers] = useState<boolean>(false);
    const [showEvents, setShowEvents] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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

    useEffect(() => {
        if (eventSearch.status == 'success' && orgSearch.status == 'success' && userSearch.status == 'success') {
            setIsLoading(false);
        }
    });

    return (
        <div className="flex items-center justify-center pb-32">
            <div className="mt-12 flex w-full max-w-screen-2xl flex-col px-12">
                <p className="mb-4 text-2xl font-bold">Search Results for "{searchTerm}"</p>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgb(226 232 240)', padding: '10px', borderRadius: '10px' }}>
                    <Button onClick={() => { setShowEvents(true); setShowOrganizations(false); setShowUsers(false); }} style={{ marginRight: '10px', backgroundColor: showEvents ? 'purple' : 'white', color: showEvents ? 'white' : 'black', outline: 'none' }}>
                        Events
                    </Button>
                    <Button onClick={() => { setShowEvents(false); setShowOrganizations(true); setShowUsers(false); }} style={{ marginRight: '10px', backgroundColor: showOrganizations ? 'purple' : 'white', color: showOrganizations ? 'white' : 'black', outline: 'none' }}>
                        Organizations
                    </Button>
                    <Button onClick={() => { setShowEvents(false); setShowOrganizations(false); setShowUsers(true); }} style={{ marginRight: '10px', backgroundColor: showUsers ? 'purple' : 'white', color: showUsers ? 'white' : 'black', outline: 'none' }}>
                        Users
                    </Button>
                </div>
                <Separator className="mt-6" style={{margin: '15px 15px'}}/>
                {isLoading ? (
                    <p className="text-lg font-semibold">Loading...</p>
                ) : (
                    searchTerm && searchOrganizationResults.length === 0 && searchEventResults.length === 0 && searchUserResults.length === 0 ? (
                        <p className="text-lg font-semibold">No results found.</p>
                    ) : (
                        <div className="grid grid-cols-4 gap-x-4 gap-y-2">
                            {showUsers && searchUserResults.map((result, index) => (
                                <UserHostPreview key={index} user={result} />
                            ))}
                            {showOrganizations && searchOrganizationResults.map((result, index) => (
                                <OrgHostPreview key={index} organization={result} />
                            ))}

                            {showEvents && searchEventResults.map((result, index) => (
                                <EventPreview key={index} event={result} />
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}