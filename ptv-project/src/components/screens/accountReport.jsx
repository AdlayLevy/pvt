import axios from "axios";
import { useEffect, useState } from "react";
import TableSection from "../tableSection";
import { TableRow, TableCell } from "../ui/table";
import { toast } from "sonner";
import { Button } from "../ui/button";
import InputSelect from "@/widgets/inputSelect";
import TitleFilterSection from "@/widgets/titleFilterSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { CSVLink } from "react-csv";

export default function AccountReport() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState([]);
  const [infoCliente, setInfoCliente] = useState({});
  const [periodValue, setPeriodValue] = useState("");
  const [subCommerceValue, setSubCommerceValue] = useState("");
  const [versionValue, setVersionValue] = useState("");
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {}, []);

  const titles = ["Item", "Concepto", "Total"];

  const filters = [
    {
      filter: (
        <InputSelect
          label="Periodo: *"
          selectItems={[" 1", "2", " 3"]}
          setValue={(e) => setPeriodValue(e)}
        />
      ),
    },
    {
      filter: (
        <InputSelect
          label="Version:"
          selectItems={["2024-03-12_10.00-v3"]}
          setValue={(e) => setVersionValue(e)}
        />
      ),
    },
    {
      filter: (
        <InputSelect
          label="SubComercio:"
          selectItems={["SubComercio 1", "SubComercio 2", "SubComercio 3"]}
          setValue={(e) => setSubCommerceValue(e)}
        />
      ),
    },
  ];

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

  const filteredReport = report.filter(
    (item) =>
      item.Item.includes(searchTerm) ||
      item.Concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Total.includes(searchTerm)
  );

  return (
    <div className="w-full p-6">
      <TitleFilterSection
        titleSection="Estado de Cuenta"
        filters={filters}
        buttonText=" Mostrar Estado de Cuenta"
        buttonFunction={() => fetchAccountReport()}
      />
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

      {isMobile ? (
        <div className="p-6 bg-gray-50 rounded-lg">
          <p className="text-center">
            Demasiados datos para mostrar en este dispositivo
          </p>
          <div className="flex p-6 justify-center">
            <Button disabled={report.length > 0 ? false : true}>
              <CSVLink data={report}>Descargar CSV</CSVLink>
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
            <Button disabled={report.length > 0 ? false : true}>
              <CSVLink data={report}>Descargar CSV</CSVLink>
            </Button>
          }
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
            ) : filteredReport.length > 0 ? (
              filteredReport.map((item, key) => (
                <TableRow key={key}>
                  <TableCell>{item.Item}</TableCell>
                  <TableCell>{item.Concepto}</TableCell>
                  <TableCell>{item.Total}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center text-indigo-500 text-base"
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
