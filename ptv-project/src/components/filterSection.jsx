import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";



export default function FilterSection(props) {
  return (
    <div className="p-6 bg-gray-50 mb-6 rounded-lg">
      <h1 className="text-sm font-bold pb-3">Filters</h1>
      <div className="grid grid-cols-5 gap-4">
        <SelectWidget />
        <SelectWidget />
        <SelectWidget />
        <SelectWidget />
        <SelectWidget />
        <SelectWidget />
        <SelectWidget />
        <SelectWidget />
        <SelectWidget />
        <SelectWidget />
      </div>
    </div>
  );
}

function SelectWidget(props) {
  return (
    <div>
      <div className="text-sm pb-2">Label</div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}