import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function LogoutButton() {
  const navigate = useNavigate();
  const context = useAuth();

  const handleLogout = async () => {
    try {
      
      await context.logout();
      //window.location.href = authService.getGithubLogoutUrl();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
}