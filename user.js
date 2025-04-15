function getUserInfo() {
    const username = localStorage.getItem('userName') || 'Guest';
    const avatar = localStorage.getItem('userAvatar') || 'default-avatar.png';
    return { username, avatar };
  }
  
  function saveUserInfo(username, avatar) {
    localStorage.setItem('userName', username);
    localStorage.setItem('userAvatar', avatar);
  }
  