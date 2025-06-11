"use client";
import { useEffect, useState } from "react";
import {
  CortesDiarios,
  EstadoCuenta,
  Transacciones,
  Page,
} from "../../pages/api/reportsServices";

export default function Test() {
  const [cortesResponse, setCortesResponse] = useState("Cortes Diarios");

  const [responseCuenta, setResponseCuenta] = useState("Estado de Cuenta");
  const [result, setResult] = useState([]);

  useEffect(() => {
  }, []);

  return (
    <div className="flex space-x-10 justify-center items-center bg-gray-100 h-185 w-full">
      <div className="flex-col text-right items-center justify-center">
        <button
          type="button"
          className="bg-indigo-800 p-3 rounded-lg text-white shadow-xs hover:bg-primary/90"
          onClick={() => {}}
        >
          Cortes Diarios
        </button>
        <div className="w-100">{cortesResponse}</div>
      </div>
      <div className="flex-col text-left items-center justify-center">
        <button
          type="button"
          className="bg-indigo-800 p-3 rounded-lg text-white shadow-xs hover:bg-primary/90"
          onClick={() => {
            Page().then((res) => {
              console.log(res);
              setResult(res);
            });
          }}
        >
          Estado de Cuenta
        </button>
        <div className="w-100">{responseCuenta}</div>
      </div>
      <div>
        Some result
        <div>
          <ul>
            {result.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
