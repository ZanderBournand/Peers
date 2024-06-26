/*
  File -> Custom extension from a component from ShadcnUI library
  - Imported from (https://ui.shadcn.com/)
*/

import * as React from "react";
import { DateTime } from "luxon";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SelectSingleEventHandler } from "react-day-picker";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<DateTime>(
    DateTime.fromJSDate(date),
  );

  React.useEffect(() => {
    setSelectedDateTime(DateTime.fromJSDate(date));
  }, [date])

  const handleSelect: SelectSingleEventHandler = (day, selected) => {
    const selectedDay = DateTime.fromJSDate(selected);
    const modifiedDay = selectedDateTime.isValid
      ? selectedDay.set({
          hour: selectedDateTime.hour,
          minute: selectedDateTime.minute,
        })
      : selectedDay;

    setSelectedDateTime(modifiedDay);
    setDate(modifiedDay.toJSDate());
  };

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    let modifiedDay = selectedDateTime;

    if (!selectedDateTime.isValid) modifiedDay = DateTime.now();

    const { value } = e.target;
    const hours = Number.parseInt(value.split(":")[0] || "00", 10);
    const minutes = Number.parseInt(value.split(":")[1] || "00", 10);

    modifiedDay = modifiedDay.set({ hour: hours, minute: minutes });

    setSelectedDateTime(modifiedDay);
    setDate(modifiedDay.toJSDate());
  };

  const footer = (
    <>
      <div className="px-4 pb-4 pt-0">
        <Label>Time</Label>
        <Input
          type="time"
          onChange={handleTimeChange}
          value={selectedDateTime.toFormat("HH:mm")}
        />
      </div>
      {!selectedDateTime && <p>Please pick a day.</p>}
    </>
  );

  return (
    <Popover>
      <PopoverTrigger asChild className="z-10">
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            selectedDateTime.toFormat("MM/dd/yyyy @ hh:mm a")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDateTime.toJSDate()}
          onSelect={handleSelect}
          initialFocus
        />
        {footer}
      </PopoverContent>
    </Popover>
  );
}
