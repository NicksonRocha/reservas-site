
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { myBookings, deleteBooking } from "../../slices/productSlice";
import style from "./Reservation.module.css";
import ImageSliderMyBookings from "../../components/ImageSliderMyBookings";

const Reservation = () => {
  const dispatch = useDispatch();
  const { loading, error, myBookingsTickets } = useSelector(
    (state) => state.products
  );

  const [selectedTicketId, setSelectedTicketId] = useState(null); 

  const [openCancel, setOpenCancel] = useState(false)
  const [selectedidCancel, setSelectedIdCancel] = useState(null)

  const [isLoading, setIsLoading] = useState(true);
      
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    dispatch(myBookings());    
  }, [dispatch]);

  const handleOpenCancelTicket = () => {
    setOpenCancel(true)    
  }

  const handleCancelTicket = async () => {
    await dispatch(deleteBooking(selectedTicketId))
    dispatch(myBookings())
    setOpenCancel(false)
  }

  const closeCancelTicket = () => {
    setOpenCancel(false)
  }

  

  const handleOpenBox = (ticketId) => {
    setSelectedTicketId(ticketId); 
  };

  const fechar = (event) => {
    event.stopPropagation(); 
    setSelectedTicketId(null); 
  };

  if (loading) {
    return <p>Carregando reservas...</p>;
  }

  if (error) {
    return <p>Erro ao carregar reservas: {error}</p>;
  }

