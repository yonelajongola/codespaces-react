import React from 'react'
import ReactDom from 'react-dom'

    const MODAL_STYLES = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        backgroundColor: '#ffffff',
        color: '#000000',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        height: '90%',
        width: '90%',
        borderRadius: '8px',
        overflow: 'auto',
        padding: '1rem'
    }
    const OVERLAY_STYLES = {
        position: 'fixed',
        top: '0',
        left: '0',
        bottom: '0',
        right: '0',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 999,
    }
     export default function Modal({ children, onClose }){
        console.log('Modal render, has children:', !!children);
        return ReactDom.createPortal(
        <>
        <div style={OVERLAY_STYLES} onClick={onClose}/>
        <div style={MODAL_STYLES}>
            <button className='btn btn-close bg-danger' style={{position: 'absolute', top: '10px', right: '10px'}} onClick={onClose}></button>
            {children}
        </div>
        </>,
        document.getElementById('cart-root')
            )
     }