import React, { useEffect, useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { pasarDolares } from '../helpers'
import axios from 'axios'


const ControlPresupuesto = ({
    presupuesto,
    gastos,
    setPresupuesto,
    setGastos,
    setIsValidPresupuesto
}) => {

    const [disponible, setDisponible] = useState(0)
    const [gastado, setGastado] = useState(0)
    const [porcentaje, setPorcentaje] = useState(0)
    const [dolar, setDolar] = useState(undefined)

    useEffect(() => {
        const totalGastado = gastos.reduce((total, gasto) => gasto.cantidad + total, 0)
        const totalDisponible = presupuesto - totalGastado;

        //calcular porcentaje gastado
        const nuevoPorcentaje = (((presupuesto - totalDisponible) / presupuesto) * 100).toFixed(2);

        setGastado(totalGastado)
        setDisponible(totalDisponible)
        setTimeout(() => {
            setPorcentaje(nuevoPorcentaje)
        }, 1500);
    }, [gastos])

    useEffect(() => {
        
        axios.get('https://dolarapi.com/v1/dolares/blue')
            .then(function (response) {
                setDolar(response.data.venta)
            })
            .catch(function (error) {
                console.log(error);
                alert("La API del dolar no funciona")
            })
    }, [])
    
    

    const formatearCantidad = (cantidad) => {
        return cantidad.toLocaleString('en-US', {
            style: 'currency',
            currency: 'ARS'
        })
    }

    const handleResetApp = () => {
        const resultado = confirm ('¿Deseas reiniciar presupuesto y gastos?')
        if(resultado){
            setGastos([])
            setPresupuesto(0)
            setIsValidPresupuesto(false)
        }
    }   

    return (
        <div className='contenedor-presupuesto contenedor sombra dos-columnas'>
        {
            dolar != undefined ? (
                <>
                <div>
                <CircularProgressbar
                    styles={buildStyles({
                        pathColor: porcentaje > 100 ? '#DC2626' : '#3B82F6',
                        trailColor: '#F5F5F5',
                        textColor: porcentaje > 100 ? '#DC2626' : '#3B82F6',

                    })}
                    value={porcentaje}
                    text={`${porcentaje}% Gastado`}

                />
            </div>

            <div className='contenido-presupuesto'>
                <button
                    className='reset-app'
                    type='button'
                    onClick={handleResetApp}
                >
                    Reiniciar App
                </button>
                <p>
                    <span>Presupuesto: </span>{formatearCantidad(Number(presupuesto))} - <small>(USD {pasarDolares(Number(presupuesto), dolar)})</small>
                </p>
                <p className={`{disponible < 0 ? 'negativo' : ''}`}>
                    <span>Disponible: </span>{formatearCantidad(disponible)} - <small>(USD {pasarDolares(Number(disponible), dolar)})</small> 
                </p>
                <p>
                    <span>Gastado: </span>{formatearCantidad(gastado)} - <small>(USD {pasarDolares(Number(gastado), dolar)})</small>
                </p>
            </div>
                </>
            ) : (
                <span>Cargando...</span>
            )
        }
        </div>
    )
}

export default ControlPresupuesto