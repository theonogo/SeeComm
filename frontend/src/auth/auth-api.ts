import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:8000/auth/',
  withCredentials: true,
  headers: {
      'X-CSRFToken': getCsrfCookie(),
    },
});

function getCsrfCookie() {
  const cookieValue = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
  return cookieValue ? cookieValue.split('=')[1] : null;
}
