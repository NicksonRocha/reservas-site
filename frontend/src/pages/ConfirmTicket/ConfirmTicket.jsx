import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  perfilBookingsProduct,
  clearProduct,
  ticketConfirmed,
  clearBookings,
  clearErrors,
} from "../../slices/productSlice";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import style from "./ConfirmTicket.module.css";

import QrScanner from "react-qr-scanner";

const ConfirmTicket = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { productBooking, ticket, error, successMessage } = useSelector(
    (state) => state.products
  );

  const [formData, setFormData] = useState({
    code: "",
    optionId: "",
  });
  const [selectedOption, setSelectedOption] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const [messageConfirm, setMessageConfirm] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false); 
  const [flash, setFlash] = useState(false);

  const handleCaptureClick = () => {
    setFlash(true); 
    setTimeout(() => {
      setFlash(false); 
    }, 300);
  
    
    setShowCamera(!showCamera);
  };

  useEffect(() => {
    dispatch(perfilBookingsProduct(id));

    return () => {
      dispatch(clearProduct());
      dispatch(clearBookings());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (
      productBooking &&
      selectedOption &&
      productBooking.options[selectedOption]
    ) {
      const dates = productBooking.options[selectedOption].map((opt) => opt.date);
      setAvailableDates(dates);
    } else {
      setAvailableDates([]);
    }
  }, [selectedOption, productBooking]);

  const handleOptionChange = (e) => {
    const selectedOptionId = e.target.value;
    const selectedOptionName = Object.keys(productBooking.options).find((key) =>
      productBooking.options[key].some(
        (opt) => opt.id === parseInt(selectedOptionId)
      )
    );

    setSelectedOption(selectedOptionName);
    setSelectedDate("");
    setAvailableTimes([]);
    setFormData({ ...formData, optionId: selectedOptionId });
  };

  const handleDateSelect = (formattedDate) => {
    if (availableDates.includes(formattedDate)) {
      setSelectedDate(formattedDate);

      const times = productBooking.options[selectedOption]
        .filter((opt) => opt.date === formattedDate)
        .map((opt) => ({
          id: opt.id,
          startHour: opt.startHour,
          endHour: opt.endHour,
          availability: opt.availability,
        }));
      setAvailableTimes(times);
    }
  };

  const handleTimeSelect = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleScan = (data) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data.text);
        const { code, optionId } = parsedData;
  
        if (code && optionId && selectedTime) {
          dispatch(
            ticketConfirmed({
              data: { code, optionId, selectedTime },
            })
          )
            .unwrap()
            .then(() => {
              setMessageConfirm(true);
              setShowCamera(false);
              setTimeout(() => {
                setMessageConfirm(false);
              }, 3000);
            })
            .catch((error) => {
              if (error === "Ticket já usado!") {
                setMessageConfirm(false);
                setShowCamera(false);
                setErrorPopup(true); 
                setTimeout(() => {
                  setErrorPopup(false); 
                }, 3000);
                dispatch(clearErrors())
              } else {
                console.error(error || "Erro ao confirmar ticket.");
              }
            });
            
        }
      } catch (error) {
        console.error("Erro ao processar QR Code:", error.message);
      }
    }
  };
  
  

  const handleError = (err) => {
    console.error("Erro ao escanear QR Code:", err);
  };

