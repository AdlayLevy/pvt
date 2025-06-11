import axios from "axios";

export default async function handler(req, res) {
  // Solo permitir solicitudes POST para esta API Route
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const { transactionId, startDate, endDate, deviceId, subCommerce, version } =
    req.body;
  const xmlRequest = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Header><OpHeader xmlns="https://servidorseguro.operacionesenlinea.com/"><OpKey1>${process.env.OPKEY_1}</OpKey1> <OpKey2>${process.env.OPKEY_2}</OpKey2></OpHeader></soap:Header><soap:Body><OpTransacciones xmlns="https://servidorseguro.operacionesenlinea.com/"><request><comercioId>${process.env.COMMERCE}</comercioId><contrasena>${process.env.PASSWORDS}</contrasena><transaccionId>${transactionId}</transaccionId><FechaInicio>${startDate}</FechaInicio><FechaFin>${endDate}</FechaFin><deviceId>${deviceId}</deviceId><subcomercio>${subCommerce}</subcomercio><version>${version}</version></request></OpTransacciones></soap:Body></soap:Envelope>`;
  const configHeaders = {
    "Content-Type": "text/xml;charset=UTF-8",
    SOAPAction: process.env.SOAP_ACTION_TRANSACTIONS,
  };
  try {
    const soapResponse = await axios.post(process.env.URL, xmlRequest, {
      headers: configHeaders,
      timeout: 10000,
    });
    let parsedResponse;
    try {
      const xml2js = require("xml2js");
      const parseString = xml2js.parseStringPromise; // Para parsear XML
      parsedResponse = await parseString(soapResponse.data, {
        explicitArray: false,
      });

      const opTransaccionesResult =
        parsedResponse?.["soap:Envelope"]?.["soap:Body"]
          ?.OpTransaccionesResponse.OpTransaccionesResult;

      console.log("OpTransacionesResult data ---- ", opTransaccionesResult);

      return res.status(200).json(opTransaccionesResult.Transaccion);
    } catch (err) {
      console.error("Error al parsear la respuesta XML:", parseError);
      // Envía la respuesta XML cruda si el parseo falla, para depuración
      return res.status(500).json({
        message: "Error parsing SOAP response",
        rawResponse: soapResponse.data,
      });
    }
  } catch (error) {
    console.error("----- ERROR IN API ROUTE (SOAP CALL) -----");
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error("Type: Server responded with error status");
        console.error("HTTP Status:", error.response.status);
        console.error("Response Data:", error.response.data); // This might be XML or HTML for error pages
        console.error("Response Headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // This often indicates a network error, DNS issue, or firewall
        console.error("Type: No response received (Network/Connection Error)");
        console.error("Error Message:", error.message); // e.g., "Network Error", "Timeout of 10000ms exceeded"
        console.error(
          "Request Object (details of what was sent):",
          error.request
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Type: Request setup error");
        console.error("Error Message:", error.message);
      }
      console.error("Axios Config:", error.config); // The configuration used for the request
    } else {
      // Any other unexpected error
      console.error("Type: Unexpected general error");
      console.error("Error Object:", error);
    }
    console.error("------------------------------------------");

    // Send a generic error response back to the client for security
    return res
      .status(500)
      .json({ message: "Error al contactar el servicio SOAP externo." });
  }
}
