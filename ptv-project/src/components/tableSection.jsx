import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Plus, Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export default function TableSection(props) {
  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-sm font-bold pb-3 text-[#0d1156]">Table</h1>
        <div className="flex items-center space-x-6">
          {props.downloadButton}
          {props.searchInput && (
            <div className="flex items-center border rounded-md selection:bg-primary selection:text-primary-foreground pl-3">
              <Search color="#0d1156"/>
              <input
                data-slot="input"
                type="text"
                value={props.searchValue}
                onChange={props.searchOnChange}
                className="placeholder:text-muted-foreground flex h-9 w-full  min-w-0 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm text-gray-500"
                placeholder="Search"
              />
            </div>
          )}
          {props.addButton}
        </div>
      </div>

      <ScrollArea className="h-100 whitespace-nowrap">
        <Table>
          <TableHeader>
            <TableRow>
              {props.tableTitles?.map((title, key) => (
                <TableHead className="text-[#0d1156]" key={key}>{title}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.tableBody ? (
              props.tableBody
            ) : (
              <div className="flex items-center justify-center text-indigo-400">
                No data
              </div>
            )}
          </TableBody>

          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={10}>Total</TableCell>
              <TableCell className="text-center">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
