import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import LocationInput from "./LocationInput";
import Map from "./Map";

type MapsButtonProps = {
  location: string | null | undefined;
  locationDetails: string | null | undefined;
  setLocation: (location: string) => void;
  setLocationDetails: (locationDetails: string | null) => void;
};

export default function MapsButton({
  location,
  locationDetails,
  setLocation,
  setLocationDetails,
}: MapsButtonProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [locationInput, setLocationInput] = useState<string | null | undefined>(
    location,
  );
  const [locationDetailsInput, setLocationDetailsInput] = useState<
    string | null | undefined
  >(locationDetails);

  useEffect(() => {
    if (location) {
      setLocationInput(location);
    }
    if (locationDetails) {
      setLocationDetailsInput(locationDetails);
    }
  }, [location, locationDetails]);

  const handleSubmit = () => {
    setDialogIsOpen(false);

    setLocation(locationInput ?? "");
    setLocationDetails(locationDetailsInput ?? "");
  };

  return (
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <DialogTrigger>
        <Button
          variant="outline"
          type="button"
          className="ml-6 flex w-full flex-row items-center"
        >
          <MapPinIcon className="mr-2 h-5 w-5" />
          Use Map
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <p className="text-2xl font-bold">Choose your location</p>
        <div className="flex flex-row">
          <div className="mr-4 flex w-2/3 flex-col">
            <div className="my-4 flex flex-col">
              <p className="text-md font-bold">Step 1</p>
              <p className="text-xs">
                Input the address where your event will take place!
              </p>
              <div className="mt-4">
                <LocationInput
                  location={locationInput}
                  setLocation={setLocationInput}
                />
              </div>
            </div>
            <div className="my-4 flex flex-col">
              <p className="text-md font-bold">
                Step 2 <span className="text-sm font-normal">(Optional)</span>
              </p>
              <p className="text-xs">
                Any location specific info (e.g. room number, floor, etc.)
              </p>
              <Input
                value={locationDetailsInput ?? ""}
                className="mt-4 h-8 rounded-none border-x-0 border-t-0 focus-visible:ring-0"
                placeholder="Any specifics..."
                onChange={(e) => setLocationDetailsInput(e.target.value)}
                autoFocus
              />
            </div>
            <div className="mt-8 flex w-full justify-center">
              <Button
                variant="default"
                className="w-1/2 justify-center"
                type="button"
                onClick={handleSubmit}
              >
                Done
              </Button>
            </div>
          </div>
          <Map address={locationInput} width="100%" height="600px" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
