import { useState } from "react";
import { Transport } from "../../components/dashboard";
import { Fechas } from "../../interfaces";
import { useClientsTransport } from "../../hooks";
import { GrDocumentUpload } from "react-icons/gr";

export const DashboardTransportPage = () => {
    const [fechas, setFechas] = useState<Fechas[]>([]);
    const [info, setInfo] = useState<string | null>(null);
    const [showIb, setShowIb] = useState(true);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const { data } = useClientsTransport({ e });
            if ((await data).length > 0) {
                setFechas(await data);
                setInfo(e.target.files[0].name);
                setShowIb(false);
            } else {
                setFechas([]);
                e.target.value = "";
            }
        }
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                <h1 className="text-2xl font-bold">Lista de transportes</h1>

                {showIb ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <input
                            type="file"
                            id="inputfile"
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            onChange={handleFile}
                            className="file-input file-input-bordered w-full max-w-xs"
                            hidden
                        />
                        <label
                            htmlFor="inputfile"
                            className="bg-cyan-600 text-white flex items-center p-2 rounded-md gap-2 hover:bg-yellow-500 hover:scale-105 transition-all"
                        >
                            <GrDocumentUpload /> Click To Upload List
                        </label>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-cyan-600">
                        <i className="fa fa-file-excel-o fa-1x" style={{ color: "green" }} />
                        <span className="text-sm">
                            {`${info} (${fechas ? fechas.reduce((total, fecha) => total + fecha.clientes.length, 0) : 0} Registros)`}
                        </span>
                    </div>
                )}
            </div>

            <Transport fechas={fechas} />
        </>
    );
}