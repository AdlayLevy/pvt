import TableSection from "../tableSection";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Calendar1 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TableCell, TableRow } from "../ui/table";

import DatePicker from "@/widgets/datePicker";
import axios from "axios";
import { toast } from "sonner";

export default function DailyReport() {
  const [startDate, setStartDate] = useState("");
  const [cortes, setCortes] = useState([]);
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  useEffect(() => {}, []);

  const data = [
    {
      ID: "001",
      Nombre: "Prueba",
      Fecha: "00/00/00",
      NumTransacciones: 5,
      MontoTotal: "$1000.00",
      Comision: "$152.00",
      Iva: "$160.00",
      NumDevoluciones: 5,
      MontoDevoluciones: "$450.00",
      SaldoTrans: "$1500.00",
    },
    {
      ID: "002",
      Nombre: "Prueba",
      Fecha: "00/00/00",
      NumTransacciones: 5,
      MontoTotal: "$1000.00",
      Comision: "$152.00",
      Iva: "$160.00",
      NumDevoluciones: 5,
      MontoDevoluciones: "$450.00",
      SaldoTrans: "$1500.00",
    },
  ];
  const titles = [
    "Nombre",
    "Fecha",
    "# Transacciones",
    "Monto Total",
    "Comision",
    "Iva",
    "# Devoluciones",
    "Monto Devoluciones",
    "Saldo Trans",
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

  return (
    <div className="w-full p-6">
      <div className="pb-6 text-2xl font-bold text-indigo-800">
        Cortes Diarios
      </div>
      <div className="p-6 bg-gray-50 mb-6 rounded-lg space-y-6">
        <h1 className="text-sm font-bold">Filters</h1>
        <div className="flex gap-6">
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
        </div>
        <div className="flex justify-end">
          <Button onClick={() => fetchDailyOutages()}>Mostrar Corte</Button>
        </div>
      </div>

      <TableSection
        searchInput
        tableTitles={titles}
        tableBody={
          loading ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center text-indigo-500 text-base"
              >
                Cargando ...
              </TableCell>
            </TableRow>
          ) : (
            cortes.map((item, key) => (
              <TableRow key={key}>
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
          )
        }
      />
    </div>
  );
}
