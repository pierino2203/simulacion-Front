import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { guardarSimulacionLocal, postSimulacion } from '../redux/slices/simuladorSlice';
import './Home.css';
import { simular } from './funciones/GenyModelo';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function Home() {
    const dispatch = useDispatch();
    const [chartData, setChartData] = useState({
        labels: ['Leve', 'Moderado', 'Severo', 'Extremo'],
        datasets: [{
            label: 'Nivel de Daño',
            data: [0, 0, 0, 0],
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(153, 102, 255, 0.6)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    });

    function handleSubmit(){
        const [tipoDanio, r1, r2, r3, r4] = simular();
        const total = r1 + r2 + r3 + r4;
        const porcentajeMaximo = ((Math.max(r1, r2, r3, r4) / total) * 100).toFixed(2);
        
        let recomendacion = "";
        if (tipoDanio === "LEVE") {
            recomendacion = "Pocas plantas afectadas. Se recomienda un monitoreo normal.";
        } else if (tipoDanio === "MODERADO") {
            recomendacion = "Intensificar el monitoreo.";
        } else if (tipoDanio === "SEVERO") {
            recomendacion = "Se evalúa posibilidad de resiembra parcial.";
        } else {
            recomendacion = "Se recomienda la resiembra total dado que se detectó casi toda la cosecha afectada.";
        }

        // Ajustado para coincidir con el modelo de la base de datos
        const simulacionData = {
            tipoDanio: tipoDanio,
            porcentaje: `${porcentajeMaximo}%`,
            recomendacion: recomendacion,
            
        };

        // Guardar en la base de datos
        dispatch(postSimulacion(simulacionData));
        // Guardar en el estado local

        setSimulacionResultados(prev => ({
            ...prev,
            tipo: tipoDanio,
            porcentaje: `${porcentajeMaximo}%`,
            recomendacion: recomendacion
        }));
        
        setChartData(prev => ({
            ...prev,
            datasets: [{
                ...prev.datasets[0],
                data: [r1, r2, r3, r4]
            }]
        }));
        
        setShowModal(true);
    }

    const [showModal, setShowModal] = useState(false);
    const [simulacionResultados, setSimulacionResultados] = useState({
        humedad: '',
        accion: '',
        porcentaje: '',
        tipo: '',
        recomendacion: ''
    });

    const handleCloseModal = () => {
        setShowModal(false);
        window.location.reload();
    };

    return (
        <div className="home-container">
            <nav className="main-nav">
                <button onClick={simular}>Simular</button>
                <button onClick={() => window.location.href = '/historial'}>Historial</button>
                <button onClick={() => window.location.href = '/informacion'}>Información</button>
            </nav>

            <div className="container">
                <div className="simulacion-info">
                    <h2>Simulador de Impacto del Gorgojo en Cultivos de Girasol</h2>
                    <p>
                        Este simulador analiza diferentes escenarios de cultivo considerando múltiples variables:
                    </p>
                    <ul>
                        <li>Diferentes fechas de siembra (Septiembre, Octubre, Noviembre)</li>
                        <li>Variaciones de temperatura (menor a 5°C, entre 5°C y 10°C, mayor a 10°C)</li>
                        <li>Niveles de humedad (baja, intermedia, alta)</li>
                    </ul>
                    <p>
                        Al presionar el botón "SIMULAR", el sistema generará múltiples escenarios aleatorios 
                        para evaluar cómo estas condiciones afectan al cultivo de girasol frente al ataque del gorgojo. 
                        Los resultados mostrarán la distribución de los niveles de daño y el tipo de afectación predominante.
                    </p>
                </div>

                <button 
                    className="calcular-btn" 
                    onClick={handleSubmit}
                >
                    SIMULAR
                </button>

                {/* Modal de resultados */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Resultados de la Simulación</h2>
                            <div className="tipo-afectacion">
                                <p>Tipo de Daño: {simulacionResultados.tipo}</p>
                                <p>Porcentaje de Afectación: {simulacionResultados.porcentaje}</p>
                                <p className="recomendacion">Recomendación: {simulacionResultados.recomendacion}</p>
                            </div>
                            <div style={{ width: '100%', height: '300px', margin: '20px 0' }}>
                                <Bar
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                            title: {
                                                display: true,
                                                text: 'Distribución de Daños'
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <button className="close-modal" onClick={handleCloseModal}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}