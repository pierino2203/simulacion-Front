export function Generar(n, t, cantidad) {
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
        nuevaSemilla = Math.abs(parseInt(numero2) - parseInt(numero1))
        resultadosArray.push({
            u: nuevaSemilla / Math.pow(10, nuevaSemilla.toString().length)
        })
        num = nuevaSemilla
        cantidad--
    }
    return resultadosArray;
}

export function simular() {
    let f;
    let t;
    let h;
    const fSep = "Septiembre"
    const fOct = "Octubre"
    const fNov = "Noviembre"
    const t5 = "menor5"
    const t5y10 = "entre5y10"
    const t10 = "mayor10"
    const h1 = "baja"
    const h2 = "intermedia"
    const h3 = "alta"
    let resultado
    let i = 0
    let r1 = 0;
    let r2 = 0;
    let r3 = 0;
    let r4 = 0;

    const numerosU = Generar(Math.floor(Math.random() * 9000) + 1000, Math.floor(Math.random() * 100) + 1, 5);
    let u1 = numerosU[0].u;
    let cantPlantas = 35000 + 25000 * u1;
    
    while (i <= cantPlantas) {
        const numerosU = Generar(Math.floor(Math.random() * 9000) + 1000, Math.floor(Math.random() * 100) + 1, 5);
        let u1 = numerosU[0].u;
        let u2 = numerosU[1].u;
        let u3 = numerosU[2].u;
        let u4 = numerosU[3].u;
        let u5 = numerosU[4].u;

        if (u2 <= 0.55) {
            f = fOct
        } else if (u2 <= 0.8) {
            f = fNov
        } else {
            f = fSep
        }

        if (u3 < 0.681) {
            t = t5y10
        } else if (u3 <= 0.933) {
            t = t10
        } else {
            t = t5
        }

        if (u4 <= 0.5) {
            h = h2
        } else if (u4 <= 0.8) {
            h = h3
        } else {
            h = h1
        }

        // LEVE: Condiciones óptimas (menor probabilidad de ataque)
        // Humedad baja es óptima para prevenir el ataque
        if (
            (h === h1 && f === fSep) || // Septiembre con humedad baja siempre es leve
            (h === h1 && f === fOct && t === t5) || // Octubre con humedad baja y temperatura baja
            (h === h1 && f === fNov && t === t5) || // Noviembre con humedad baja y temperatura baja
            (h === h2 && f === fSep && t === t5) // Septiembre con humedad media y temperatura baja
        ) {
            r1++;
        }
        // EXTREMO: Condiciones más adversas (mayor probabilidad de ataque)
        // Humedad alta favorece el ataque severo
        else if (
            (h === h3 && f === fOct) || // Octubre con humedad alta siempre es extremo
            (h === h3 && f === fNov && t === t10) || // Noviembre con humedad alta y temperatura alta
            (h === h3 && f === fNov && t === t5y10) || // Noviembre con humedad alta y temperatura media
            (h === h2 && f === fOct && t === t10) // Octubre con humedad media y temperatura alta
        ) {
            r4++;
        }
        // SEVERO: Condiciones adversas
        // Combinaciones de humedad alta/media con condiciones desfavorables
        else if (
            (h === h3 && f === fSep) || // Septiembre con humedad alta
            (h === h3 && f === fNov && t === t5) || // Noviembre con humedad alta y temperatura baja
            (h === h2 && f === fOct && t === t5y10) || // Octubre con humedad media y temperatura media
            (h === h2 && f === fNov && t === t10) // Noviembre con humedad media y temperatura alta
        ) {
            r3++;
        }
        // MODERADO: Condiciones intermedias
        // Combinaciones donde las condiciones no son ni óptimas ni extremadamente adversas
        else if (
            // Septiembre con condiciones intermedias
            (f === fSep && t === t5y10 && h === h2) || // Septiembre con temperatura media y humedad media
            (f === fSep && t === t10 && h === h1) || // Septiembre con temperatura alta y humedad baja
            
            // Octubre con condiciones intermedias
            (f === fOct && t === t5 && h === h2) || // Octubre con temperatura baja y humedad media
            (f === fOct && t === t5y10 && h === h1) || // Octubre con temperatura media y humedad baja
            
            // Noviembre con condiciones intermedias
            (f === fNov && t === t5 && h === h2) || // Noviembre con temperatura baja y humedad media
            (f === fNov && t === t5y10 && h === h1) || // Noviembre con temperatura media y humedad baja
            (f === fNov && t === t5y10 && h === h2) // Noviembre con temperatura media y humedad media
        ) {
            r2++;
        }
        // Si no entra en ninguna categoría, se asigna a MODERADO
        else {
            r2++;
        }
        i++;
    }

    let max = Math.max(r1, r2, r3, r4);

    if (max === r1) {
        resultado = "LEVE";
    } else if (max === r2) {
        resultado = "MODERADO";
    } else if (max === r3) {
        resultado = "SEVERO";
    } else {
        resultado = "EXTREMO";
    }
    return [resultado, r1, r2, r3, r4]
}

