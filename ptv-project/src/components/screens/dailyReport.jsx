import TableSection from "../tableSection";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Calendar1 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "../ui/table";
import { CSVLink } from "react-csv";

import DatePicker from "@/widgets/datePicker";
import axios from "axios";
import { toast } from "sonner";
import TitleFilterSection from "@/widgets/titleFilterSection";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DailyReport() {
  const [startDate, setStartDate] = useState("");
  const [cortes, setCortes] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {}, []);

  const titles = [
    "Nombre",
    "Fecha",
    "# Transacciones",
    "Monto Total",
    "Comision",
    "Iva",
    "# Devoluciones",
    "Monto Devoluciones",
    "Saldo Transferido",
  ];

  const filters = [
    {
      filter: (
        <DatePicker
          label="Fecha inicio: *"
          open={openStartDate}
          setOpen={() => setOpenStartDate(true)}
          date={startDate}
          setDate={(e) => {
            const formattedDate = formatDate(e);
            setStartDate(formattedDate);
            setOpenStartDate(false);
          }}
        />
      ),
    },
    {
      filter: (
        <DatePicker
          label="Fecha final: *"
          open={openEndDate}
          setOpen={() => setOpenEndDate(true)}
          date={endDate}
          setDate={(e) => {
            const formattedDate = formatDate(e);
            setEndDate(formattedDate);
            setOpenEndDate(false);
          }}
        />
      ),
    },
  ];

  const fetchDailyOutages = async () => {
    setLoading(true);
    setCortes([]);
    if (startDate === "" || endDate === "") {
      toast.error(
        "Campos de Fecha inicio y Fecha final no deben estar vacios. Intenta de nuevo."
      );
    } else {
      try {
        const response = await axios.post("/api/daily_outages", {
          startDate: startDate,
          endDate: endDate,
        });
        console.log("RESPONSE DATA: ", response.data);
        if (response.status === 200) {
          console.log("Response success:", response.status);
          setCortes(response.data);
          toast.success("Corte Diario cargado exitosamente");
        } else {
          toast.error(
            response.data.message ||
              "Error desconocido al procesar la solicitud"
          );
        }
      } catch (err) {
        console.log("Error al obtener el Corte Diario", err);
        toast.error("Error al obtener el Corte Diario");
      } finally {
        setLoading(false);
      }
    }
  };

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const filteredCortes = cortes.filter(
    (item) =>
      item.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.NumTransacciones.includes(searchTerm) ||
      item.MontoTotal.includes(searchTerm) ||
      item.Comision.includes(searchTerm) ||
      item.Iva.includes(searchTerm) ||
      item.NumDevoluciones.includes(searchTerm) ||
      item.MontoDevoluciones.includes(searchTerm) ||
      item.SaldoTrans.includes(searchTerm)
  );

  return (
    <div className="w-full p-6">
      <TitleFilterSection
        titleSection="Cortes Diarios"
        filters={filters}
        buttonText="Mostrar Corte"
        buttonFunction={() => fetchDailyOutages()}
      />
      {isMobile ? (
        <div className="p-6 bg-gray-50 rounded-lg">
          <p className="text-center text-[#B2AAF1]">
            Demasiados datos para mostrar en este dispositivo
          </p>
          <div className="flex p-6 justify-center">
            <Button disabled={cortes.length > 0 ? false : true}>
              <CSVLink data={cortes}>Descargar CSV</CSVLink>
            </Button>
          </div>
        </div>
      ) : (
        <TableSection
          searchInput
          searchValue={searchTerm}
          searchOnChange={(e) => setSearchTerm(e.target.value)}
          tableTitles={titles}
          downloadButton={
            <Button disabled={cortes.length > 0 ? false : true}>
              <CSVLink data={cortes}>Descargar CSV</CSVLink>
            </Button>
          }
          tableBody={
            loading ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center text-[#B2AAF1]  text-base"
                >
                  Cargando ...
                </TableCell>
              </TableRow>
            ) : filteredCortes.length > 0 ? (
              filteredCortes.map((item, key) => (
                <TableRow key={key} className="text-xs text-gray-600">
                  <TableCell>{item.Nombre}</TableCell>
                  <TableCell>{item.Fecha}</TableCell>
                  <TableCell className="text-center">
                    {item.NumTransacciones}
                  </TableCell>
                  <TableCell>{item.MontoTotal}</TableCell>
                  <TableCell>{item.Comision}</TableCell>
                  <TableCell>{item.Iva}</TableCell>
                  <TableCell className="text-center">
                    {item.NumDevoluciones}
                  </TableCell>
                  <TableCell>{item.MontoDevoluciones}</TableCell>
                  <TableCell>{item.SaldoTrans}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center text-[#B2AAF1] text-base"
                >
                  No hay información que coincida.
                </TableCell>
              </TableRow>
            )
          }
        />
      )}
    </div>
  );
}
