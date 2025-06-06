import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk para obtener las simulaciones
export const getSimulaciones = createAsyncThunk(
    'simulador/getSimulaciones',
    async () => {
        try {
            console.log('Obteniendo simulaciones del backend...');
            const response = await axios.get('http://localhost:3001/simulacion');
            console.log('Simulaciones obtenidas:', response.data);
            return response.data.data; // Retornamos directamente el array de simulaciones
        } catch (error) {
            console.error('Error al obtener simulaciones:', error);
            throw error;
        }
    }
);

// Async thunk para guardar la simulación
export const postSimulacion = createAsyncThunk(
    'simulador/postSimulacion',
    async (simulacionData) => {
        try {
            console.log('Enviando datos al backend:', simulacionData);
            const response = await axios.post('http://localhost:3001/simulacion', simulacionData);
            console.log('Respuesta del backend:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error al guardar la simulación:', error);
            throw error;
        }
    }
);

const simuladorSlice = createSlice({
    name: 'simulador',
    initialState: {
        simulaciones: [],
        loading: false,
        error: null
    },
    reducers: {
        guardarSimulacionLocal: (state, action) => {
            console.log('Guardando simulación local:', action.payload);
            const nuevaSimulacion = {
                ...action.payload,
                fecha: new Date().toLocaleString()
            };
            state.simulaciones.push(nuevaSimulacion);
            
            // Guardar en localStorage
            const simulacionesGuardadas = JSON.parse(localStorage.getItem('simulaciones') || '[]');
            simulacionesGuardadas.push(nuevaSimulacion);
            localStorage.setItem('simulaciones', JSON.stringify(simulacionesGuardadas));
        }
    },
    extraReducers: (builder) => {
        builder
            // Manejo de getSimulaciones
            .addCase(getSimulaciones.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSimulaciones.fulfilled, (state, action) => {
                state.loading = false;
                state.simulaciones = action.payload;
            })
            .addCase(getSimulaciones.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                console.error('Error en getSimulaciones:', action.error);
            })
            // Manejo de postSimulacion
            .addCase(postSimulacion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postSimulacion.fulfilled, (state, action) => {
                state.loading = false;
                state.simulaciones.push(action.payload);
                // También guardar en localStorage cuando se guarda exitosamente en el backend
                const simulacionesGuardadas = JSON.parse(localStorage.getItem('simulaciones') || '[]');
                simulacionesGuardadas.push(action.payload);
                localStorage.setItem('simulaciones', JSON.stringify(simulacionesGuardadas));
            })
            .addCase(postSimulacion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                console.error('Error en postSimulacion:', action.error);
            });
    }
});

export const { guardarSimulacionLocal } = simuladorSlice.actions;
export default simuladorSlice.reducer;