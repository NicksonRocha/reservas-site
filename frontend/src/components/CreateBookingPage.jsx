import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createBooking, perfilClientProduct, clearProduct, clearTicketMessages } from '../slices/productSlice';
import { useLocation } from 'react-router-dom';
import style from './CreateBookingPage.module.css';

import { sanitizeFormData } from '../utils/sanitize';

const BrazilianForm = ({ index, formData, handleChange, handleChangeToggle, states }) => {
  return (
    <div className={style.formInner}>
      <label>
        <strong>Nome do Responsável:</strong>
        <input
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={(e) => handleChange(e, index)}
          required
        />
      </label>
      <label>
        <strong>CPF:</strong>
        <input
          type="text"
          name="cpf"
          value={formData.cpf}
          onChange={(e) => handleChangeToggle(e, index)}
          required
        />
      </label>
      <label>
         <strong>Telefone:</strong>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={(e) => handleChange(e, index)}
          required
        />
      </label>
      <label>
         <strong>Email:</strong>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange(e, index)}
          required
        />
      </label>
      <label>
         <strong>Data de Nascimento:</strong>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={(e) => handleChange(e, index)}
          required
        />
      </label>
      <label>
         <strong>Estado:</strong>
        <select
          name="state"
          value={formData.state}
          onChange={(e) => handleChange(e, index)}
          required
        >
          <option value="">Selecione um estado</option>
          {states.map((st) => (
            <option key={st.value} value={st.value}>
              {st.label}
            </option>
          ))}
        </select>
      </label>
      <label>
         <strong>País:</strong>
       
        <input
          type="text"
          name="country"
          value="Brasil"
          readOnly
        />
      </label>
    </div>
  );
};

const ForeignForm = ({ index, formData, handleChange, handleChangeToggle, principalCountries }) => {
  return (
    <div className={style.formInner}>
      <label>
         <strong>Nome do Responsável:</strong>
        <input
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={(e) => handleChange(e, index)}
          required
        />
      </label>
      <label>
         <strong>Número do Passaporte:</strong>
        <input
          type="text"
          name="passportNumber"
          value={formData.passportNumber}
          onChange={(e) => handleChangeToggle(e, index)}
          required
        />
      </label>
      <label>
         <strong>Telefone:</strong>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={(e) => handleChange(e, index)}
          required
        />
      </label>
      <label>
         <strong>Email:</strong>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => handleChange(e, index)}
          required
        />
      </label>
      <label>
         <strong>Data de Nascimento:</strong>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={(e) => handleChange(e, index)}
          required
        />
      </label>
      <label>
       <strong>País:</strong>
      <select
        name="country"
        value={formData.country}
        onChange={(e) => handleChange(e, index)}
        required
      >
        {principalCountries.map((country) => (
          <option key={country.value} value={country.value}>
            {country.label}
          </option>
        ))}
      </select>
    </label>

    </div>
  );
};

const CreateBookingPage = () => {
  const [formsData, setFormsData] = useState([]);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reservationData = location.state;
  const { loading, error, successMessageTickets, product } = useSelector((state) => state.products);

  const states = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' },
  ];

const principalCountries = [
  { value: "", label: "Selecione um país" },
  { value: "Alemanha", label: "Alemanha" },
  { value: "Argentina", label: "Argentina" },
  { value: "Austrália", label: "Austrália" },
  { value: "Canadá", label: "Canadá" },
  { value: "Chile", label: "Chile" },
  { value: "China", label: "China" },
  { value: "Colômbia", label: "Colômbia" },
  { value: "Coreia do Sul", label: "Coreia do Sul" },
  { value: "Espanha", label: "Espanha" },
  { value: "Estados Unidos", label: "Estados Unidos" },
  { value: "França", label: "França" },
  { value: "Holanda", label: "Holanda" },
  { value: "Inglaterra", label: "Inglaterra" },
  { value: "Itália", label: "Itália" },
  { value: "Japão", label: "Japão" },
  { value: "México", label: "México" },
  { value: "Nova Zelândia", label: "Nova Zelândia" },
  { value: "Portugal", label: "Portugal" },
  { value: "Reino Unido", label: "Reino Unido" },
  { value: "Rússia", label: "Rússia" },
  { value: "Suíça", label: "Suíça" },
  { value: "Uruguai", label: "Uruguai" },
  { value: "Outro", label: "Outro" },
];

const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [moreInfo, setMoreInfo] = useState(false);

const handleMoreInfo = () => {
  setMoreInfo(!moreInfo)
}

const nextImage = () => {
  setCurrentImageIndex((prevIndex) =>
    prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
  );
};

