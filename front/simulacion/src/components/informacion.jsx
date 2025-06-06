import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Informacion.css';

const Informacion = () => {
    const navigate = useNavigate();

    return (
        <div className="informacion-container">
            <nav className="main-nav">
                <button onClick={() => navigate('/home')}>Simular</button>
                <button onClick={() => navigate('/historial')}>Historial</button>
                <button onClick={() => navigate('/informacion')}>Información</button>
            </nav>

            <div className="container" id="contacto-section">
                <h2>Contacto</h2>
                <div className="info-section">
                    <p>
                        Este simulador permite prever condiciones de riesgo agrícola según variables ambientales y operativas. 
                        Diseñado para orientar decisiones en siembra y fertilización.
                    </p>
                    <p>¿Necesitás ayuda? Te mostramos los medios de contacto disponibles:</p>
                    
                    <ul className="contact-list">
                        <li>
                            <span className="icon">📧</span>
                            <strong>Correo:</strong>
                            <a href="mailto:soporte@agricultural.com">soporte@agricultural.com</a>
                        </li>
                        <li>
                            <span className="icon">☎️</span>
                            <strong>Teléfono:</strong>
                            <a href="tel:0800-2474287">0800-AGRICULTURAL</a>
                        </li>
                    </ul>

                    <p className="direccion">
                        <strong>Dirección:</strong> Bernardino Rivadavia 1050, San Miguel de Tucumán
                    </p>

                    <div className="mapa-contenedor">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10071.283747801877!2d-65.20209177396394!3d-26.816517029914163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225c23b7b6e863%3A0x976c9adc5013942c!2sUniversidad%20Tecnol%C3%B3gica%20Nacional%20-%20Facultad%20Regional%20Tucum%C3%A1n!5e0!3m2!1ses-419!2sar!4v1747618493417!5m2!1ses-419!2sar" 
                            width="400" 
                            height="300" 
                            style={{ border: 0 }} 
                            allowFullScreen="" 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Ubicación de la Universidad Tecnológica Nacional - Facultad Regional Tucumán"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Informacion;
