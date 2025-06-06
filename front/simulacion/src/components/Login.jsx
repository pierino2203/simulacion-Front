import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/slices/authSlice';
import './Login.css';

export function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
    const [input, setInput] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    function handleChange(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (input.email !== '' && input.password !== '') {
            dispatch(loginUser({
                email: input.email,
                password: input.password
            }));
        } else {
            alert("Ingrese los datos requeridos");
        }
    }

    return (
        <div className="container" id="login-screen">
            <h1>Bienvenido a Agricultural Simulator</h1>
            {error && (
                <div className="error-message" style={{ 
                    color: 'red', 
                    backgroundColor: '#ffebee', 
                    padding: '10px', 
                    borderRadius: '4px',
                    marginBottom: '15px'
                }}>
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '300px', marginBottom: '15px' }}>
                    <label>Usuario:</label>
                    <input 
                        type="email" 
                        name="email"
                        id="email"
                        value={input.email} 
                        onChange={handleChange}
                        disabled={loading}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ width: '300px', marginBottom: '15px' }}>
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        name="password"
                        id="password"
                        value={input.password}
                        onChange={handleChange}
                        disabled={loading}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Cargando...' : 'Ingresar'}
                    </button>
                </div>
            </form>
        </div>
    );
}