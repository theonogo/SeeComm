import { authService } from '../auth/AuthService';

export default function LoginButton() {
  const handleGithubLogin = () => {
    window.location.href = authService.getGithubLoginUrl();
  };

  return (
    <button onClick={handleGithubLogin} className={`border border-border rounded-lg py-4 px-8 h-16 font-semibold text-lg cursor-pointer w-72
                                                     bg-violet-300 hover:bg-violet-400 dark:bg-violet-900 dark:hover:bg-violet-800 mx-auto`}>
      Login with GitHub
    </button>
  );
}