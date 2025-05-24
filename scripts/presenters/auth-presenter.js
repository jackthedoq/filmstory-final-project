// file: scripts/presenters/auth-presenter.js

import StoryApi from '../utils/api.js';

export default class AuthPresenter {
  constructor(loginView, registerView) {
    this._loginView = loginView;
    this._registerView = registerView;
  }

  async login({ email, password }) {
    try {
      const token = await StoryApi.login({ email, password });
      localStorage.setItem('token', token);
      this._loginView.navigateToHome();
    } catch (error) {
      console.error('Login error:', error.message);
      this._loginView.showError(error.message || 'Login gagal');
    }
  }

  async register({ name, email, password }) {
    try {
      await StoryApi.register({ name, email, password });
      this._registerView.showSuccess('Registrasi berhasil! Silakan login');
      this._registerView.navigateToLogin();
    } catch (error) {
      this._registerView.showError(error.message || 'Registrasi gagal');
    }
  }

  showLoginPage(mainElement) {
    mainElement.innerHTML = this._loginView.render();
    this._loginView.bindLogin(this.login.bind(this));
  }

  showRegisterPage(mainElement) {
    mainElement.innerHTML = this._registerView.render();
    this._registerView.bindRegister(this.register.bind(this));
  }
}
