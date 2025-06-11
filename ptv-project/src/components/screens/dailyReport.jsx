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

export default function DailyReport() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cortes, setCortes] = useState([]);
  const [message, setMessage] = useState(null); 

  useEffect(() => {
    fetchDailyOutages();
  }, []);

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
    "ID",
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
    setError(null);
    setMessage(null);
    setCortes([]);
    try {
      const response = await axios.post("/api/daily_outages", {
        startDate:'2025-05-26',
        endDate:'2025-05-28'
      });
      console.log("RESPONSE DATA: ", response.data);
      if(response.status === 200){
        console.log('Response success:', response.status)
        const updateCortes = [...data, response.data]
        console.log(updateCortes)
        setCortes(updateCortes)
        setMessage('Cortes cargados exitosamente', response.data)
      }else {
        setError(
          response.data.message || "Error desconocido al procesar la solicitud"
        );
      }
    } catch (err) {
      console.log("Error al obtener el estado de cuenta:", err);
    }finally{
      setLoading(false)
    }
  };

  return ( 
    <div className="w-full p-6">
      <div className="pb-6 text-2xl font-bold text-indigo-800">
        Cortes Diarios
      </div>
      <div className="p-6 bg-gray-50 mb-6 rounded-lg space-y-6">
        <h1 className="text-sm font-bold">Filters</h1>
        <div className="flex gap-6">
          <DatePicker
            label="Fecha inicio"
            date={startDate}
            setDate={(e) => {
              let formatedDate = format(e, "yyyy-MM-dd");
              setStartDate(formatedDate);
              console.log(startDate);
            }}
          />

          <div>
            <div className="text-sm pb-2"> Fecha fin</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <Calendar1 />
                  {endDate ? format(endDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(e) => {
                    let formatedDate = format(e, "yyyy-MM-dd");
                    setEndDate(formatedDate);
                    console.log(endDate);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => {}}>Search</Button>
        </div>
      </div>
      {loading && (
        <div className="flex items-center justify-center text-indigo-400">
          Cargando...
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center text-red-500">
          Error: {error}
        </div>
      )}

      {message && (
        <div className="flex items-center justify-center text-indigo-400">
          {message}
        </div>
      )}
      <TableSection
        searchInput
        tableTitles={titles}
        tableBody={cortes.map((item) => (
          <TableRow key={item.ID}>
            <TableCell>{item.ID}</TableCell>
            <TableCell>{item.Nombre}</TableCell>
            <TableCell>{item.Fecha}</TableCell>
            <TableCell className="text-center">{item.NumTransacciones}</TableCell>
            <TableCell>{item.MontoTotal}</TableCell>
            <TableCell>{item.Comision}</TableCell>
            <TableCell>{item.Iva}</TableCell>
            <TableCell className="text-center">{item.NumDevoluciones}</TableCell>
            <TableCell>{item.MontoDevoluciones}</TableCell>
            <TableCell>{item.SaldoTrans}</TableCell>
          </TableRow>
        ))}
      />
    </div>
  );
}
