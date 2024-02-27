import React from 'react'

const Mensaje = ({textoMensaje, tipo}) => {
  return (
    <div className={`alerta ${tipo}`}>{textoMensaje}</div>
  )
}

export default Mensaje