import React, { useEffect } from 'react';
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}
const AdSense: React.FC = () => {
  useEffect(() => {
    // Cargar el script de Google AdSense
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.onload = () => {
      // Configurar Google AdSense una vez que el script haya cargado
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    };
    document.body.appendChild(script);

    return () => {
      // Limpiar el script cuando el componente se desmonte
      document.body.removeChild(script);
    };
  }, []);

  return (
    <ins className="adsbygoogle"
      style={{ display: 'block', textAlign: 'center' }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXX" // Reemplaza con tu ID de cliente
      data-ad-slot="XXXXXXXXXX" // Reemplaza con tu ID de slot
      data-ad-format="auto"></ins>
  );
};

export default AdSense;