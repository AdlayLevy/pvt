import { Plus } from "lucide-react";
import TableSection from "../tableSection";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { TableCell, TableRow } from "../ui/table";
import DatePicker from "../../widgets/datePicker";
import InputSelect from "../../widgets/inputSelect";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "../ui/alert-dialog";
import axios from "axios";
import { toast } from "sonner";

export default function Transactions() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const titles = [
    "ID",
    "Tipo de Movimiento",
    "Monto",
    "Comision",
    "Resultado",
    "Tarjeta",
    "Emisor",
    "Marca",
    "Tipo",
    "Más info",
  ];
  const data = [
    {
      transaccionId: "1eb59ab781854f0397c3",
      tipoMovimiento: "Abono",
      resultado: "Declinada",
      monto: "$5800",
      fechaRegistro: "2025-05-26T16:52:00",
      emisor: "BANREGIO",
    },
    {
      transaccionId: "1eb59ab781854f0397c2",
      tipoMovimiento: "Abono",
      resultado: "Declinada",
      monto: "$5800",
      fechaRegistro: "2025-05-26T16:52:00",
      emisor: "",
    },
  ];

  const devicesData = ["98282341249057"];
  const subcomerciosData = ["Subcomercio1", "Subcomercio2", "Subcomercio3"];
  const versionData = ["2024-03-12_10.00-v3"];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState(null); // For messages like "No transactions found"

  useEffect(() => {
    fetchTransacciones();
  }, []);

  const fetchTransacciones = async () => {
    setLoading(true);
   
    setError(null);
    setMessage(null);
    setTransactions([]); // Clear previous transactions
    try {
      const response = await axios.post("/api/transactions", {
        transactionId: "",
        startDate: "2025-05-26",
        endDate: "2025-05-28",
        deviceId: "98282341249057",
        subCommerce: "",
        version: "2024-03-12_10.00-v3",
      });

      console.log("RESPONSE DATA", response.data);

      if (response.status === 200) {
        console.log("RESPONSE SUCCESS:", response.status);
        const updateTransactions = [...data, response.data];
        console.log("DATA UPDATED", updateTransactions);
        setTransactions(updateTransactions);
        toast.success('Success')
      } else {
        setError(
          response.data.message || "Error desconocido al procesar la solicitud"
        );
      }
    } catch (err) {
      console.error("Error al obtener transacciones:", err);
      setError(
        "Hubo un error al obtener transacciones. Por favor, inténtelo de nuevo."
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
        Transacciones
      </div>
      <div className="p-6 bg-gray-50 mb-6 rounded-lg">
        <h1 className="text-sm font-bold pb-3">Filters</h1>
        <div className="grid grid-cols-4 gap-6">
          <DatePicker
            label="Fecha inicio"
            date={startDate}
            setDate={setStartDate}
          />
          <DatePicker label="Fecha fin" date={endDate} setDate={setEndDate} />
          <InputSelect label="DeviceID" selectItems={devicesData} />
          <InputSelect label="Subcomercio" selectItems={subcomerciosData} />
          <InputSelect label="Version" selectItems={versionData} />
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


      <TableSection
        searchInput
        tableTitles={titles}
        tableBody={transactions.map((item) => (
          <TableRow key={item.transaccionId}>
            <TableCell>{item.transaccionId}</TableCell>
            <TableCell>{item.tipoMovimiento}</TableCell>
            <TableCell>{item.monto}</TableCell>
            <TableCell>{item.propina}</TableCell>
            <TableCell>{item.resultado}</TableCell>
            <TableCell>{item.tarjeta}</TableCell>
            <TableCell>{item.emisor}</TableCell>
            <TableCell>{item.marca}</TableCell>
            <TableCell>{item.tipo}</TableCell>
            <div className="flex justify-center">
              <AlertDialog>
                <AlertDialogTrigger>
                  <TableCell className="text-right">
                    <Plus size={20} />
                  </TableCell>
                </AlertDialogTrigger>
                <MoreInformation info={item} />
              </AlertDialog>
            </div>
          </TableRow>
        ))}
      />
    </div>
  );
}

function MoreInformation(props) {
  const TextTitle = (props) => {
    return (
      <div>
        <span className="font-bold">{props.title} </span>
        {props.info}
      </div>
    );
  };
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Detalles de Transacción</AlertDialogTitle>
        <AlertDialogDescription>
          <div className="grid grid-cols-2">
            <TextTitle title="Comercio Id: " info={props.info.comercioId} />
            <TextTitle title="Comercio: " info={props.info.comercio} />
            <TextTitle
              title="Tipo de Movimiento: "
              info={props.info.tipoMovimiento}
            />
            <TextTitle
              title="Transacción Id: "
              info={props.info.transaccionId}
            />
            <TextTitle title="Monto:" info={props.info.monto} />
            <TextTitle title="Propina: " info={props.info.propina} />
            <TextTitle title="Comisión: " info={props.info.comision} />
            <TextTitle title="Iva: " info={props.info.iva} />
            <TextTitle
              title="Código de Respuesta: "
              info={props.info.codigoRespuesta}
            />
            <TextTitle title="Resultado: " info={props.info.resultado} />
            <TextTitle title="Referencia: " info={props.info.referencia} />
            <TextTitle
              title="Referencia de Comercio: "
              info={props.info.referenciaComercio}
            />
            <TextTitle
              title="Código de Aprobación: "
              info={props.info.codigoAprobacion}
            />
            <TextTitle
              title="Fecha de Transacción: "
              info={props.info.fechaTransaccion}
            />
            <TextTitle
              title="Hora de Transacción: "
              info={props.info.horaTransaccion}
            />
            <TextTitle
              title="Fecha de Registro: "
              info={props.info.fechaRegistro}
            />
            <TextTitle title="Tarjeta: " info={props.info.tarjeta} />
            <TextTitle
              title="Mes - Año: "
              info={`${props.info.mes}/${props.info.anio} `}
            />
            <TextTitle title="Emisor: " info={props.info.emisor} />
            <TextTitle title="Marca: " info={props.info.marca} />
            <TextTitle title="Tipo: " info={props.info.tipo} />
            <TextTitle title="Afiliación: " info={props.info.afiliacion} />
            <TextTitle title="AID: " info={props.info.AID} />
            <TextTitle title="TVR: " info={props.info.TVR} />
            <TextTitle title="TSI: " info={props.info.TSI} />
            <TextTitle title="APN: " info={props.info.APN} />
            <TextTitle title="AL: " info={props.info.AL} />
            <TextTitle title="ARQC: " info={props.info.ARQC} />
            <TextTitle
              title="Serie de Lector: "
              info={props.info.serieLector}
            />
            <TextTitle title="Sub Comercio: " info={props.info.subComercio} />
            <TextTitle title="Versión: " info={props.info.version} />
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cerrar</AlertDialogCancel>
        {/* <AlertDialogAction>Continue</AlertDialogAction> */}
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
