import { api, requestConfig } from '../utils/config';

const getMyBusiness = async (token) => {
  const config = requestConfig('GET', null, token, true);

  try {
    const res = await fetch(api + '/my-business', config);
    const resJson = await res.json();

    if (res.status !== 200) {
      throw new Error(resJson.errors || 'Erro ao buscar os negócios');
    }

    return resJson;
  } catch (error) {
    console.log(error);
    throw error; 
  }
};

const createBusiness = async (data, token) => {
  const config = requestConfig('POST', data, token, true);

  try {
    const res = await fetch(api + '/create/business', config);
    const resJson = await res.json();

    if (res.status !== 201) {
      throw new Error(resJson.errors || 'Erro ao criar a empresa');
    }

    return resJson;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const editBusinessService = async (data, id, token) => {
  const config = requestConfig('PUT', data, token, true);

  try {
    const res = await fetch(api + '/edit/business/' + id, config);
    const resJson = await res.json();

    if (res.status !== 200) {
      throw new Error(resJson.errors || 'Erro ao editar a empresa');
    }

    return resJson;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteBusinessService = async (id, token) => {
  const config = requestConfig('DELETE', null, token);

  try {
    const res = await fetch(`${api}/delete/business/${id}`, config);
    const resJson = await res.json();

    if (res.status !== 200) {
      throw new Error(resJson.errors || 'Erro ao deletar a empresa');
    }

    return resJson;
  } catch (error) {
    console.error("Erro no serviço de deletar empresa:", error);
    throw error;
  }
};

const deleteImageBusinessProfile = async (id, token) => {
  const config = requestConfig('DELETE', null, token); 

  try {
    const res = await fetch(api + '/edit/delete-image/' + id, config);
    const resJson = await res.json();

    if (res.status !== 200) {
      throw new Error(resJson.errors || 'Erro ao deletar a imagem da empresa');
    }

    return resJson;
  } catch (error) {
    console.log(error);
    throw error;
  }
};



const perfilBusiness = async (token, id) => {
  const config = requestConfig('GET', null, token);

  try {
    const res = await fetch(api + '/perfil/business/' + id, config);
    const resJson = await res.json();

    if (res.status !== 200) {
      throw new Error(resJson.errors || 'Erro ao buscar perfil');
    }
    
      return resJson;

   
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const clientPerfilBusiness = async ( id) => {
  const config = requestConfig('GET', null);

  try {
    const res = await fetch(api + '/client-view/profile-business/' + id, config);
    const resJson = await res.json();

    if (res.status !== 200) {
      throw new Error(resJson.errors || 'Erro ao buscar perfil');
    }
    
      return resJson;

   
  } catch (error) {
    console.log(error);
    throw error; 
  }
};

const fetchBusinessNotifications = async (id, token) => {
  const config = requestConfig("GET", null, token);

  try {
    const response = await fetch(`${api}/notifications-business/${id}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors.join(", "));
    }

    const notifications = await response.json();
    return notifications.notifications; 
  } catch (error) {
    console.error("Erro ao buscar notificações:", error.message);
    throw error;
  }
};

const businessNotificationsAsRead = async (id, token) => {
  const config = requestConfig("PUT", null, token); 

  try {
    const response = await fetch(`${api}/is-read-business/${id}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors.join(", "));
    }

    const result = await response.json();
    return result; 
  } catch (error) {
    console.error("Erro ao marcar notificações como lidas:", error.message);
    throw error;
  }
};

const businessService = {
  getMyBusiness,
  createBusiness,
  perfilBusiness,
  clientPerfilBusiness,
  editBusinessService,
  deleteImageBusinessProfile,
  fetchBusinessNotifications,
  businessNotificationsAsRead, 
  deleteBusinessService,
};

export default businessService;

