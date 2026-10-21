//aca es donde leemos y escribimos sobre 'nombreModulo.json'
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function listarRepuestos() {
    const ruta = path.join(__dirname, "../", "../", "../", "data", "repuestos.json");

    const repuestosJSON = fs.readFileSync(ruta, "utf-8");

    const repuestosPlano = JSON.parse(repuestosJSON);

    return repuestosPlano;
}

export default {listarRepuestos};