import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Calendar1 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function DatePicker(props) {
  return (
    <div>
      <div className="text-sm pb-2"> {props.label}</div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!props.date}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !props.date && "text-muted-foreground"
            )}
          >
            <Calendar1 />
            {props.date || <span>Seleciona una fecha</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={props.date}
            onSelect={props.setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
