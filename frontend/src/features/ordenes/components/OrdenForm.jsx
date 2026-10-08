import img_auto from "../../../assets/icons/img_auto.png";
import img_estado from "../../../assets/icons/img_estado.svg";
import img_garantia from "../../../assets/icons/img_garantia.svg";
import img_urgencia from "../../../assets/icons/img_urgencia.svg"
import img_service from "../../../assets/icons/img_trabajo.svg"

function OrdenForm({ onCerrar }) {
    return (
        <div>
            <p className="campos-obligatorios">
                Los campos con <span className="asterisco">*</span> son obligatorios.
            </p>
            <form className="form-ordenes">
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
                        <label className="switch">
                            
                            <input type="checkbox" id="garantia" />
                            <span className="switch-slider"></span>
                        </label>
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

                {/* Botones */}
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
    );
}

export default OrdenForm;