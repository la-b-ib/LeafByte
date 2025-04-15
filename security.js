function encryptData(data) {
    return btoa(data); // Basic encryption (not for production use)
  }
  
  function decryptData(data) {
    return atob(data);
  }
  