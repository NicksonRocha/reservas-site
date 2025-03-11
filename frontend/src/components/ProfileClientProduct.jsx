
import React, { useEffect, useState } from "react";
import { useParams,  useLocation, Link, useNavigate} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { perfilClientProduct, clearProduct } from "../slices/productSlice";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import style from "./ProfileClientProduct.module.css";

import Dropdown from "./Dropdown"; 
import DropdownTime from "./DropdownTime"; 

import { useAuth } from "../hooks/useAuth";

const ProfileClientProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loading, error, product } = useSelector((state) => state.products);

  const { auth } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation(); 

  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    return () => {
      dispatch(clearProduct()); 
    };
  }, [location, dispatch]); 

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(perfilClientProduct(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (product && selectedOption && product.options[selectedOption]) {
      const dates = product.options[selectedOption].map((opt) => opt.date);
      setAvailableDates(dates);
      
    } else {
      setAvailableDates([]);
    }
  }, [selectedOption, product]);
  const handleOptionChange = (e) => {
    const selectedOptionId = e.target.value;
    const selectedOptionName = Object.keys(product.options).find((key) =>
      product.options[key].some((opt) => opt.id === parseInt(selectedOptionId))
    );
  
    setSelectedOption(selectedOptionName);
    setSelectedDate("");
    setAvailableTimes([]);
  };
  const handleDateSelect = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    if (availableDates.includes(formattedDate)) {
      setSelectedDate(formattedDate);
  
      const times = product.options[selectedOption]
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
  
  

  const [ticketQuantity, setTicketQuantity] = useState(1);

  const increaseQuantity = () => {
    const selectedTimeData = availableTimes.find(
      (time) => time.id === parseInt(selectedTime) 
    );
    if (selectedTimeData && ticketQuantity < selectedTimeData.availability) {
      setTicketQuantity((prev) => prev + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity((prev) => prev - 1);
    }
  };

const handleSubmit = () => {
  if (selectedOption && selectedDate && selectedTime) {
    const selectedTimeData = availableTimes.find(
      (time) => time.id === parseInt(selectedTime)
    );
    
    if (!selectedTimeData) {
      alert("Erro ao encontrar o horário selecionado.");
      return;
    }

    const selectedOptionData = product.options[selectedOption]?.[0];
    if (!selectedOptionData) {
      alert("Erro ao encontrar a opção selecionada.");
      return;
    }

    const reservationData = {
      productId: id,
      optionName: selectedOption,
      optionPrice: selectedOptionData.price,
      timeId: selectedTime,
      timeStart: selectedTimeData.startHour,
      timeEnd: selectedTimeData.endHour,
      date: selectedDate,
      tickets: ticketQuantity,
    };

    if (!auth) {
      navigate("/entrar", {
        state: {
          reservationData,
          nextRoute: "/reserva",
        },
      });
    } else {
      navigate("/reserva", { state: reservationData });
    }
  } else {
    alert("Por favor, preencha todos os campos antes de enviar.");
  }
};

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours} Hora${hours > 1 ? 's' : ''}`;
  }

  if (hours === 0) {
    return `${mins} Minuto${mins > 1 ? 's' : ''}`;
  }

  return `${hours} Hora${hours > 1 ? 's' : ''} e ${mins} Minuto${mins > 1 ? 's' : ''}`;
};

  

  return (
    <div className={style.containerFull}>
      <div className={style.container}>
      <div className={style.box_image}>
        {product.images && product.images.length > 1 ? (
          <div className={style.sliderContainer}>
            <button onClick={() => setCurrentImageIndex((prev) => (prev + product.images.length - 1) % product.images.length)} className={style.sliderButton}>❮</button>
            {isLoading && <div className={style.spinner}></div>}
            <img
              src={product.images[currentImageIndex]}
              alt={`Imagem ${currentImageIndex + 1} de ${product.images.length}`}
              onLoad={handleImageLoad}
                      style={{ display: isLoading ? 'none' : 'block' }}
                      className={style.sliderImage}
              
            />
            <button onClick={() => setCurrentImageIndex((prev) => (prev + 1) % product.images.length)} className={style.sliderButton}>❯</button>
          </div>
        ) : (
          <div className={style.sliderContainer}>
            {isLoading && <div className={style.spinner}></div>}
            <img src={product.images?.[0]} alt={product.title} className={style.imageProduct} onLoad={handleImageLoad}
                      style={{ display: isLoading ? 'none' : 'block' }}
                       /></div>
          
        )}
<p>{product.description}</p>
{product.duration > 0 && <p><strong>Duração:</strong> {formatDuration(product.duration)}</p>}

{product.business && (
  <Link to={`/perfil/empresa/${product.BusinessId}`} className={style.businessContainer}>
    {product.business.profileImageUrl && (
      <img
        src={product.business.profileImageUrl}
        alt={product.business.name}
        className={style.businessImage}
      />
    )}
    <div className={style.businessInfo}>
    <p className={style.partnerTag}>Empresa</p>
      <h4>{product.business.name}</h4>
    </div>
  </Link>
)}
      </div>

      <div className={style.box_info}>
        <h1 className={style.title}>{product.title}</h1>
        
        {product.promotion ? (
                            <><div className={style.boxPrice}>
                              <h3 className={style.priceOriginal}>R${product.price}</h3>
                              <h3 className={style.pricePromotion}>R${product.pricePromotion}</h3>
                            </div></>
                                    ) : (
                                      <h3>R${product.price}</h3>
                                    )}

       
        <label htmlFor="options">Escolha uma opção:</label>        
        <Dropdown
          options={product.options || {}}
          placeholder="Escolha uma opção"
          onOptionSelect={(selectedOptionId) => {
            const optionName = Object.keys(product.options).find((key) =>
              product.options[key].some((opt) => opt.id === parseInt(selectedOptionId))
            );
            setSelectedOption(optionName);
            setSelectedDate("");
            setAvailableTimes([]);
          }}
        />
        
        
      

        <div className={style.containerColors}>
  <label className={style.label}>
    Disponível: <span className={style.availableColor}></span>
  </label>
  <label className={style.label}>
    Indisponível: <span className={style.unavailableColor}></span>
  </label>
  <label className={style.label}>
    Selecionada: <span className={style.selectedColor}></span>
  </label>
</div>

        

       
        <div className={style.calendarContainer}>
        <label className={style.label} htmlFor="times">Escolha uma data:</label>
  <Calendar
    className={style.calendar}
    tileClassName={({ date }) => {
      const formattedDate = date.toISOString().split("T")[0];
      if (selectedDate === formattedDate) {
        return style.selected; 
      }
      if (availableDates.includes(formattedDate)) {
        return style.available; 
      }
      return style.unavailable; 
    }}
    tileDisabled={({ date }) => {
      const formattedDate = date.toISOString().split("T")[0];
      return !availableDates.includes(formattedDate);
    }}
    onClickDay={handleDateSelect} 
  />
</div>


{selectedDate && availableTimes.length > 0 && (
  <>
  <label className={style.label} htmlFor="times">Horários disponíveis:</label>
  <DropdownTime
            options={availableTimes.reduce((acc, time) => {
              acc[`( Inicio: ${time.startHour} - Fim: ${time.endHour}) Vagas:${time.availability} `] = [{ id: time.id }];
              return acc;
            }, {})}
            placeholder="Selecione um horário"
            onOptionSelect={(selectedTimeId) => setSelectedTime(selectedTimeId)}
            
          /></>
          
        )}
       
        

          {selectedTime && (
            <div className={style.ticketSelector}>
              <p>Quantidade: </p>
              <button 
                className={style.ticketButton} 
                onClick={decreaseQuantity}
                disabled={ticketQuantity === 1}
              >
                -
              </button>
                            <span className={style.ticketQuantity}>{ticketQuantity}</span>
              <button 
                className={style.ticketButton} 
                onClick={increaseQuantity}
                disabled={
                  availableTimes.find((time) => time.id === parseInt(selectedTime))?.availability <= ticketQuantity
                } 
              >
                +
              </button>


            </div>
          )}


      
        <button onClick={handleSubmit} className={style.btns}>
  Reservar
</button>

      </div>
      </div>
      <div className={style.containerTabletsPhone}>
      <div className={style.boxMobile}>
        {product.images && product.images.length > 1 ? (
          <div className={style.sliderContainer}>
            <button onClick={() => setCurrentImageIndex((prev) => (prev + product.images.length - 1) % product.images.length)} className={style.sliderButton}>❮</button>
            {isLoading && <div className={style.spinner}></div>}
            <img
              src={product.images[currentImageIndex]}
              alt={`Imagem ${currentImageIndex + 1} de ${product.images.length}`}
              onLoad={handleImageLoad}
                      style={{ display: isLoading ? 'none' : 'block' }}
                      className={style.sliderImage}
              
            />
            <button onClick={() => setCurrentImageIndex((prev) => (prev + 1) % product.images.length)} className={style.sliderButton}>❯</button>
          </div>
        ) : (
          <div className={style.sliderContainer}>
            {isLoading && <div className={style.spinner}></div>}
            <img src={product.images?.[0]} alt={product.title} className={style.imageProduct} onLoad={handleImageLoad}
                      style={{ display: isLoading ? 'none' : 'block' }}
                       /></div>
          
        )}


        
        {product.promotion ? (
                            <><div className={style.boxPrice}>
                              <h3 className={style.priceOriginal}>R${product.price}</h3>
                              <h3 className={style.pricePromotion}>R${product.pricePromotion}</h3>
                            </div></>
                                    ) : (
                                      <h3>R${product.price}</h3>
                                    )}
                                    
                                    <h1 className={style.title}>{product.title}</h1>
{product.duration > 0 && <p><strong>Duração:</strong> {formatDuration(product.duration)}</p>}

<p>{product.description}</p>

<label htmlFor="options">Escolha uma opção:</label>        
        <Dropdown
          options={product.options || {}}
          placeholder="Escolha uma opção"
          onOptionSelect={(selectedOptionId) => {
            const optionName = Object.keys(product.options).find((key) =>
              product.options[key].some((opt) => opt.id === parseInt(selectedOptionId))
            );
            setSelectedOption(optionName);
            setSelectedDate("");
            setAvailableTimes([]);
          }}
        />

<div className={style.containerColors}>
  <label className={style.label}>
    Disponível: <span className={style.availableColor}></span>
  </label>
  <label className={style.label}>
    Indisponível: <span className={style.unavailableColor}></span>
  </label>
  <label className={style.label}>
    Selecionada: <span className={style.selectedColor}></span>
  </label>
</div>

        

       
        <div className={style.calendarContainer}>
        <label className={style.label} htmlFor="times">Escolha uma data:</label>
  <Calendar
    className={style.calendar}
    tileClassName={({ date }) => {
      const formattedDate = date.toISOString().split("T")[0];
      if (selectedDate === formattedDate) {
        return style.selected; 
      }
      if (availableDates.includes(formattedDate)) {
        return style.available; 
      }
      return style.unavailable; 
    }}
    tileDisabled={({ date }) => {
      const formattedDate = date.toISOString().split("T")[0];
      return !availableDates.includes(formattedDate);
    }}
    onClickDay={handleDateSelect} 
  />
</div>




{selectedDate && availableTimes.length > 0 && (
  <>
  <label className={style.label} htmlFor="times">Horários disponíveis:</label>
  <DropdownTime
            options={availableTimes.reduce((acc, time) => {
              acc[`( Inicio: ${time.startHour} - Fim: ${time.endHour}) Vagas:${time.availability} `] = [{ id: time.id }];
              return acc;
            }, {})}
            placeholder="Selecione um horário"
            onOptionSelect={(selectedTimeId) => setSelectedTime(selectedTimeId)}
            
          /></>
          
        )}
       
        

          {selectedTime && (
            <div className={style.ticketSelector}>
              <p>Quantidade: </p>
              <button 
                className={style.ticketButton} 
                onClick={decreaseQuantity}
                disabled={ticketQuantity === 1} 
              >
                -
              </button>
                            <span className={style.ticketQuantity}>{ticketQuantity}</span>
              <button 
                className={style.ticketButton} 
                onClick={increaseQuantity}
                disabled={
                  availableTimes.find((time) => time.id === parseInt(selectedTime))?.availability <= ticketQuantity
                } 
              >
                +
              </button>


            </div>
          )}


      
<div className={style.buttonContainer}>
  <button onClick={handleSubmit} className={style.btns}>
    Reservar
  </button>
</div>

{product.business && (
  <Link to={`/perfil/empresa/${product.BusinessId}`} className={style.businessContainer}>
    {product.business.profileImageUrl && (
      <img
        src={product.business.profileImageUrl}
        alt={product.business.name}
        className={style.businessImage}
      />
    )}    
    <div className={style.businessInfo}>
    <p className={style.partnerTag}>Empresa</p>
      <h4>{product.business.name}</h4>
    </div>
  </Link>
)}
      </div>
      </div>
    </div>
  );
};

export default ProfileClientProduct;
