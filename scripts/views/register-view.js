// File: scripts/views/register-view.js

export default class RegisterView {
    render() {
      return `
        <div class="auth-container">
          <h2>Daftar</h2>
          <form id="registerForm" class="auth-form">
            <div class="form-group">
              <label for="name">Nama</label>
              <input type="text" id="name" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn--primary">Daftar</button>
            <p class="auth-switch">Sudah punya akun? <a href="#/login">Login disini</a></p>
          </form>
        </div>
      `;
    }

  show(container, registerHandler) {
    container.innerHTML = this.render();
    this.bindRegister(registerHandler);
  }
  
    bindRegister(handler) {
      const form = document.getElementById('registerForm');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          await handler({ name, email, password });
        });
      }
    }

  showSuccess(message) {
    const form = document.getElementById('registerForm');
    if (!form) return;

    const existingSuccess = form.querySelector('.success-message');
    if (existingSuccess) {
      existingSuccess.remove();
    }

    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;

    form.prepend(successElement);
  }

    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        const form = document.getElementById('registerForm');
        if (form) {
          const existingError = form.querySelector('.error-message');
          if (existingError) {
            form.removeChild(existingError);
          }
          form.prepend(errorElement);
        }
      }

    navigateToLogin() {
        window.location.hash = '#/login'; // Navigasi ke halaman login setelah registrasi
      }
  }