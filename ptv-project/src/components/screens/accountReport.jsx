import axios from "axios";
import { useEffect, useState } from "react";
import TableSection from "../tableSection";
import { TableRow, TableCell } from "../ui/table";

export default function AccountReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [report, setReport] = useState([]);

  useEffect(() => {
    fetchAccountReport();
  }, []);

  const titles = ["Item", "Concepto", "Total"];

  const data = [ 
    
  ]

  const fetchAccountReport = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await axios.post("/api/account_report", {
        period: "1",
        subCommerce: "",
        version: "2024-03-12_10.00-v3",
      });
      console.log("RESPONSE DATA", response.data);
      if (response.status === 200) {
        //console.log("RESPONSE SUCCESS:", response.status);
        const updateReport = [...data, response.data?.Cliente]
        setReport( updateReport);
        setMessage("Estado de cuenta cargado exitosamente.");
      } else {
        setError(
          response.data.message || "Error desconocido al procesar la solicitud"
        );
      }
    } catch (err) {
      console.error("Error al obtener estado de cuenta:", err);
      setError(
        "Hubo un error al obtener el estado de cuenta. Por favor, inténtelo de nuevo."
      );
      if (err.response) {
        console.error("Detalles del error:", err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="pb-6 text-2xl font-bold text-indigo-800">
        Estado de Cuenta
      </div>
      <div className="p-6 bg-gray-50 mb-6 rounded-lg">
        <h1 className="text-sm font-bold pb-3">Filters</h1>
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
        tableBody={report.map((item) => (
          <TableRow key={item.ID}>
            <TableCell>{item.ID}</TableCell>
            <TableCell>{item.RazonSocial}</TableCell>
            <TableCell>{item.Contacto}</TableCell>
            <TableCell>{item.Telefono}</TableCell>
            <TableCell>{item.Email}</TableCell>
            <TableCell>{item.Anio}</TableCell>
            <TableCell>{item.Mes}</TableCell>
          </TableRow>
        ))}
      />
    </div>
  );
}
