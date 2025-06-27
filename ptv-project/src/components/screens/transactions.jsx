import { Plus } from "lucide-react";
import TableSection from "../tableSection";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { TableCell, TableRow } from "../ui/table";
import DatePicker from "../../widgets/datePicker";
import InputSelect from "../../widgets/inputSelect";
import TitleFilterSection from "../../widgets/titleFilterSection";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { CSVLink } from "react-csv";

export default function Transactions() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deviceValue, setDeviceValue] = useState("");
  const [versionValue, setVersionValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const titles = [
    "ID",
    "Tipo de Movimiento",
    "Monto",
    "Resultado",
    "Tarjeta",
    "Emisor",
    "Marca",
    "Tipo",
    "Más info",
  ];
  const data = [];
  const devicesData = ["98282341249057"];
  const subcomerciosData = ["Subcomercio1", "Subcomercio2", "Subcomercio3"];
  const versionData = ["2024-03-12_10.00-v3"];
  const filters = [
    {
      filter: (
        <DatePicker
          label="Fecha inicio: *"
          open={openStartDate}
          setOpen={() => setOpenStartDate(true)}
          date={startDate}
          setDate={(e) => {
            console.log(e);
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
    {
      filter: (
        <InputSelect
          label="ID de Dispositivo:"
          selectItems={devicesData}
          setValue={(e) => setDeviceValue(e)}
        />
      ),
    },
    {
      filter: (
        <InputSelect label="Subcomercio:" selectItems={subcomerciosData} />
      ),
    },
    {
      filter: (
        <InputSelect
          label="Version:"
          selectItems={versionData}
          setValue={(e) => setVersionValue(e)}
        />
      ),
    },
  ];
  const isMobile = useIsMobile();

  useEffect(() => {}, []);

  const fetchTransacciones = async () => {
    setLoading(true);
    setTransactions([]); // Clear previous transactions
    if (startDate === "" || endDate === "") {
      toast.error(
        "Campos de Fecha inicio y fecha final no deben estar vacios. Intenta de nuevo."
      );
    } else {
      try {
        const response = await axios.post("/api/transactions", {
          transactionId: "",
          startDate: startDate,
          endDate: endDate,
          deviceId: deviceValue,
          subCommerce: "",
          version: versionValue,
        });

        console.log("RESPONSE DATA", response.data);

        if (response.status === 200) {
          console.log("RESPONSE SUCCESS:", response.status);

          //const updateTransactions = [...data, response.data];
          console.log("DATA UPDATED");
          setTransactions(response.data);
          toast.success("Transacciones cargadas exitosamente");
        } else {
          toast.error(
            response.data.message ||
              "Error desconocido al procesar la solicitud"
          );
        }
      } catch (err) {
        console.error("ERROR al obtener transacciones:", err);
        toast.error(
          "Hubo un ERROR al obtener transacciones. Por favor, inténtelo de nuevo."
        );
        if (err.response) {
          console.error("Detalles del ERROR:", err.response.data);
        }
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

  const filteredTransactions = transactions.filter(
    (item) =>
      item.transaccionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tipoMovimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.monto.includes(searchTerm) ||
      item.resultado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tarjeta.includes(searchTerm) ||
      item.emisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full p-6">
      <TitleFilterSection
        titleSection="Transacciones"
        filters={filters}
        buttonText="Mostrar transacciones"
        buttonFunction={() => {
          fetchTransacciones();
        }}
      />
      {isMobile ? (
        <div className="p-6 bg-gray-50 rounded-lg ">
          <p className="text-center">
            Demasiados datos para mostrar en este dispositivo.
          </p>

          <div className="flex p-6 justify-center">
            <Button disabled={transactions.length > 0 ? false : true}>
              <CSVLink data={transactions}>Descargar CSV</CSVLink>
            </Button>
          </div>
        </div>
      ) : (
        <TableSection
          searchInput
          searchValue={searchTerm}
          searchOnChange={(e) => setSearchTerm(e.target.value)}
          tableToDownload={transactions}
          tableTitles={titles}
          downloadButton={
            <Button disabled={transactions.length > 0 ? false : true}>
              <CSVLink data={transactions}>Descargar CSV</CSVLink>
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
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((item, key) => (
                <TableRow key={key} className="text-xs">
                  <TableCell>{item.transaccionId}</TableCell>
                  <TableCell className="text-center">
                    {item.tipoMovimiento}
                  </TableCell>
                  <TableCell>{item.monto}</TableCell>
                  <TableCell>{item.resultado}</TableCell>
                  <TableCell>{item.tarjeta}</TableCell>
                  <TableCell>{item.emisor}</TableCell>
                  <TableCell>{item.marca}</TableCell>
                  <TableCell>{item.tipo}</TableCell>
                  <div className="flex justify-center">
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <div className="p-6">
                          <Plus size={20} />
                        </div>
                      </AlertDialogTrigger>
                      <MoreInformation info={item} />
                    </AlertDialog>
                  </div>
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
