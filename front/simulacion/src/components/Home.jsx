import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { guardarSimulacionLocal, postSimulacion } from '../redux/slices/simuladorSlice';
import './Home.css';

export function Home() {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        temperatura: '',
        siembra: '',
        humedad: '',
        fertilizacion: '',
        afectadas: '',
        fertilizantes: '',
        hectareas: ''
    });

    const [isFormValid, setIsFormValid] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [simulacionResultados, setSimulacionResultados] = useState({
        humedad: '',
        accion: '',
        porcentaje: '',
        tipo: ''
    });

    const verificarCampos = (data) => {
        const { temperatura, siembra } = data;
        const isValid = temperatura && siembra;
        setIsFormValid(isValid);
    };
    function Generar(n, t, cantidad) {
        let resultadosArray = []
        let num = n
        let nuevoNumero = 0
        let numero1 = 0
        let numero2 = 0
        let nuevaSemilla = 0

        while (cantidad > 0) {
            const k = t.toString().length
            nuevoNumero = num * t
            numero1 = nuevoNumero.toString().slice(0, k)
            numero2 = nuevoNumero.toString().slice(k)
            nuevaSemilla = parseInt(numero2) - parseInt(numero1)
            resultadosArray.push({
                u: nuevaSemilla / Math.pow(10, nuevaSemilla.toString().length)
            })
            num = nuevaSemilla
            cantidad--
        }
        return resultadosArray;
    }
    function normal(mu = 70, sigma = 10) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return z0 * sigma + mu;
      }
    const simular = () => {
        let siembra = '';
        let temperatura = '';
        let humedad = '';
        let Porcentaje = '';
        let T;
        let accion;
        const numerosU = Generar(Math.floor(Math.random() * 9000) + 1000, Math.floor(Math.random() * 100) + 1, 5);
        let u1 = numerosU[0].u;
        
        if (u1 <= 0.20) {
            humedad = 'baja';
        } else if (u1 <= 0.70) {
            humedad = 'intermedia';
        } else {
            humedad = 'alta';
        }

        let u2 = numerosU[1].u;
        if(u2 <= 0.15) {
            let u3 = numerosU[0].u;
            let MDL = 5 + 2 * u3;
            accion = "Se continua con el monitoreo normal con una frecuencia de " + MDL;
            T = 'LEVE';
            Porcentaje = "0 a 15% de plantas afectadas";
        } else if(u2 <= 0.50) {
            let u4 = numerosU[2].u;
            let MDM = 36 + 24 * u4;
            accion = "Se intensifica el monitoreo con una frecuencia de " + MDM;
            T = 'MODERADA';
            Porcentaje = "16 a 35% de plantas afectadas";
        } else if(u2 <= 0.80) {
            accion = "Se evalua la posibilidad de una resiembra parcial";
            T = 'SEVERO';
            Porcentaje = "35 a 70% de plantas afectadas";
        } else {
            const perdidaProduccion = normal(70, 10);
            accion = `Se recomienda la resiembra total dado que se detecto un danio de ${perdidaProduccion.toFixed(2)} en promedio en los tallos`;
            T = 'EXTREMO';
            Porcentaje = "Mas de 70% de plantas afectadas";
        }
        
        const resultados = {
            humedad,
            accion,
            porcentaje: Porcentaje,
            tipo: T
        };

        setSimulacionResultados(resultados);
        setShowModal(true);

        // Guardar la simulación
        const simulacionData = {
            resultado: T,
            temperatura: formData.temperatura,
            mesSiembra: formData.siembra,
            humedad: humedad,
            porcentajeAfectacion: Porcentaje,
            accionRecomendada: accion,
            fecha: new Date().toISOString()
        };

        console.log('Datos a guardar:', simulacionData);

        // Guardar en Redux y localStorage
        dispatch(guardarSimulacionLocal(simulacionData));
        
        // Intentar guardar en el backend
        dispatch(postSimulacion(simulacionData))
            .unwrap()
            .then((response) => {
                console.log('Simulación guardada exitosamente:', response);
            })
            .catch((error) => {
                console.error('Error al guardar la simulación:', error);
            });
    
        };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newData = {
            ...formData,
            [name]: value
        };
        setFormData(newData);
        verificarCampos(newData);
    };

    const calcular = () => {
        console.log('Calculando con datos:', formData);
    };

    return (
        <div className="home-container">
            <nav className="main-nav">
                <button onClick={simular}>Simular</button>
                <button onClick={() => window.location.href = '/historial'}>Historial</button>
                <button onClick={() => window.location.href = '/informacion'}>Información</button>
            </nav>

            <div className="container">
                <div className="grid-pares">
                    <div className="form-group">
                        <label>Cultivo:</label>
                        <input type="text" value="Girasol" disabled />
                    </div>
                    
                    <div className="form-group">
                        <label>Plaga:</label>
                        <input type="text" value="Gorgojo" disabled />
                    </div>

                    <div className="form-group">
                        <label>Temperatura:</label>
                        <select name="temperatura" value={formData.temperatura} onChange={handleInputChange}>
                            <option value="">Seleccionar</option>
                            <option value="menor5">Menor a 5°C</option>
                            <option value="entre5y10">Entre 5°C y 10°C</option>
                            <option value="mayor10">Mayor a 10°C</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Fecha de siembra:</label>
                        <select name="siembra" value={formData.siembra} onChange={handleInputChange}>
                            <option value="">Seleccionar</option>
                            <option value="septiembre">Septiembre</option>
                            <option value="octubre">Octubre</option>
                            <option value="noviembre">Noviembre</option>
                        </select>
                    </div>
                </div>

                <button 
                    className="calcular-btn" 
                    onClick={simular} 
                    disabled={!isFormValid}
                    style={{ opacity: isFormValid ? 1 : 0.6 }}
                >
                    SIMULAR
                </button>

                {/* Modal de resultados */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Resultados de la Simulación</h2>
                            <div className="tipo-afectacion">
                                {simulacionResultados.tipo}
                            </div>
                            <table className="resultados-table">
                                <tbody>
                                    <tr>
                                        <th>Característica</th>
                                        <th>Valor</th>
                                    </tr>
                                    <tr>
                                        <td>Temperatura</td>
                                        <td>
                                            {formData.temperatura === 'menor5' && 'Menor a 5°C'}
                                            {formData.temperatura === 'entre5y10' && 'Entre 5°C y 10°C'}
                                            {formData.temperatura === 'mayor10' && 'Mayor a 10°C'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Mes de Siembra</td>
                                        <td>
                                            {formData.siembra === 'septiembre' && 'Septiembre'}
                                            {formData.siembra === 'octubre' && 'Octubre'}
                                            {formData.siembra === 'noviembre' && 'Noviembre'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Humedad</td>
                                        <td>{simulacionResultados.humedad}</td>
                                    </tr>
                                    <tr>
                                        <td>Porcentaje de Afectación</td>
                                        <td>{simulacionResultados.porcentaje}</td>
                                    </tr>
                                    <tr>
                                        <td>Acción Recomendada</td>
                                        <td>{simulacionResultados.accion}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <button className="close-modal" onClick={() => setShowModal(false)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}