const handleConfirmTicket = () => {
  if (!formData.code || !formData.optionId || !selectedTime) {
    alert(
      "Por favor, preencha o código, selecione uma opção, data e horário antes de confirmar."
    );
    return;
  }

  dispatch(
    ticketConfirmed({
      data: { ...formData, optionId: selectedTime },
    })
  )
    .unwrap()
    .then(() => {
      setMessageConfirm(true);
      setTimeout(() => {
        setMessageConfirm(false);
      }, 3000);
    })
    .catch((error) => {
      if (error === "Ticket já usado!") {
        setMessageConfirm(false); 
        setErrorPopup(true); 
        setTimeout(() => {
          setErrorPopup(false);
          dispatch(clearErrors())
        }, 3000);
      } else {
        console.error(error || "Erro ao confirmar ticket.");
      }
    });
};


  return (
    <div className={style.container}>
      <div className={style.leftSide}>
        <div className={style.leftSideImg}>
          {productBooking.images && productBooking.images.length > 1 ? (
            <div className={style.sliderContainer}>
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    (prev) =>
                      (prev + productBooking.images.length - 1) %
                      productBooking.images.length
                  )
                }
                className={style.sliderButton}
              >
                ❮
              </button>
              <img
                src={productBooking.images[currentImageIndex]}
                alt={`Imagem ${currentImageIndex + 1}`}
                className={style.sliderImage}
              />
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    (prev) => (prev + 1) % productBooking.images.length
                  )
                }
                className={style.sliderButton}
              >
                ❯
              </button>
            </div>
          ) : (
            <img
              src={productBooking.images?.[0]}
              alt={productBooking.title}
              className={style.imageProduct}
            />
          )}
        </div>

        <h4 className={style.title}>{productBooking.title}</h4>


      </div>

      <div className={style.midSide}>
        <label htmlFor="options">Escolha uma opção:</label>
        <select
          id="options"
          onChange={handleOptionChange}
          className={style.select}
        >
          <option value="">Selecione</option>
          {Object.entries(productBooking.options || {}).map(
            ([optionName, options]) => (
              <option key={options[0].id} value={options[0].id}>
                {optionName} - R${" "}
                {options[0].price
                  ? parseFloat(options[0].price).toFixed(2)
                  : "0,00"}
              </option>
            )
          )}
        </select>

        <div className={style.calendarContainer}>
          <Calendar
            className={style.calendar}
            tileClassName={({ date }) => {
              const formattedDate = `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
              if (formattedDate === selectedDate) {
                return style.selectedDate;
              }
              if (
                productBooking &&
                selectedOption &&
                productBooking.options[selectedOption]
              ) {
                const datesWithOptions = productBooking.options[selectedOption].map(
                  (opt) => opt.date
                );
                if (datesWithOptions.includes(formattedDate)) {
                  return style.dateAvailable;
                }
              }
              return style.dateUnavailable;
            }}
            tileDisabled={({ date }) => {
              const formattedDate = `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
              return !availableDates.includes(formattedDate);
            }}
            onClickDay={(date) => {
              const formattedDate = `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
              handleDateSelect(formattedDate);
            }}
          />
        </div>

        {selectedDate && availableTimes.length > 0 && (
          <>
            <label htmlFor="times">Horários disponíveis:</label>
            <select
              id="times"
              onChange={handleTimeSelect}
              className={style.select}
            >
              <option value="">Selecione um horário</option>
              {availableTimes.map((timeData) => (
                <option key={timeData.id} value={timeData.id}>
                  Hr {timeData.startHour} - {timeData.endHour}
                  {parseInt(timeData.availability) > 0
                    ? ` (${timeData.availability})`
                    : " (ESGOTADO)"}
                </option>
              ))}
            </select>
          </>
        )}

        <label htmlFor="code" >
          Código do Ticket:
        </label>
        <div className={style.placeCode}>
  <input
    type="text"
    id="code"
    value={formData.code}
    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
    className={style.inputCode}
  />
  <button
  onClick={() => setShowCamera(!showCamera)}
  className={style.scanButton}
>
  {showCamera ? (
    "X"
  ) : (
    <img src="/iconCamera.png" alt="Ícone de câmera" className={style.iconCam} />
  )}
</button>
</div>
        
          
        {showCamera && (
          <div className={style.cameraContainer}>
            <div className={style.cameraContent}>
            <button
    onClick={() => setShowCamera(!showCamera)}
    className={style.scanButtonPopUp}
  >
    {showCamera ? (
      "X"
    ) : (
      <img
        src="/iconCamera.png"
        alt="Ícone de câmera"
        className={style.iconCam}
      />
    )}
  </button>
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
            </div>            
          </div>
        )}

<div className={style.buttonContainer}>
    <button onClick={handleConfirmTicket} className={style.btns}>
        Confirmar Ticket
    </button>
</div>
        
        {successMessage && <p className={style.success}>{successMessage}</p>}
        {error && <p className={style.error}>{error}</p>}
      </div>
      {messageConfirm && (
          <div className={style.modal}>
            <div className={style.modalContent}>
            <h1>TICKET CONFIRMADO ✅</h1>
            
            </div>
            </div>
          
        )}
        {errorPopup && (
  <div className={style.modalError}>
    <div className={style.modalContentError}>
      <h1>Ticket já foi usado!</h1>
    </div>
  </div>
)}
      <div className={style.rightSide}>
        <h2>Informações do último cliente.</h2>
        {ticket && ticket.booking ? (
          <>
            <h3>{ticket.message} ✅</h3>
            <p>
              <strong>Nome: </strong>
              {ticket.booking.ownerName}
            </p>
            <p>
              <strong>Email: </strong>
              {ticket.booking.email}
            </p>
            <p>
              <strong>Data: </strong>
              {ticket.booking.birthDate
                ? ticket.booking.birthDate
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("/")
                : "Não disponível"}
            </p>
            <strong>{ticket.booking.cpf ? "CPF" : "Passaporte"}:</strong>{" "}
            {ticket.booking.cpf || ticket.booking.passportNumber || "Não disponível"}
          </>
        ) : (
          <p>Ainda não possui informações...</p>
        )}
      </div>
    </div>
  );
};

export default ConfirmTicket;
