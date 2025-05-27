// File: scripts/views/login-view.js

export default class LoginView {
    render() {
      return `
        <div class="auth-container">
          <h2>Login</h2>
          <form id="loginForm" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn--primary">Login</button>
            <p class="auth-switch">Belum punya akun? <a href="#/register">Daftar disini</a></p>
          </form>
        </div>
      `;
    }
  
    bindLogin(handler) {
      const form = document.getElementById('loginForm');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          await handler({ email, password });
        });
      }
    }
  
    showError(message) {
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      
      const form = document.getElementById('loginForm');
      if (form) {
        const existingError = form.querySelector('.error-message');
        if (existingError) {
          form.removeChild(existingError);
        }
        form.prepend(errorElement);
      }
    }

      navigateToHome() {
        window.location.hash = '#/home'; // Navigasi ke halaman home setelah login sukses
      }

      navigateToLogin() {
        window.location.hash = '#/login'; // Navigasi ke halaman login setelah registrasi
      }
  }