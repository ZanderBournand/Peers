import React from "react";
import {
  Command,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { type Tag as TagType } from "./tag-input";
import { CheckIcon } from "@heroicons/react/24/outline";
import { groupBy } from "lodash";

type AutocompleteProps = {
  tags: TagType[];
  setTags: React.Dispatch<React.SetStateAction<TagType[]>>;
  autocompleteOptions: TagType[];
  maxTags?: number;
  onTagAdd?: (tag: string) => void;
  allowDuplicates: boolean;
  enableStrictAutocomplete: boolean;
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
  enableStrictAutocomplete,
  isInputFocused,
  children,
}) => {
  const groupedOptions: Record<string, TagType[]> = groupBy(
    autocompleteOptions,
    "category",
  );

  const renderOptions = (options: TagType[], isStrict: boolean) =>
    options.map((option) => (
      <CommandItem
        key={option.id}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        onSelect={() => {
          if (maxTags && tags.length >= maxTags) return;
          const tagIndex = tags.findIndex((tag) => tag.id === option.id);
          if (tagIndex !== -1 && isStrict) {
            // Tag is already present, remove it
            setTags(tags.filter((tag, index) => index !== tagIndex));
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
        {isStrict && (
          <div className="flex h-5 w-5 items-center justify-center rounded-md border">
            {tags.some((tag) => tag.id === option.id) && (
              <CheckIcon className="h-5 w-5" />
            )}
          </div>
        )}
        <p className="ml-2">{option.name}</p>
      </CommandItem>
    ));

  return (
    <div className="relative flex w-full">
      <Command className="border border-b-0 shadow-none">
        {children}
        {isInputFocused && (
          <CommandList className="absolute top-11 z-10 w-full rounded-b-lg border bg-white shadow-md">
            <CommandEmpty>No results found.</CommandEmpty>
            {Object.keys(groupedOptions).map((category) => {
              const options = groupedOptions[category] ?? [];
              const categoryDisplay =
                category !== "undefined"
                  ? category
                  : Object.keys(groupedOptions).length > 1
                    ? "Other"
                    : undefined;
              return (
                <CommandGroup
                  heading={
                    categoryDisplay !== undefined && (
                      <p className="text-base font-semibold text-black">
                        {categoryDisplay}
                      </p>
                    )
                  }
                  key={category}
                >
                  {renderOptions(options, enableStrictAutocomplete)}
                </CommandGroup>
              );
            })}
          </CommandList>
        )}
      </Command>
    </div>
  );
};
