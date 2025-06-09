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
                    En esta sección se muestran todas las simulaciones realizadas, incluyendo el tipo de daño detectado,
                    el porcentaje de afectación y las recomendaciones generadas para cada caso.
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
                                    <span className="fecha">
                                        {new Date(item.fecha).toLocaleString()}
                                    </span>
                                </div>
                                <div className="historial-content">
                                    <div className="historial-info">
                                        <div className="info-item">
                                            <span className="label">Tipo de Daño:</span>
                                            <span className="value">{formatearTexto(item.tipoDanio)}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">Porcentaje de Afectación:</span>
                                            <span className="value">{item.porcentaje}</span>
                                        </div>
                                        <div className="info-item recomendacion">
                                            <span className="label">Recomendación:</span>
                                            <span className="value">{item.recomendacion}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}