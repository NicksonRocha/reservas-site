import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { seeOptionsProductBookings, deleteOptionsTour, editOptionsTour } from "../slices/productSlice";
import style from "./ListOptionsProduct.module.css";

const ListOptionsProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productBooking, loading, error } = useSelector((state) => state.products);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedEditId, setSelectedEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({
      name: '',
      capacity: '',
      price: '',
      date: '',
      startHour: '',
      endHour: '',
    });

  useEffect(() => {
    if (id) {
      dispatch(seeOptionsProductBookings(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro ao carregar produto: {error}</p>;
  }

  
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (selectedEditId) {
      await dispatch(editOptionsTour({ id: selectedEditId, data: editFormData }));
      await dispatch(seeOptionsProductBookings(id));
      setOpenEdit(false); 
    }
  };
  
  


  const handleOpenEdit = (id) => {
  const selectedOption = Object.values(productBooking.options)
    .flat()
    .find((option) => option.id === id);

  if (selectedOption) {
    setEditFormData({
      name: selectedOption.name|| '',
      capacity: selectedOption.capacity || '',
      price: selectedOption.price || '',
      date: selectedOption.date || '',
      startHour: selectedOption.startHour || '',
      endHour: selectedOption.endHour || '',
    });
    setSelectedEditId(id);
    setOpenEdit(true);
  }
};


  const cancelEdit = () => {
    setOpenEdit(false);
    setSelectedEditId(null);

    setEditFormData({
      name: '',
      capacity: '',
      price: '',
      date: '',
      startHour: '',
      endHour: '',
    });
    setOpenEdit(false); // Fecha o modal
  };

  const handleConfirmDelete = (id) => {
    setSelectedOptionId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
      if (selectedOptionId) {
        await dispatch(deleteOptionsTour(selectedOptionId));
        setIsConfirmOpen(false);
        setSelectedOptionId(null);
      }
    };

  const cancelDelete = () => {
    setIsConfirmOpen(false);
    setSelectedOptionId(null);
  };

  

  return (
    <div  className={style.fullContainer}>
    <div className={style.container}>
      <h1>Opções do Produto</h1>
      <div className={style.productInfo}>
        <h3>{productBooking?.title}</h3>
        
        <h3>Preço Base: R$ {productBooking?.price}</h3>
      </div>

      <div className={style.optionsContainer}>
        <h3>Opções Disponíveis</h3>
        {productBooking?.options && Object.keys(productBooking.options).length > 0 ? (
          Object.entries(productBooking.options).map(([optionName, options]) => (
            <div key={optionName} className={style.optionBox}>
              <h4>{optionName}</h4>
              {options.map((option) => (
                <div key={option.id} className={style.optionDetails}>
                  <p>
                    <strong>Data:</strong> {option.date
                    .split("-")
                    .reverse()
                    .join("/")}
                  </p>
                  <p>
                    <strong>Hora:</strong> {option.startHour} - {option.endHour}
                  </p>
                  <p>
                    <strong>Preço:</strong> R$ {options[0].price
                  ? parseFloat(options[0].price).toFixed(2)
                  : "0,00"}
                  </p>
                  <p>
                    <strong>Vagas:</strong> {option.availability}
                  </p>
                  <button onClick={() => {handleOpenEdit(option.id)}} className={style.btn_edit}>editar</button>
                  <button onClick={() => {handleConfirmDelete(option.id)}} className={style.btn_delete}>excluir</button>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>Não há opções disponíveis para este produto.</p>
        )}
      </div>
      {isConfirmOpen && (
              <div className={style.modal}>
                <div className={style.modalContent}>
                  <h3>Tem certeza que deseja excluir esta reserva?</h3>
                  <p>Vai excluir todas as reservas de clientes e serão reembolsados.</p>
                  <button onClick={confirmDelete} className={style.confirmButton}>
                    Sim
                  </button>
                  <button onClick={cancelDelete} className={style.cancelButton}>
                    Não
                  </button>
                </div>
              </div>
            )}

{openEdit && (
              <div className={style.modal}>
                <div className={style.modalContent}>
                  <h3>Você deseja editar ? </h3>
                  <form onSubmit={handleEditSubmit} className={style.editForm}>
        <div className={style.formGroup}>
          <label htmlFor="name">Nome</label>
          <input
            type="name"
            id="name"
            name="name"
            value={editFormData.name}
            onChange={handleEditChange}
            required
            className={style.inputsTRINGS}
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="capacity">Capacidade</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={editFormData.capacity}
            onChange={handleEditChange}
            required
            className={style.inputsTRINGS}
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="price">Preço</label>
          <input
            type="number"
            step="0.01"
            id="price"
            name="price"
            value={editFormData.price}
            onChange={handleEditChange}
            required
            className={style.inputsTRINGS}
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="date">Data</label>
          <input
            type="date"
            id="date"
            name="date"
            value={editFormData.date}
            onChange={handleEditChange}
            required
            className={style.inputsTRINGS}
          />
        </div>
        <div className={style.hoursGroup}>
        <div className={style.formGroup}>
          <label htmlFor="startHour">Hora de Início</label>
          <input
            type="time"
            id="startHour"
            name="startHour"
            value={editFormData.startHour}
            onChange={handleEditChange}
            required
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="endHour">Hora de Término</label>
          <input
            type="time"
            id="endHour"
            name="endHour"
            value={editFormData.endHour}
            onChange={handleEditChange}
            required
          />
        </div>
        </div>
        <div className={style.modalActions}>
          <button type="submit" className={style.btn_edit}>
            Salvar
          </button>
          <button type="button" onClick={cancelEdit} className={style.cancelButton}>
            Cancelar
          </button>
        </div>
      </form>
                </div>
              </div>
            )}
    </div>
    <div className={style.smallerScreens}>
    <h1>Opções do Produto</h1>
      <div className={style.productInfo}>
        <h3>{productBooking?.title}</h3>
        
        <h3>Preço Base: R$ {productBooking?.price}</h3>
      </div>

      <div className={style.optionsContainer}>
        <h3>Opções Disponíveis</h3>
        {productBooking?.options && Object.keys(productBooking.options).length > 0 ? (
          Object.entries(productBooking.options).map(([optionName, options]) => (
            <div key={optionName} className={style.sOptionBox}>
              <h4>{optionName}</h4>
              <div className={style.sOptionGridBox}>
{options.map((option) => (
                <div key={option.id} className={style.sOptionDetails}>
                  <p>
                    <strong>Data:</strong> {option.date
                    .split("-")
                    .reverse()
                    .join("/")}
                  </p>
                  <p>
                    <strong>Hora:</strong> {option.startHour} - {option.endHour}
                  </p>
                  <p>
                    <strong>Preço:</strong> R$ {options[0].price
                  ? parseFloat(options[0].price).toFixed(2)
                  : "0,00"}
                  </p>
                  <p>
                    <strong>Vagas:</strong> {option.availability}
                  </p>
                  <div className={style.sBoxButtons}>
                    <button onClick={() => {handleOpenEdit(option.id)}} className={style.btn_edit}>editar</button>
                  <button onClick={() => {handleConfirmDelete(option.id)}} className={style.btn_delete}>excluir</button>
                  </div>
                  
                </div>
              ))}
              </div>
              
            </div>
          ))
        ) : (
          <p>Não há opções disponíveis para este produto.</p>
        )}
         {isConfirmOpen && (
              <div className={style.modal}>
                <div className={style.modalContent}>
                  <h3>Tem certeza que deseja excluir esta reserva?</h3>
                  <p>Vai excluir todas as reservas de clientes e serão reembolsados.</p>
                  <button onClick={confirmDelete} className={style.confirmButton}>
                    Sim
                  </button>
                  <button onClick={cancelDelete} className={style.cancelButton}>
                    Não
                  </button>
                </div>
              </div>
            )}

{openEdit && (
              <div className={style.modal}>
                <div className={style.modalContent}>
                  <h3>Você deseja editar ? </h3>
                  <form onSubmit={handleEditSubmit} className={style.editForm}>
        <div className={style.formGroup}>
          <label htmlFor="name">Nome</label>
          <input
            type="name"
            id="name"
            name="name"
            value={editFormData.name}
            onChange={handleEditChange}
            required
            className={style.inputsTRINGS}
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="capacity">Capacidade</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={editFormData.capacity}
            onChange={handleEditChange}
            required
            className={style.inputsTRINGS}
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="price">Preço</label>
          <input
            type="number"
            step="0.01"
            id="price"
            name="price"
            value={editFormData.price}
            onChange={handleEditChange}
            required
            className={style.inputsTRINGS}
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="date">Data</label>
          <input
            type="date"
            id="date"
            name="date"
            value={editFormData.date}
            onChange={handleEditChange}
            required
            className={style.inputsTRINGS}
          />
        </div>
        <div className={style.hoursGroup}>
        <div className={style.formGroup}>
          <label htmlFor="startHour">Hora de Início</label>
          <input
            type="time"
            id="startHour"
            name="startHour"
            value={editFormData.startHour}
            onChange={handleEditChange}
            required
          />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="endHour">Hora de Término</label>
          <input
            type="time"
            id="endHour"
            name="endHour"
            value={editFormData.endHour}
            onChange={handleEditChange}
            required
          />
        </div>
        </div>
        <div className={style.modalActions}>
          <button type="submit" className={style.btn_edit}>
            Salvar
          </button>
          <button type="button" onClick={cancelEdit} className={style.cancelButton}>
            Cancelar
          </button>
        </div>
      </form>
                </div>
              </div>
            )}
      </div>
    </div>
    </div>
  );
};

export default ListOptionsProduct;
