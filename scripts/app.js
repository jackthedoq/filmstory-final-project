// File: scripts/app.js

import { saveStory, getAllStories } from './utils/indexeddb.js';


import LoginView from './views/login-view.js';
import RegisterView from './views/register-view.js';
import HomeView from './views/home-view.js';
import AddStoryView from './views/add-story-view.js';
import DetailView from './views/detail-view.js';
import AuthPresenter from './presenters/auth-presenter.js';
import HomePresenter from './presenters/home-presenter.js';
import AddStoryPresenter from './presenters/add-story-presenter.js';
import DetailPresenter from './presenters/detail-presenter.js';

class App {

    constructor() {
        this._initialize();
        this._setupEventListeners();
    }

    _initialize() {
        this._views = {
            home: new HomeView(),
            addStory: new AddStoryView(),
            detail: new DetailView(),
            login: new LoginView(),
            register: new RegisterView()
        };

        this._presenters = {
            home: new HomePresenter(this._views.home),
            addStory: new AddStoryPresenter(this._views.addStory),
            detail: new DetailPresenter(this._views.detail),
            auth: new AuthPresenter(this._views.login, this._views.register)
        };

        this._renderPage();
    }

    _setupEventListeners() {
        window.addEventListener('hashchange', () => {
            if (window.location.hash !== '#/add' && this._views.addStory.stream) {
            this._views.addStory.stream.getTracks().forEach(track => track.stop());
            this._views.addStory.stream = null; 
        }
            
            if (this._currentPresenter && typeof this._currentPresenter.destroy === 'function') {
                this._currentPresenter.destroy();
            }
            this._renderPage();
        });

        document.getElementById('hamburgerButton').addEventListener('click', (event) => {
            const navigationDrawer = document.getElementById('navigationDrawer');
            navigationDrawer.classList.toggle('open');
            event.stopPropagation();
        });

        document.addEventListener('click', (event) => {
            const navigationDrawer = document.getElementById('navigationDrawer');
            if (navigationDrawer.classList.contains('open') && !event.target.closest('.app-bar__navigation')) {
                navigationDrawer.classList.remove('open');
            }
        });
    }

    async _renderPage() { 
        const mainElement = document.querySelector('main');
        const hash = window.location.hash || '#/home';

        if (!document.startViewTransition) {
            this._renderWithoutTransition(mainElement, hash);
            return;
        }

        await document.startViewTransition(() => {
            this._renderWithoutTransition(mainElement, hash);
        }).finished;
    }

    _renderWithoutTransition(mainElement, hash) {
        mainElement.innerHTML = '';

        switch (hash) {
            case '#/home':
                this._currentPresenter = this._presenters.home;
                this._presenters.home.showStories();
                break;

            case '#/add':
                this._currentPresenter = this._presenters.addStory;
                this._presenters.addStory.showForm();
                break;

            case '#/about':
                this._currentPresenter = null;
                this._renderAboutPage(mainElement);
                break;

            case '#/login':
                this._currentPresenter = this._presenters.auth;
                this._presenters.auth.showLoginPage(mainElement);
                break;

            case '#/register':
                this._currentPresenter = this._presenters.auth;
                this._presenters.auth.showRegisterPage(mainElement);
                break;

            default:
                if (hash.startsWith('#/detail/')) {
                    const id = hash.split('/')[2];
                    this._currentPresenter = this._presenters.detail;
                    this._presenters.detail.showStory(id);
                } else {
                    this._currentPresenter = null;
                    window.location.hash = '#/home';
                }
                break;
        }
    }

    _renderAboutPage(mainElement) {
        mainElement.innerHTML = `
            <div class="about-container">
                <h2>Tentang FilmStory</h2>
                <p>Aplikasi FilmStory adalah platform untuk berbagi cerita tentang film-film favorit Anda. 
                Anda dapat menambahkan cerita film dengan gambar, deskripsi, dan lokasi.</p>
                <p>Aplikasi ini dibangun menggunakan Dicoding Story API dan memanfaatkan teknologi 
                modern seperti Single Page Application (SPA), View Transition API, dan aksesibilitas web.</p>
            </div>
        `;
    }

    async _loadStoriesWithFallback() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Gagal ambil data API');

    const { listStory } = await response.json();

    // Simpan ke IndexedDB
    listStory.forEach(story => saveStory(story));

    // Tampilkan ke view
    this._presenters.home._view.displayStories(listStory);
  } catch (error) {
    console.warn('⚠ Tidak bisa ambil dari API, fallback ke IndexedDB', error);

    const offlineStories = await getAllStories();
    this._presenters.home._view.displayStories(offlineStories);
  }
}

}



// Tambahan aksesibilitas untuk "skip to content"
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector("#main-content");
    const skipLink = document.querySelector(".skip-link");
  
    if (mainContent && skipLink) {
      skipLink.addEventListener("click", function (event) {
        event.preventDefault();
        skipLink.blur();
        mainContent.focus();
        mainContent.scrollIntoView();
      });
    }
});
  
const app = new App();

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js');
      console.log('✅ Service Worker registered:', reg);

      const existingSubscription = await reg.pushManager.getSubscription();
      if (existingSubscription) {
        await existingSubscription.unsubscribe();
        console.log('🔁 Existing subscription unsubscribed');
      }

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BLepspYY6vkKpZ6ZOUxt_2UKZUgA9zMqFS-wPLUwH8dUYaAk__dR0xRzB8YtXFL28b7Z1JSpOAFyOaZBaJxRJkA'
        )
      });

      console.log('🔔 Push Subscription:', JSON.stringify(subscription));
    } catch (err) {
      console.error('❌ SW/Push Error:', err);
    }
  });
}
