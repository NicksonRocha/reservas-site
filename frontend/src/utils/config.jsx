export const api = "https://api.reservaspasseios.com";

export const requestConfig = (method, data, token = null, image = false) => {
    let config;
  
    if (image) {
      config = {
        method,
        body: data,  
        headers: {}  
      };
    } else if (method === "DELETE" || data === null) {
      config = {
        method,
        headers: {},
      };
    } else {
      config = {
        method,
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      };
    }
  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    return config;
  };
  

