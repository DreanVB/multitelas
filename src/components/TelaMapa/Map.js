import React, { useEffect, useState } from "react";
import { GoogleMap, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";
import './Map.css';
import NotificationPopup from './NotificationPopup'
import { Float } from "@chakra-ui/react";


const MapsWithRoute = ({ origin, destination, valorPorKmEncomenda, quantConvidados,quantConvidadosPersonalizado, cepType, kmImperio, kmProfissionais }) => {
  const apiKey = 'AIzaSyAjsdT4YTOXlV97_vrOGfmoTceCx0Nyr6k';
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,

  });
  const closeNotification = () => {
    setNotification(null);
  };

  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [valoFrete, setValorFrete] = useState(null);
  const [notification, setNotification] = useState(null); // Estado para notificação
  const [buffet, setBuffet] = useState(null);
  const [imperio, setImperio] = useState('');







  // ... código anterior
  const calculaEntrega = async (km) => {
    if (cepType === 1) {
      if (km < 5) {
        setValorFrete(25)
      } else (
        setValorFrete(km * valorPorKmEncomenda)
      )
    } else {
      if (cepType === 2) {
        setValorFrete(quantConvidados)

        // option value={JSON.stringify({ km: 7.61, imperial: 5.02 })}>1 a 5</option>
        // <option value={JSON.stringify({ km: 13, imperial: 9.32 })}>6 a 17</option>
        // <option value={JSON.stringify({ km: 13, imperial: 10.93 })}>Mais que 17</option
      } else {
        if (cepType === 3) {
          setBuffet(km * valorPorKmEncomenda / 0.875);
          setImperio(km * kmImperio / 0.875);
          const valorImperio= (km * kmImperio / 0.875);
          const valorBuffet= (km*valorPorKmEncomenda/0.875)
          const profissionais = (km * kmProfissionais / 0.875);
          if (km < 100) {
            if (kmProfissionais === 9.41) {
              setValorFrete((1000 + valorImperio + valorBuffet))
              console.log(imperio,buffet)
            }
            else {
              if (kmProfissionais === 11.04) {
                setValorFrete(1200 / 0.875 + 1200 / 0.875 + buffet)
              }
              else {
                setValorFrete((valorBuffet + profissionais + valorImperio))
              }
            }
          }
          else {

            setValorFrete((buffet + imperio + profissionais))
          }
        }
        else {
          if (cepType === 4) {
            const valorPorKmEncomenda = 5.89;
            const kmImperio = 7.57;

            const valorBuffet = ((km * valorPorKmEncomenda / 0.875)*quantConvidadosPersonalizado);
            const valorImperio = ((km * kmImperio / 0.875)*quantConvidadosPersonalizado);

            setBuffet(valorBuffet);
            setImperio(valorImperio);
            setValorFrete(valorBuffet + valorImperio);

            console.log(valorBuffet, valorImperio);

          }
          else {
            console.error("Erro com cepType: ", cepType);
          }
        }
      }

    }
  }

  useEffect(() => {
    if (isLoaded && origin && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            const route = result.routes[0];
            const totalDistance = route.legs.reduce((acc, leg) => acc + leg.distance.value, 0);
            const km = ((totalDistance / 1000).toFixed(2) * 2);
            setDistance(km);
            calculaEntrega(km);
            // 👇 aqui você envia a distância para o App.js

          } else {
            setNotification({
              message: `Cep Inválido.`,
              type: "error",
            });
          }
        }
      );
    }
  }, [isLoaded, origin, destination,]);

  if (!isLoaded) return <div>Carregando...</div>;

  return (
    <div className="mapa">

      <GoogleMap zoom={12} mapContainerStyle={{ width: "95%", height: "500px", borderRadius: '30px', margin: '15px' }}>
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
      <div className="result">
        {distance && valoFrete && (
          
            <div className="rr">

            <div>

              <b>Distância da rota:</b> {parseFloat(distance).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} km

              <br />

              <b>Valor do frete: R$</b> {parseFloat(valoFrete).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }
            )}
            </div>

            {cepType === 4 && (
              
                <div>
                  <b>Valor Império: R$</b> {parseFloat(imperio).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}

                  <br />
                  <b>Valor Buffet: R$</b> {parseFloat(buffet).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
            )}
            </div>
          
        )}
      </div>
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

    </div>
  );
};

export default MapsWithRoute;
