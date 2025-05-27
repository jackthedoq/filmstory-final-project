// File: scripts/views/home-view.js

import { deleteStory } from '../utils/indexeddb.js'; // Tambahkan ini di atas

export default class HomeView {
    renderStories(stories) {
        const mainElement = document.querySelector('main');

        if (!stories || stories.length === 0) {
            mainElement.innerHTML = `
                <div class="empty-state">
                    <h2>Tidak ada cerita film</h2>
                    <p>Belum ada cerita film yang dibagikan. Jadilah yang pertama!</p>
                    <a href="#/add" class="btn btn--primary">Tambah Cerita Film</a>
                </div>
            `;
            return;
        }

        mainElement.innerHTML = `
            <section>
                <h2 class="section-title">Peta Lokasi Cerita Film</h2>
                <div id="map" style="height: 400px; margin: 20px 0;"></div>
            </section>
            <section>
                <h2 class="section-title">Katalog Film Terbaru</h2>
                <div class="stories">
                    ${stories.map(story => `
                        <article class="card" data-id="${story.id}" tabindex="0">
                            <div class="card__header">
                                <img src="${story.photoUrl}" 
                                    alt="${story.description}" 
                                    class="card__image"
                                    loading="lazy">
                            </div>
                            <div class="card__body">
                                <h3 class="card__title">${story.name}</h3>
                                <div class="card__author">
                                    <i class="fas fa-user"></i>
                                    <span>${story.name}</span>
                                </div>
                                <p class="card__description">${story.description}</p>
                            </div>
                            <div class="card__footer">
                                <time datetime="${new Date(story.createdAt).toISOString()}">
                                    ${new Date(story.createdAt).toLocaleDateString('id-ID')}
                                </time>
                                <a href="#/detail/${story.id}" class="btn btn--primary">Lihat Detail</a>
                                <button class="btn btn--danger delete-button">Hapus Cerita</button>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </section>
        `;

        // Render peta
        this.renderMap(stories);

        // Tambahkan event listener untuk tombol hapus
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async (e) => {
                const card = e.target.closest('.card');
                const storyId = card.getAttribute('data-id');

                if (confirm('Yakin ingin menghapus cerita ini?')) {
                    await deleteStory(storyId);  // hapus dari IndexedDB
                    card.remove();               // hapus dari UI
                }
            });
        });
    }

    renderMap(stories) {
        const map = L.map('map').setView([-2.5, 118], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © OpenStreetMap contributors'
        }).addTo(map);

        stories.forEach(story => {
            if (story.lat && story.lon) {
                L.marker([story.lat, story.lon]).addTo(map)
                    .bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
            }
        });
    }

    renderError(message) {
        const mainElement = document.querySelector('main');
        mainElement.innerHTML = `
            <div class="error-state">
                <h2>Terjadi Kesalahan</h2>
                <p>${message}</p>
                <button class="btn btn--primary" onclick="window.location.reload()">Coba Lagi</button>
            </div>
        `;
    }

    showLoading() {
        const mainElement = document.querySelector('main');
        mainElement.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Memuat cerita film...</p>
            </div>
        `;
    }

    startTimeout(callback) {
        this._timeoutId = setTimeout(callback, 10000);
    }

    clearTimeout() {
        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }
    }
}

