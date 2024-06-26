/*
  File -> Component to display a map using Google Maps API
  - Shows the user's selected location on the map
  - Used in event creation to display the event location
*/

"use client";

import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { env } from "@/env";

export interface MarkerType {
  lat: number;
  lng: number;
}

export default function Map({
  address,
  height,
  width,
}: {
  address: string | null | undefined;
  height: string;
  width: string;
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  return (
    isLoaded && <MapChild address={address} height={height} width={width} />
  );
}

const MapChild = ({
  address,
  height,
  width,
}: {
  address: string | null | undefined;
  height: string;
  width: string;
}) => {
  const [markerCoordinates, setMarkerCoordinates] = useState<MarkerType | null>(
    null,
  );

  const getCoordinates = async (address: string) => {
    const geocode = await getGeocode({ address });
    if (geocode?.[0]) {
      return getLatLng(geocode[0]);
    }
  };

  useEffect(() => {
    if (!address) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMarkerCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      getCoordinates(address)
        .then((coordinates: MarkerType | undefined) => {
          if (coordinates) {
            setMarkerCoordinates(coordinates);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [address]);

  return (
    <div className="flex w-full flex-col">
      <GoogleMap
        clickableIcons={false}
        options={{ disableDefaultUI: true }}
        zoom={15}
        center={
          markerCoordinates
            ? markerCoordinates
            : // Default to Gainesville, FL
              { lat: 29.643633, lng: -82.354927 }
        }
        mapContainerStyle={{ width: width, height: height }}
        mapContainerClassName="rounded-xl"
      >
        {markerCoordinates && <Marker position={markerCoordinates} />}
      </GoogleMap>
    </div>
  );
};
