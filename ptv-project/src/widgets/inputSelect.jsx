import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function InputSelect(props) {
  return (
    <div>
      <div className="text-sm pb-2">{props.label}</div>
      <Select>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="Select item" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{props.label}</SelectLabel>
            {props.selectItems.map((item) => (
              <SelectItem key={item} value={item}>{item}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
