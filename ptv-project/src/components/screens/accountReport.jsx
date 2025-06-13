import axios from "axios";
import { useEffect, useState } from "react";
import TableSection from "../tableSection";
import { TableRow, TableCell } from "../ui/table";
import { toast } from "sonner";
import { Button } from "../ui/button";
import InputSelect from "@/widgets/inputSelect";

export default function AccountReport() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState([]);
  const [infoCliente, setInfoCliente] = useState({});
  const [periodValue, setPeriodValue] = useState("");
  const [subCommerceValue, setSubCommerceValue] = useState("");
  const [versionValue, setVersionValue] = useState("");

  useEffect(() => {}, []);

  const titles = ["Item", "Concepto", "Total"];

  const data = [];

  const fetchAccountReport = async () => {
    setLoading(true);
    setInfoCliente({});
    setReport([]);
    try {
      const response = await axios.post("/api/account_report", {
        period: periodValue,
        subCommerce: subCommerceValue,
        version: versionValue,
      });
      console.log("RESPONSE DATA", response.data);
      if (response.status === 200) {
        console.log("RESPONSE SUCCESS:", response.data?.Cliente);
        setInfoCliente(response.data?.Cliente);
        setReport(response.data?.Resumen);
        toast.success("Estado de cuenta cargado exitosamente.");
      } else {
        toast.error(
          response.data.message || "Error desconocido al procesar la solicitud"
        );
      }
    } catch (err) {
      console.error("Error al obtener estado de cuenta:", err);
      toast.error(
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
        <div className="grid grid-cols-4 gap-6">
          <InputSelect
            label="Periodo: *"
            selectItems={[" 1", "2", " 3"]}
            setValue={(e) => setPeriodValue(e)}
          />
          <InputSelect
            label="Version:"
            selectItems={["2024-03-12_10.00-v3"]}
            setValue={(e) => setVersionValue(e)}
          />
          <InputSelect
            label="SubComercio:"
            selectItems={["SubComercio 1", "SubComercio 2", "SubComercio 3"]}
            setValue={(e) => setSubCommerceValue(e)}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={() => fetchAccountReport()}>
            Mostrar Estado de Cuenta
          </Button>
        </div>
      </div>

      <div className="p-6 bg-gray-50 mb-6 rounded-lg">
        <h1 className="text-sm font-bold pb-3">Cliente</h1>
        <div className="grid grid-cols-4">
          <div>
            <span className="text-sm font-semibold">Razón Soacial: </span>
            {infoCliente.RazonSocial}
          </div>
          <div>
            <span className="text-sm font-semibold">Contacto:</span>{" "}
            {infoCliente.Contacto}
          </div>
          <div>
            <span className="text-sm font-semibold">Teléfono:</span>{" "}
            {infoCliente.Telefono}
          </div>
          <div>
            <span className="text-sm font-semibold">Email:</span>{" "}
            {infoCliente.Telefono}
          </div>
          <div>
            <span className="text-sm font-semibold">Fecha:</span>{" "}
            {infoCliente.Mes}-{infoCliente.Anio}
          </div>
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
            report.map((item, key) => (
              <TableRow key={key}>
                <TableCell>{item.Item}</TableCell>
                <TableCell>{item.Concepto}</TableCell>
                <TableCell>{item.Total}</TableCell>
              </TableRow>
            ))
          )
        }
      />
    </div>
  );
}
