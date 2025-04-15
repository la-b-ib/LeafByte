function saveUserProfile(name, avatarUrl = '') {
    localStorage.setItem('userName', name);
    localStorage.setItem('userAvatar', avatarUrl);
  }
  
  function getUserProfile() {
    return {
      name: localStorage.getItem('userName') || 'Guest',
      avatar: localStorage.getItem('userAvatar') || ''
    };
  }
  