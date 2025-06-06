import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSimulaciones } from '../redux/slices/simuladorSlice';
import './Historial.css';

export function Historial() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { simulaciones, loading, error } = useSelector((state) => state.simulador);

    useEffect(() => {
        dispatch(getSimulaciones());
    }, [dispatch]);

    // Función para formatear el texto
    const formatearTexto = (texto) => {
        if (!texto) return '';
        // Reemplazar guiones bajos y guiones por espacios
        let textoFormateado = texto.replace(/[_-]/g, ' ');
        // Convertir a mayúsculas
        textoFormateado = textoFormateado.toUpperCase();
        // Capitalizar cada palabra
        return textoFormateado.split(' ').map(palabra => 
            palabra.charAt(0) + palabra.slice(1).toLowerCase()
        ).join(' ');
    };

    // Función para formatear la temperatura
    const formatearTemperatura = (temp) => {
        const temperaturas = {
            'menor5': 'Menor a 5°C',
            'entre5y10': 'Entre 5°C y 10°C',
            'entre10y15': 'Entre 10°C y 15°C',
            'entre15y20': 'Entre 15°C y 20°C',
            'mayor20': 'Mayor a 20°C'
        };
        return temperaturas[temp] || formatearTexto(temp);
    };

    // Función para formatear el mes
    const formatearMes = (mes) => {
        const meses = {
            'enero': 'Enero',
            'febrero': 'Febrero',
            'marzo': 'Marzo',
            'abril': 'Abril',
            'mayo': 'Mayo',
            'junio': 'Junio',
            'julio': 'Julio',
            'agosto': 'Agosto',
            'septiembre': 'Septiembre',
            'octubre': 'Octubre',
            'noviembre': 'Noviembre',
            'diciembre': 'Diciembre'
        };
        return meses[mes.toLowerCase()] || formatearTexto(mes);
    };

    return (
        <div className="historial-container">
            <nav className="main-nav">
                <button onClick={() => navigate('/home')}>Simular</button>
                <button onClick={() => navigate('/historial')}>Historial</button>
                <button onClick={() => navigate('/informacion')}>Información</button>
            </nav>

            <div className="container">
                <h2>Historial de Simulaciones</h2>
                <p>
                    En esta pestaña se listan las simulaciones realizadas. Cada registro incluye la fecha de ejecución, 
                    los valores ingresados por el usuario y el resultado obtenido. Sirve como referencia para analizar 
                    condiciones simuladas en distintos escenarios.
                </p>

                {loading ? (
                    <div className="loading">Cargando simulaciones...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : !Array.isArray(simulaciones) || simulaciones.length === 0 ? (
                    <div className="no-simulaciones">No hay simulaciones aún.</div>
                ) : (
                    <div className="historial-list">
                        {simulaciones.map((item, index) => (
                            <div key={item._id || index} className="historial-item">
                                <div className="historial-header">
                                    <strong>Simulación #{simulaciones.length - index}</strong>
                                </div>
                                <div className="historial-fecha">
                                    <u>Fecha:</u> {new Date(item.fecha).toLocaleString()}
                                </div>
                                <div className="historial-grid">
                                    <div><u>Temperatura:</u> {formatearTemperatura(item.temperatura)}</div>
                                    <div><u>Mes de Siembra:</u> {formatearMes(item.mesSiembra)}</div>
                                    <div><u>Humedad:</u> {formatearTexto(item.humedad)}</div>
                                    <div><u>Porcentaje de Afectación:</u> {formatearTexto(item.porcentajeAfectacion)}</div>
                                    <div><u>Resultado:</u> {formatearTexto(item.resultado)}</div>
                                    <div><u>Acción Recomendada:</u> {formatearTexto(item.accionRecomendada)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}