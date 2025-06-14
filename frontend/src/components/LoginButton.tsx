import { authService } from '../auth/AuthService';

export default function LoginButton() {
  const handleGithubLogin = () => {
    window.location.href = authService.getGithubLoginUrl();
  };

  return (
    <button onClick={handleGithubLogin} className="github-login-btn">
      Login with GitHub
    </button>
  );
}