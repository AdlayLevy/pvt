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
import { ScrollArea } from "./ui/scroll-area";

export default function TableSection(props) {
  const tableTitles = props.tableTitles || [];
  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-sm font-bold pb-3">Table</h1>
        <div className="flex items-center space-x-6">
          {props.searchInput && (
            <div className="flex items-center border rounded-md selection:bg-primary selection:text-primary-foreground pl-3">
              <Search />
              <input
                data-slot="input"
                type="text"
                className="placeholder:text-muted-foreground flex h-9 w-full min-w-0 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm"
                placeholder="Search"
              />
            </div>
          )}
          {props.hasAddButton && (
            <Button>
              <Plus /> {props.buttonLabel}
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="h-100 ">
        <Table>
          <TableHeader>
            <TableRow>
              {tableTitles.map((title) => (
                <TableHead>{title}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.tableBody ? (
              props.tableBody
            ) : (
              <div className="flex items-center justify-center text-indigo-400">No data</div>
            )}
          </TableBody>

          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={10}>Total</TableCell>
              <TableCell className="text-center">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </ScrollArea>
    </div>
  );
}