const prevImage = () => {
  setCurrentImageIndex((prevIndex) =>
    prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
  );
};

  const valueTotal = React.useMemo(() => {
    const productPrice = parseFloat(product.promotion ? product.pricePromotion : product.price) || 0;
    const optionPrice = parseFloat(reservationData.optionPrice) || 0;
    const tickets = parseInt(reservationData.tickets, 10) || 0;
  
    return (productPrice + optionPrice) * tickets;
  }, [product.promotion, product.pricePromotion, product.price, reservationData.optionPrice, reservationData.tickets]);
  
  useEffect(() => {
    if (reservationData.tickets) {
      const initialFormsData = Array.from({ length: reservationData.tickets }, () => ({
        ownerName: '',
        isBrazilian: null,
        cpf: '',
        passportNumber: '',
        phone: '',
        email: '',
        birthDate: '',
        state: '',
        country: '', 
      }));
      setFormsData(initialFormsData);
    }
  }, [reservationData.tickets]);

  useEffect(() => {
    return () => {
      dispatch(clearProduct());
      dispatch(clearTicketMessages());
    };
  }, [location, dispatch]);

  useEffect(() => {
    if (reservationData.productId) {
      dispatch(perfilClientProduct(reservationData.productId));
    }
  }, [reservationData.productId, dispatch]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updated = [...formsData];
    updated[index] = { ...updated[index], [name]: value };
    setFormsData(updated);
  };

  const handleChangeToggle = (e, index) => {
    const { name, value, type } = e.target;
    const updated = [...formsData];

    if (type === 'radio') {
      updated[index][name] = value === 'true';
      if (updated[index][name] === true) {
        updated[index].passportNumber = '';
        updated[index].country = 'Brasil';
      }
      else if (updated[index][name] === false) {
        updated[index].cpf = '';
        updated[index].country = '';
      }
    } else {
      updated[index][name] = value;
    }
    setFormsData(updated);
  };

  const handleSubmitAll = async (e) => {
    e.preventDefault();
    for (const formData of formsData) {
      const sanitizedData = sanitizeFormData(formData);

      const bookingData = {
        ...sanitizedData,
        optionTourId: reservationData.timeId,
        productId: reservationData.productId,
      };
      await dispatch(createBooking(bookingData));
    }
  };

  useEffect(() => {
    if (successMessageTickets) {
      navigate('/reservation');
    }
  }, [successMessageTickets, navigate]);

  return (
    <div className={style.containerFull}>
      <div className={style.container}>
      <div className={style.box_image}>
        {product.images && product.images.length > 1 ? (
          <div className={style.sliderContainer}>
          <button className={style.sliderButton} onClick={prevImage}>
            &#9664;
          </button>
        
          <img
            src={product.images[currentImageIndex]}
            alt={`Imagem ${currentImageIndex + 1} de ${product.images.length}`}
            className={style.sliderImage}
          />
        
          <button className={style.sliderButton} onClick={nextImage}>
            &#9654;
          </button>
        </div>
        ) : (
          <div className={style.sliderContainer}>
          <img src={product.images?.[0]} alt={product.title} className={style.sliderImage} />
          </div>
        )}

        <h3>Ticket: {product.title}</h3>
        <h4>Categoria: {reservationData.optionName}</h4>

        <div className={style.box}>
          <div className={style.boxHalf}>
            <p>Data:</p>
            <p>Inicío:</p>
            <p>Fim:</p>
            <p>Qtd tickets:</p>
            <p>Ticket:</p>
            <p>Categoria:</p>
            <h3>Total:</h3>
          </div>
          <div className={style.boxHalf2}>
            <p>{reservationData.date.split('-').reverse().join('/')}</p>
            <p>{reservationData.timeStart} Hr</p>
            <p>{reservationData.timeEnd} Hr</p>
            <p>{reservationData.tickets}x</p>
            <p>{reservationData.tickets}x R${product.promotion ? product.pricePromotion : product.price}</p>
            <p>{reservationData.tickets}x R${reservationData.optionPrice}</p>
            <h3>R${valueTotal.toFixed(2)}</h3>
          </div>
        </div>
      </div>


      <div className={style.box_info}>
        {error && <p className={style.error}>{error}</p>}
        {successMessageTickets && <p className={style.success}>{successMessageTickets}</p>}

        <form className={style.formticket} onSubmit={handleSubmitAll}>
          {formsData.map((formData, index) => (
            <div key={index} className={style.form}>
              <h3 className={style.numberTicket}>Ingresso {index + 1}</h3>

              <label>
                Você é brasileiro?
              </label>
              <div className={style.codigo}>
                <input
                  type="radio"
                  id={`isBrazilian-yes-${index}`}
                  name="isBrazilian"
                  value="true"
                  checked={formData.isBrazilian === true}
                  onChange={(e) => handleChangeToggle(e, index)}
                />
                <label htmlFor={`isBrazilian-yes-${index}`}>Sim</label>

                <input
                  type="radio"
                  id={`isBrazilian-no-${index}`}
                  name="isBrazilian"
                  value="false"
                  checked={formData.isBrazilian === false}
                  onChange={(e) => handleChangeToggle(e, index)}
                />
                <label htmlFor={`isBrazilian-no-${index}`}>Não</label>
              </div>

              {formData.isBrazilian === true && (
                <BrazilianForm
                  index={index}
                  formData={formData}
                  handleChange={handleChange}
                  handleChangeToggle={handleChangeToggle}
                  states={states}
                />
              )}

              {formData.isBrazilian === false && (
                <ForeignForm
                  index={index}
                  formData={formData}
                  handleChange={handleChange}
                  handleChangeToggle={handleChangeToggle}
                  principalCountries={principalCountries}
                />
              )}

            </div>
          ))}

          <button className={style.btns} type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Reserva'}
          </button>
        </form>
      </div>
     </div>

          <div className={style.tabletsAndMobiles}>
            <div className={style.tmInfo}>
              <div className={style.tmLeft}>
                  {product.images && product.images.length > 1 ? (
                    <div className={style.sliderContainer}>
                    <button className={style.sliderButton} onClick={prevImage}>
                      &#9664;
                    </button>
                  
                    <img
                      src={product.images[currentImageIndex]}
                      alt={`Imagem ${currentImageIndex + 1} de ${product.images.length}`}
                      className={style.sliderImage}
                    />
                  
                    <button className={style.sliderButton} onClick={nextImage}>
                      &#9654;
                    </button>
                  </div>
                  ) : (
                    <div className={style.sliderContainer}>
                    <img src={product.images?.[0]} alt={product.title} className={style.sliderImage} />
                    </div>
                  )}
              </div>
              <div className={style.tmRight}>
              <h4> {product.title}</h4>
        <p>Categoria: {reservationData.optionName}</p>
        <p>Total = R${valueTotal.toFixed(2)}</p>
        <button className={style.btnsWhite} onClick={() => handleMoreInfo()}>Mais Informações</button>
                  {moreInfo && <>
                    <div className={style.box}>
          <div className={style.boxHalf}>
            <p>Data:</p>
            <p>Inicío:</p>
            <p>Fim:</p>
            <p>Qtd tickets:</p>
            <p>Ticket:</p>
            <p>Categoria:</p>
            <p>Total:</p>
          </div>
          <div className={style.boxHalf2}>
            <p>{reservationData.date.split('-').reverse().join('/')}</p>
            <p>{reservationData.timeStart} Hr</p>
            <p>{reservationData.timeEnd} Hr</p>
            <p>{reservationData.tickets}x</p>
            <p>{reservationData.tickets}x R${product.promotion ? product.pricePromotion : product.price}</p>
            <p>{reservationData.tickets}x R${reservationData.optionPrice}</p>
            <p>R${valueTotal.toFixed(2)}</p>
          </div>
        </div>
                  </>}
        
              </div>
            </div>
          
            <div className={style.box_info}>
        {error && <p className={style.error}>{error}</p>}
        {successMessageTickets && <p className={style.success}>{successMessageTickets}</p>}

        <form className={style.formticket} onSubmit={handleSubmitAll}>
          {formsData.map((formData, index) => (
            <div key={index} className={style.form}>
              <h3 className={style.numberTicket}>Ingresso {index + 1}</h3>

              <label>
                Você é brasileiro?
              </label>
              <div className={style.codigo}>
                <input
                  type="radio"
                  id={`isBrazilian-yes-${index}`}
                  name="isBrazilian"
                  value="true"
                  checked={formData.isBrazilian === true}
                  onChange={(e) => handleChangeToggle(e, index)}
                />
                <label htmlFor={`isBrazilian-yes-${index}`}>Sim</label>

                <input
                  type="radio"
                  id={`isBrazilian-no-${index}`}
                  name="isBrazilian"
                  value="false"
                  checked={formData.isBrazilian === false}
                  onChange={(e) => handleChangeToggle(e, index)}
                />
                <label htmlFor={`isBrazilian-no-${index}`}>Não</label>
              </div>

              {formData.isBrazilian === true && (
                <BrazilianForm
                  index={index}
                  formData={formData}
                  handleChange={handleChange}
                  handleChangeToggle={handleChangeToggle}
                  states={states}
                />
              )}

              {formData.isBrazilian === false && (
                <ForeignForm
                  index={index}
                  formData={formData}
                  handleChange={handleChange}
                  handleChangeToggle={handleChangeToggle}
                  principalCountries={principalCountries}
                />
              )}

            </div>
          ))}

          <button className={style.btns} type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Reserva'}
          </button>
        </form>
      </div>

          </div>

    </div>
  );
};

export default CreateBookingPage;