import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  perfilBookingsProduct,
  clearProduct,
  fetchBookingsByOptionTour,
  clearBookings,
  deleteBooking,
} from "../slices/productSlice";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import style from "./BookingsPage.module.css";

const BookingsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { bookings, loading, error, productBooking, successMessage } = useSelector(
    (state) => state.products
  );

  const [selectedOption, setSelectedOption] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  
    const handleImageLoad = () => {
      setIsLoading(false);
    };

  useEffect(() => {
    dispatch(perfilBookingsProduct(id));
    return () => {
      dispatch(clearProduct());
      dispatch(clearBookings());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (productBooking && selectedOption && productBooking.options[selectedOption]) {
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
  };

  const handleBookings = (optionTourId) => {
    dispatch(fetchBookingsByOptionTour(optionTourId));
    setSelectedBookingId(optionTourId)
  };

  const handleConfirmDelete = (id) => {
    setSelectedBookingId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedBookingId) {
      await dispatch(deleteBooking(selectedBookingId));
      dispatch(perfilBookingsProduct(id))
      setIsConfirmOpen(false);
      setSelectedBookingId(null);
      dispatch(fetchBookingsByOptionTour(selectedBookingId));
    }
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false);
    setSelectedBookingId(null);
  };

  const sortedBookings = [...bookings].sort((a, b) =>
    a.ownerName.localeCompare(b.ownerName)
  );

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
    const selectedTimeId = e.target.value;
    setSelectedTime(selectedTimeId);
  };

  return (
    <div className={style.container}>
      <div className={style.leftSide}>
        <div className={style.containerSearch}>
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
                {isLoading && <div className={style.spinner}></div>}
                <img
                  src={productBooking.images[currentImageIndex]}
                  alt={`Imagem ${currentImageIndex + 1} de ${productBooking.images.length}`}
                  onLoad={handleImageLoad}
                  style={{ display: isLoading ? 'none' : 'block' }}
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
              <div className={style.sliderContainer}>
              {isLoading && <div className={style.spinner}></div>}
              <img
                src={productBooking.images?.[0]}
                alt={productBooking.title}
                onLoad={handleImageLoad}
                style={{ display: isLoading ? 'none' : 'block' }}
                className={style.sliderImage}
              />
              </div>
            )}
          </div>
          <div className={style.rightSideInfo}>
            <h2 className={style.title}>{productBooking.title}</h2>
            <p className={style.description}>{productBooking.description}</p>
            {productBooking.duration > 0 && (
              <p className={style.duration}>{productBooking.duration} minutos</p>
            )}
            <h3 className={style.price}>{productBooking.price}</h3>
          </div>
        </div>
          <div className={style.options}>
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
          </div>
       

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
                  return style.dateNext;
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
          <div className={style.hoursOptions}>
<label className={style.label} htmlFor="times">
              Horários disponíveis:
            </label>
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
          </div>
            
          </>
        )}

        <div className={style.div_button}>
          <button
            onClick={() => {
              if (selectedTime) {
                handleBookings(selectedTime);
              } else {
                alert("Por favor, selecione um horário primeiro.");
              }
            }}
            className={style.btns}
          >
            Procurar
          </button>
        </div>
      </div>

      <div className={style.rightSide}>
        <h2>Reservas</h2>
        {loading && <p className={style.loading}>Carregando...</p>}
        {error && <p className={style.error}>Erro: {error}</p>}
        {sortedBookings.length > 0 ? (
          sortedBookings.map((booking, index) => (
            <div key={index} className={style.box_booking}>
              <div className={style.booking_info}>                
                <p>
                  <strong>Nome:</strong> {booking.ownerName}
                </p>
                <p>
                  <strong>Email:</strong> {booking.email}
                </p>
                <p>
                  <strong>CPF:</strong> {booking.cpf}
                </p>
                <p>
                  <strong>Passaporte:</strong> {booking.passportNumber}
                </p>
                <p>
                  <strong>Telefone:</strong> {booking.phone}
                </p>
                <p>
                  <strong>Data de Nascimento:</strong>{" "}
                  {booking.birthDate
                    .split("T")[0]
                    .split("-")
                    .reverse()
                    .join("/")}
                </p>
                <p>
                  <strong>Estado:</strong> {booking.state}
                </p>
              </div>
              <button
                onClick={() => handleConfirmDelete(booking.id)}
                className={style.deleteButton}
              >
                Excluir
              </button>
            </div>
          ))
        ) : (
          <p className={style.no_results}>Nenhuma reserva encontrada.</p>
        )}
      </div>

      {isConfirmOpen && (
        <div className={style.modal}>
          <div className={style.modalContent}>
            <h3>Tem certeza que deseja excluir esta reserva?</h3>
            <button onClick={confirmDelete} className={style.confirmButton}>
              Sim
            </button>
            <button onClick={cancelDelete} className={style.cancelButton}>
              Não
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;



