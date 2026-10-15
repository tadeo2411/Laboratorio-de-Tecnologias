import img_orden from "../../../assets/icons/img_orden.svg";
import img_estado from "../../../assets/icons/img_estado.svg";
import img_trabajo from "../../../assets/icons/img_trabajo.svg";
import img_empleado from "../../../assets/icons/img_empleado.svg";
import img_precio from "../../../assets/icons/img_precio.svg";
import img_repuestos from "../../../assets/icons/img_repuestos.svg";

function TrabajosForm({ onCerrar }) {
    return (
        <div>
            <p className="campos-obligatorios">
                Los campos con <span className="asterisco">*</span> son obligatorios.
            </p>
            <form className="form-trabajos">

                <div>
                    <div>
                        <label>Orden de trabajo <span className="asterisco">*</span></label>

                        <div className="campo-icono">
                            <img src={img_orden} alt="" />
                            <select className="select"></select>
                        </div>
                    </div>
                </div>

                <div>
                    <div>
                        <label>Tipo de trabajo <span className="asterisco">*</span></label>

                        <div className="campo-icono">
                            <img src={img_trabajo} alt="" />
                            <select className="select"></select>
                        </div>
                    </div>
                </div>

                <div>
                    <div>
                        <label>Descripción <span className="asterisco">*</span></label>

                        <div >
                            <textarea placeholder="Describí el trabajo realizado..."></textarea>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <label>Empleado <span className="asterisco">*</span></label>

                        <div className="campo-icono">
                            <img src={img_empleado} alt="" />
                            <select className="select"></select>
                        </div>
                    </div>
                </div>

                <div>
                    <div>
                        <label>Precio del trabajo <span className="asterisco">*</span></label>

                        <div className="campo-icono">
                            <img src={img_precio} alt="" />
                            <input className="input" />
                        </div>
                    </div>
                </div>

                <div>
                    <div>
                        <label>Repuestos utilizados</label>

                        <div className="campo-icono">
                            <img src={img_repuestos} alt="" />
                            <input />
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCerrar}
                    >
                        Cancelar
                    </button>

                    <button type="submit" className="btn btn-success">
                        Guardar
                    </button>
                </div>

            </form>
        </div>
    )
}

export default TrabajosForm;