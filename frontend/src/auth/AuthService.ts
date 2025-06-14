import auth from './auth-api'

export const authService = {
  async checkAuth() {
    try {
      const response = await auth.get('status/', {
      });
      return await response.data;
    } catch (error) {
      console.error('Auth check failed:', error);
      return { is_authenticated: false };
    }
  },

  getGithubLoginUrl() {
    return `http://localhost:8000/accounts/github/login/`;
  },

  getGithubLogoutUrl() {
    return `http://localhost:8000/accounts/logout/`;
  },

  async logout() {
    try {
      const response = await auth.post('logout/', {},{
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.data;
    } catch (error) {
      console.error('Logout failed:', error);
      return { success: false };
    }
  },

  async getUserInfo() {
    try {
      const response = await auth.get('user/', {});
      return await response.data;
    } catch (error) {
      console.error('Get user info failed:', error);
      return null;
    }
  },
};