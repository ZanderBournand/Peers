import React, { useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete from "use-places-autocomplete";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { env } from "@/env";

interface PlacesAutocompleteProps {
  location: string | null | undefined;
  setLocation: (value: string) => void;
}

export default function LocationInput({
  location,
  setLocation,
}: PlacesAutocompleteProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  return (
    isLoaded && (
      <LocationInputChild location={location} setLocation={setLocation} />
    )
  );
}

const LocationInputChild = ({
  location,
  setLocation,
}: PlacesAutocompleteProps) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    if (address) {
      setLocation(address);
    }
  };

  useEffect(() => {
    if (location) {
      setValue(location, false);
    }
  }, [location, setValue]);

  return (
    <div className="relative flex w-full">
      <Command>
        <CommandInput
          disabled={!ready}
          onValueChange={(value) => {
            setValue(value);
          }}
          placeholder="Search location..."
          value={value}
          autoFocus
        />
        {data.length > 0 && (
          <CommandGroup className="absolute top-11 z-10 w-full rounded-lg border bg-white shadow-md">
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <CommandItem
                  key={place_id}
                  value={description}
                  onSelect={() => handleSelect(description)}
                >
                  {description}
                </CommandItem>
              ))}
          </CommandGroup>
        )}
      </Command>
    </div>
  );
};