if (!myBookingsTickets.length) {
  return <div className={style.without_bookings}>
    <h1>Minhas Reservas:</h1> 
    <strong><p>Nenhuma reserva encontrada.</p></strong>
    </div>;
}

  return (
    <div className={style.containerFull}>
      
      {myBookingsTickets && myBookingsTickets.length > 0 ? (
        <div>
          <h1 className={style.textTitle}>Minhas Reservas</h1>
          {myBookingsTickets.map((booking) => (
            <div
              className={`${style.ticket} ${!booking.optionTour.isValid ? style.invalidTicket : '' }`}
              key={booking.booking.id}
              onClick={() => handleOpenBox(booking.booking.id)} 
            >
              <div className={style.box_image}>
                
                {booking.product.images && booking.product.images.length > 1 ? (
                  <ImageSliderMyBookings
                    productId={booking.product.id}
                    images={booking.product.images}
                    onClickImage={() => handleOpenBox(booking.booking.id)}
                  />
                ) : (
                  booking.product.images &&
                  booking.product.images.map((image, index) => (
                    <div>
                      {isLoading && <div className={style.spinner}></div>}
                      <img
                      src={image}
                      alt={`Imagem do produto ${booking.product.name}`}
                      onLoad={handleImageLoad}
                    style={{ display: isLoading ? 'none' : 'block' }}
                      className={style.imageProduct}
                      key={index}
                    /></div>
                    
                  ))
                )}

                
              </div>

              <div
                className={`${style.box_mini_info} ${
                  !booking.optionTour.isValid ? style.invalidTicket : ""
                }`}
              >
                <h3>{booking.product.name}</h3>
                <p>
                  <strong>Opção:</strong> {booking.optionTour.name}
                </p>
                <p>
                  <strong>Nome:</strong> {booking.booking.ownerName}
                </p>
                <p>
                  <strong>Data:</strong> {booking.optionTour.date.split('-').reverse().join('/')}
                </p>
                <p>
                  <strong>Horário:</strong> {booking.optionTour.startHour} -{" "}
                  {booking.optionTour.endHour}
                </p>
              </div>

              {selectedTicketId === booking.booking.id && (
                <div className={style.modal}>
                  <div className={style.miniModalContent}>
                  <button onClick={fechar} className={style.fechar}>
                      X
                    </button>
                <div className={style.mini_box_head}> {booking.product.images && booking.product.images.length > 1 ? (
                  <ImageSliderMyBookings
                    productId={booking.product.id}
                    images={booking.product.images}
                    onClickImage={() => handleOpenBox(booking.booking.id)}
                  />
                ) : (
                  booking.product.images &&
                  booking.product.images.map((image, index) => (<div>{isLoading && <div className={style.spinner}></div>}
                    <img
                      src={image}
                      alt={`Imagem do produto ${booking.product.name}`}
                      className={style.imageProduct}
                      onLoad={handleImageLoad}
                    style={{ display: isLoading ? 'none' : 'block' }}
                      key={index}
                    /></div>
                  ))
                )}
                <div>
                  <h3>{booking.product.name}</h3>
<p>
                      <strong>Preço:</strong> R$ {booking.product.price}
                    </p>
                </div>
                

                </div>

                {booking.bookingCode && booking.bookingCode.qrCodeImage && (
    <img
      src={booking.bookingCode.qrCodeImage}
      alt={`QR Code para a reserva ${booking.bookingCode.encryptedId}`}
      className={style.qrCodeImage}
    />
  )}
  {booking.bookingCode && (
    <p>
      <strong>Código:</strong> {booking.bookingCode.encryptedId}
    </p>
  )} 
                    
                    
                {booking.optionTour && (
                      <>
                        <p>
                          <strong>Opção de Passeio:</strong>{" "}
                          {booking.optionTour.name}
                        </p>
                        <p>
                          <strong>Data do Passeio:</strong>{" "}
                          {booking.optionTour.date.split("-")
                    .reverse()
                    .join("/")}
                        </p>
                        <p>
                          <strong>Horário:</strong>{" "}
                          {booking.optionTour.startHour} -{" "}
                          {booking.optionTour.endHour}
                        </p>
                        <p>
                          <strong>Opção:</strong> R${" "}
                          {booking.optionTour.price}
                        </p>
                      </>
                    )}
                    <p>
                      <strong>Nome:</strong>{" "}
                      {booking.booking.ownerName}
                    </p>
                    <p>
                      <strong>Data de Nascimento:</strong>{" "}
                      {booking.booking.birthDate.split("T")[0]
                    .split("-")
                    .reverse()
                    .join("/")}
                    </p>
                    
                    <p>
                <strong>{booking.booking.cpf ? "CPF" : "Passaporte"}:</strong>{" "}
                {booking.booking.cpf || booking.booking.passportNumber}
              </p>     

              <p>
  <strong>Status do Passeio:</strong>{" "}
  {booking.optionTour.isValid ? (
    <span className={style.valid}>Válido</span>
  ) : (
    <span className={style.invalid}>Inválido</span>
  )}
</p>      
                 
<button onClick={() => handleOpenCancelTicket()} className={style.cancelButton}>CANCELAR</button>



                  </div>
                  <div className={style.modalContent}>
                  
                  <div className={style.boxModalLeft} >
                    
                    <div className={style.box_image_modal}>
                {booking.product.images && booking.product.images.length > 1 ? (
                  <ImageSliderMyBookings
                    productId={booking.product.id}
                    images={booking.product.images}
                    onClickImage={() => handleOpenBox(booking.booking.id)}
                  />
                ) : (
                  booking.product.images &&
                  booking.product.images.map((image, index) => (<div>{isLoading && <div className={style.spinner}></div>}
                    <img
                      src={image}
                      alt={`Imagem do produto ${booking.product.name}`}
                      className={style.imageProduct}
                      onLoad={handleImageLoad}
                    style={{ display: isLoading ? 'none' : 'block' }}
                      key={index}
                    /></div>
                  ))
                )}
                </div>
  
<div className={style.box_qr_code}>
  {booking.bookingCode && booking.bookingCode.qrCodeImage && (
    <img
      src={booking.bookingCode.qrCodeImage}
      alt={`QR Code para a reserva ${booking.bookingCode.encryptedId}`}
      className={style.qrCodeImage}
    />
  )}
  {booking.bookingCode && (
    <p>
      <strong>Código:</strong> {booking.bookingCode.encryptedId}
    </p>
  )}
  
  <button onClick={() => handleOpenCancelTicket()} className={style.cancelButton}>CANCELAR</button>

</div>
                
                
              </div>
              
              <div className={style.box_info_modal}>
                    <button onClick={fechar} className={style.fechar}>
                      X
                    </button>
                <h3>{booking.product.name}</h3>
                    <p>
                      <strong>Preço:</strong> R$ {booking.product.price}
                    </p>
                {booking.optionTour && (
                      <>
                        <p>
                          <strong>Opção de Passeio:</strong>{" "}
                          {booking.optionTour.name}
                        </p>
                        <p>
                          <strong>Data do Passeio:</strong>{" "}
                          {booking.optionTour.date.split("-")
                    .reverse()
                    .join("/")}
                        </p>
                        <p>
                          <strong>Horário:</strong>{" "}
                          {booking.optionTour.startHour} -{" "}
                          {booking.optionTour.endHour}
                        </p>
                        <p>
                          <strong>Opção:</strong> R${" "}
                          {booking.optionTour.price}
                        </p>
                      </>
                    )}
                    <p>
                      <strong>Nome:</strong>{" "}
                      {booking.booking.ownerName}
                    </p>
                    <p>
                      <strong>Data de Nascimento:</strong>{" "}
                      {booking.booking.birthDate.split("T")[0]
                    .split("-")
                    .reverse()
                    .join("/")}
                    </p>
                    
                    <p>
                <strong>{booking.booking.cpf ? "CPF" : "Passaporte"}:</strong>{" "}
                {booking.booking.cpf || booking.booking.passportNumber}
              </p>     

              <p>
  <strong>Status do Passeio:</strong>{" "}
  {booking.optionTour.isValid ? (
    <span className={style.valid}>Válido</span>
  ) : (
    <span className={style.invalid}>Inválido</span>
  )}
</p>      
              </div>
                    
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Você ainda não possui reservas.</p>
      )}{openCancel && (<>

<div className={style.modalOverlay}>
<div className={style.modalContentCancel}>
<p>Você deseja cancelar ?</p>
<button className={style.confirmButton} onClick={() => {handleCancelTicket()}}>Sim</button>
              <button className={style.cancelCancelButton} onClick={() => closeCancelTicket()}>Não</button>
                </div>
              </div>
              
              </>)}
    </div>
  );
};

export default Reservation;
