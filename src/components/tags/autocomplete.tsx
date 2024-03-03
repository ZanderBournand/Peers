import React, { useEffect } from "react";
import {
  Command,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { type Tag as TagType } from "./tag-input";
import { groupBy } from "lodash";
import { CheckIcon } from "@heroicons/react/24/outline";

type AutocompleteProps = {
  tags: TagType[];
  setTags: React.Dispatch<React.SetStateAction<TagType[]>>;
  autocompleteOptions: TagType[];
  maxTags?: number;
  onTagAdd?: (tag: string) => void;
  allowDuplicates: boolean;
  isInputFocused: boolean;
  children: React.ReactNode;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  tags,
  setTags,
  autocompleteOptions,
  maxTags,
  onTagAdd,
  allowDuplicates,
  isInputFocused,
  children,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const groupedOptions: Record<string, TagType[]> = groupBy(
    autocompleteOptions,
    "category",
  );

  return (
    <div className="relative flex w-full">
      <Command className="border border-b-0 shadow-none">
        {children}
        {isInputFocused && (
          <CommandList className="absolute top-11 z-10 w-full rounded-b-lg border bg-white shadow-md">
            <CommandEmpty>No results found.</CommandEmpty>
            {Object.entries(groupedOptions).map(([category, options]) => (
              <CommandGroup
                key={category}
                heading={
                  <p className="text-base font-semibold text-black">
                    {category}
                  </p>
                }
              >
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    onSelect={() => {
                      if (maxTags && tags.length >= maxTags) return;
                      const tagIndex = tags.findIndex(
                        (tag) => tag.id === option.id,
                      );
                      if (tagIndex !== -1) {
                        // Tag is already present, remove it
                        setTags(
                          tags.filter((tag, index) => index !== tagIndex),
                        );
                      } else {
                        // Tag is not present, add it
                        if (
                          !allowDuplicates &&
                          tags.some((tag) => tag.name === option.name)
                        )
                          return;
                        setTags([...tags, option]);
                        onTagAdd?.(option.name);
                      }
                    }}
                    className="flex flex-row items-center"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-md border">
                      {tags.some((tag) => tag.id === option.id) && (
                        <CheckIcon className="h-5 w-5" />
                      )}
                    </div>
                    <p className="ml-2">{option.name}</p>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        )}
      </Command>
    </div>
  );
};
