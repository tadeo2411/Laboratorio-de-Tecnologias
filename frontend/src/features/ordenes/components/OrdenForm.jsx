import img_auto from "../../../assets/icons/img_auto.png";
import img_cliente from "../../../assets/icons/clientesIcono.svg";
import turnosIcono from "../../../assets/icons/turnosIcono.svg";
import img_estado from "../../../assets/icons/img_estado.svg";
import img_garantia from "../../../assets/icons/img_garantia.svg";
import img_urgencia from "../../../assets/icons/img_urgencia.svg"
import img_service from "../../../assets/icons/img_trabajo.svg"
import img_kilometraje from "../../../assets/icons/img_kilometraje.svg";
import { useState } from "react";

const TOTAL_ETAPAS = 5;

function OrdenForm({ onCerrar }) {
    const [etapa, setEtapa] = useState(0);

    const siguiente = () => {
        if (etapa < TOTAL_ETAPAS - 1) {
            setEtapa(etapa + 1);
        }
    };

    const atras = () => {
        if (etapa > 0) {
            setEtapa(etapa - 1);
        }
    };

    const manejarEnvio = (event) => {
        event.preventDefault();

        if (etapa !== TOTAL_ETAPAS - 1) {
            return;
        }
    };

    return (
        <div>
            <p className="campos-obligatorios">
                Los campos con <span className="asterisco">*</span> son obligatorios.
            </p>
            <form className="form-ordenes" onSubmit={manejarEnvio}>
                {etapa === 0 && (
                    <>
                        <div>
                            <div>
                                <label>
                                    Cliente <span className="asterisco">*</span>
                                </label>
                                <div className="campo-icono">
                                    <img style={{ filter: "brightness(0) saturate(100%) invert(27%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)" }} src={img_cliente} alt="imagen cliente" />
                                    <select className="select"
                                        value={""}
                                        onChange={null}>

                                        <option value="" disabled>
                                            Seleccionar cliente
                                        </option>
                                        <option value="1">Juan Perez</option>
                                        <option value="2">Pepito</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label>
                                    Vehículo <span className="asterisco">*</span>
                                </label>
                                <div className="campo-icono">
                                    <img style={{ filter: "brightness(0) saturate(100%) invert(27%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)" }} src={img_auto} alt="" />
                                    <select className="select"
                                        value={""}
                                        onChange={null}>

                                        <option value="" disabled>
                                            Seleccionar vehículo
                                        </option>
                                        <option value="1">Toyota Corolla</option>
                                        <option value="2">Ford Focus</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                             <div>
                                <label>
                                    Turno asociado
                                </label>
                                <div className="campo-icono">
                                    <img style={{ filter: "brightness(0) saturate(100%) invert(27%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)" }} src={turnosIcono} alt="turnos" />
                                    <select className="select"
                                        value={""}
                                        onChange={null}>

                                        <option value="" disabled>
                                            Sin turno
                                        </option>
                                        <option value="1">Fecha1</option>
                                        <option value="2">Fecha2</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label>
                                    Estado <span className="asterisco">*</span>
                                </label>
                                <div className="campo-icono">
                                    <img style={{ filter: "brightness(0) saturate(100%) invert(49%) sepia(87%) saturate(550%) hue-rotate(92deg) brightness(92%) contrast(101%)" }} src={img_estado} alt="" />
                                    <select className="select">

                                        <option value=""> Recibido </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {/* ETAPA 1 */}
                {etapa === 1 && (
                    <>
                        {/* Vehículo y Estado */}
                        <div>
                            <div>
                                <label>
                                    Vehículo <span className="asterisco">*</span>
                                </label>
                                <div className="campo-icono">
                                    <img style={{ filter: "brightness(0) saturate(100%) invert(27%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)" }} src={img_auto} alt="" />
                                    <select className="select"
                                        value={""}
                                        onChange={null}>

                                        <option value="" disabled>
                                            Seleccionar vehículo
                                        </option>
                                        <option value="1">Toyota Corolla</option>
                                        <option value="2">Ford Focus</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label>
                                    Estado <span className="asterisco">*</span>
                                </label>
                                <div className="campo-icono">
                                    <img style={{ filter: "brightness(0) saturate(100%) invert(49%) sepia(87%) saturate(550%) hue-rotate(92deg) brightness(92%) contrast(101%)" }} src={img_estado} alt="" />
                                    <select className="select">

                                        <option value=""> Recibido </option>
                                    </select>
                                </div>
                            </div>
                        </div>


                        <div>
                            <div>
                                <label>Diagnóstico</label>

                                <div >
                                    <textarea placeholder="Describí el diagnóstico..."></textarea>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="check-container">

                                <img src={img_garantia} alt="" className="check-icon" />
                                <span>Garantía</span>

                                <input type="number" id="garantia" />
                                <span>días</span>
                            </div>

                            <div className="check-container">

                                <img src={img_service} alt="" className="check-icon" />
                                <span>Es service</span>
                                <label className="switch">

                                    <input type="checkbox" id="garantia" />
                                    <span className="switch-slider"></span>
                                </label>
                            </div>
                            <div className="check-container">

                                <img src={img_urgencia} alt="" className="check-icon" />
                                <span>Es urgencia</span>
                                <label className="switch">

                                    <input type="checkbox" id="garantia" />
                                    <span className="switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </>)

                }

                {/* ETAPA 2 */}
                {etapa === 2 && (
                    <div>
                        <h3>Etapa 2: trabajos</h3>

                        <label>Descripción</label>
                        <textarea name="descripcion" />
                    </div>
                )}

                {/* ETAPA 3 */}
                {etapa === 3 && (
                    <div>
                        <h3>Etapa 3: presupuestos</h3>

                        <p>.</p>
                    </div>
                )}

                {/* ETAPA 3 */}
                {etapa === 4 && (
                    <div>
                        <h3>Etapa 4: Confirmar datos</h3>

                        <p>.</p>
                    </div>
                )}

                <div className="etapas-indicadores">
                    {Array.from({ length: TOTAL_ETAPAS }, (_, i) => (
                        <div
                            key={i}
                            className={`etapa-bolita ${etapa === i ? "activa" : ""}`}
                        />
                    ))}
                </div>

                {/* BOTONES */}
                <div className="d-flex justify-content-end gap-2">
                    {etapa === 0 ? (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onCerrar}
                        >
                            Cancelar
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={atras}
                        >
                            Atrás
                        </button>
                    )}

                    {etapa < TOTAL_ETAPAS - 1 ? (
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={siguiente}
                        >
                            Siguiente
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={manejarEnvio}
                            className="btn btn-success"
                        >
                            Guardar
                        </button>
                    )}
                </div>

            </form >
        </div >
    );
}

export default OrdenForm;