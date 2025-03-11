
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTourOptions, clearOptionMsg } from '../slices/productSlice';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './CreateTourOptions.module.css';
import { useParams } from 'react-router-dom';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

import { sanitizeFormData } from '../utils/sanitize';

const CreateTourOptions = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { loadingSchedule, successMessageOption, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    price: '',
    productId: id,
    timeSlots: [{ startHour: '00:00', endHour: '00:00' }],
    selectedDates: [],
  });

  const timeOptions = Array.from({ length: 144 }, (_, i) => {
    const hours = Math.floor(i / 6).toString().padStart(2, '0');
    const minutes = (i % 6) * 10;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  });

  const handleChange = (e, index, field) => {
    if (field) {
      const newTimeSlots = [...formData.timeSlots];
      newTimeSlots[index][field] = e.target.value;
      setFormData({ ...formData, timeSlots: newTimeSlots });
    } else {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateClick = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd', { locale: ptBR });
    setFormData((prevState) => {
      const isSelected = prevState.selectedDates.includes(formattedDate);
      return {
        ...prevState,
        selectedDates: isSelected
          ? prevState.selectedDates.filter((d) => d !== formattedDate)
          : [...prevState.selectedDates, formattedDate],
      };
    });
  };

  const addTimeSlot = () => {
    setFormData((prevState) => ({
      ...prevState,
      timeSlots: [...prevState.timeSlots, { startHour: '00:00', endHour: '00:00' }],
    }));
  };

  const removeTimeSlot = () => {
    setFormData((prevState) => {
      if (prevState.timeSlots.length > 1) {
        return {
          ...prevState,
          timeSlots: prevState.timeSlots.slice(0, -1),
        };
      }
      return prevState;
    });
  };
  

const handleSubmit = (e) => {
  e.preventDefault();

  const sanitizedData = sanitizeFormData({
    name: formData.name,
    capacity: formData.capacity,
    price: formData.price,
  });

  const { timeSlots, selectedDates, productId } = formData;

  const data = {
    ...sanitizedData,
    productId,
    timeSlots: timeSlots.map((slot) => `${slot.startHour} - ${slot.endHour}`),
    dates: selectedDates,
  };

  dispatch(createTourOptions(data));
};

  useEffect(() => {
    setTimeout(() => {
      dispatch(clearOptionMsg())
    }, 5000)
  }, [successMessageOption])

  return (
    <div className={styles.container}>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.atributos}
          />
        </label>
        <label>
          Capacidade:
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            className={styles.atributos}
          />
        </label>
        <label>
          Valor Adicional:
          <input
          className={styles.atributos}
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </label>
        <div className={styles.containerSelectTime}>
          <label>Intervalos de Horário:</label>
          {formData.timeSlots.map((slot, index) => (
            <div key={index} className={styles.timeSlotRow}>
              <div className={styles.boxSelectTime}>
                <p>Hora Inicial</p>
              <select
                name="startHour"
                value={slot.startHour}
                onChange={(e) => handleChange(e, index, 'startHour')}
                required
                className={styles.hora}
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              </div>
                <div className={styles.boxSelectTime}>
 <p>Hora Final</p>
              <select
              className={styles.hora}
                name="endHour"
                value={slot.endHour}
                onChange={(e) => handleChange(e, index, 'endHour')}
                required
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
                </div>
             <div className={styles.boxAddButtons}>
<button
            type="button"
            className={styles.addButton}
            onClick={addTimeSlot}
          >
            +
          </button>
          {index > 0 && ( 
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={removeTimeSlot}
                >
                  -
                </button>
              )}
             </div>
              
              
            </div>
          ))}
          
        </div>
        <label className={styles.titleDate}>Datas:</label>
        <Calendar
        className={styles.customCalendar}
          onClickDay={handleDateClick}
          tileClassName={({ date }) => {
            const today = new Date();
            if (date < today.setHours(0, 0, 0, 0)) return styles.disabledDate;
            if (formData.selectedDates.includes(format(date, 'yyyy-MM-dd', { locale: ptBR })))
              return styles.selectedDate;
            return styles.enabledDate;
          }}
          minDate={new Date()} 
        />
        <button className={styles.send_button} type="submit" disabled={loadingSchedule}>
          {loadingSchedule ? 'Criando...' : 'Criar Agendamentos'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {successMessageOption && <p className={styles.success}>{successMessageOption}</p>}
    </div>
  );
};

export default CreateTourOptions;




