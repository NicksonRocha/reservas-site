import { api,  requestConfig} from '../utils/config'

const register = async(data) => {

    const config = requestConfig("POST", data)

     try {

        const res = await fetch(api + "/register", config)
        
        const resJson = await res.json()

        if (resJson.id) {
            localStorage.setItem("user", JSON.stringify(resJson))
        }

        return resJson;

     } catch (error) {
        console.log(error)
     }

}

const logout = () => {
    localStorage.removeItem("user")
}

const login = async(data) => {

    const config = requestConfig("POST", data)

    try {
        const res = await fetch(api + "/login", config)
        const resJson = await res.json()

        if (resJson.id) {
            localStorage.setItem("user", JSON.stringify(resJson))
        }

        return resJson
    } catch (error) {
        console.log(error)
    }

}

const perfil = async (token) => {
  const config = requestConfig("GET", null, token);

  try {
      const res = await fetch(api + '/perfil', config);
      if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.errors || 'Erro ao buscar perfil');
      }
      return await res.json();
  } catch (error) {
      console.error(error);
      throw error;
  }
};

const updateProfile = async (data, token) => {
  const config = requestConfig("PUT", data, token);

  try {
    const res = await fetch(api + '/edit', config);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.errors || 'Erro ao atualizar o perfil');
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const fetchNotifications = async (token) => {
    const config = requestConfig("GET", null, token);
  
    try {
      const response = await fetch(`${api}/notifications`, config);
  
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
  
  const markNotificationsAsRead = async (token) => {
    const config = requestConfig("PUT", null, token); 
  
    try {
      const response = await fetch(`${api}/notifications/mark-as-read`, config);
  
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

  const deleteUser= async (token) => {
    const config = requestConfig("DELETE", null, token);
    try {
      const res = await fetch(api + "/delete", config);
      const resJson = await res.json();

    if (res.status !== 200) {
      throw new Error(resJson.errors || 'Erro ao deletar o perfil');
    }

    return resJson;
  } catch (error) {
    console.error("Erro no serviço de deletar perfil:", error);
    throw error;
  }
  };


const authService = {
    register,
    logout,
    login,
    perfil,
    fetchNotifications,
    markNotificationsAsRead,
    updateProfile ,
    deleteUser
}

export default authService

