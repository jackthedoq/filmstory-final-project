// file: scripts/views/detail-view.js

class DetailView {
    showStory(story) {
        const mainElement = document.querySelector('main');
        
        mainElement.innerHTML = `
            <div class="detail-container">
                <article>
                    <img src="${story.photoUrl}" alt="${story.description}" class="detail-image">
                    <h2>${story.name}</h2>
                    <div class="meta-info">
                        <span><i class="fas fa-user"></i> ${story.name}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${new Date(story.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    <p>${story.description}</p>
                    
                    <h3>Lokasi</h3>
                    <div id="detailMap" class="detail-map"></div>
                    
                    <div class="actions">
                        <a href="#/home" class="btn btn--primary"><i class="fas fa-arrow-left"></i> Kembali</a>
                    </div>
                </article>
            </div>
        `;
        
        this._initializeMap(story);
    }

_initializeMap(story) {
    if (!story.lat || !story.lon) return;

    const map = L.map('detailMap').setView([story.lat, story.lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([story.lat, story.lon]).addTo(map)
        .bindPopup(`Lokasi: ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}`)
        .openPopup();
}



    showError(message) {
        const mainElement = document.querySelector('main');
        mainElement.innerHTML = `
            <div class="error-state">
                <h2>Terjadi Kesalahan</h2>
                <p>${message}</p>
                <a href="#/home" class="btn btn--primary">Kembali ke Beranda</a>
            </div>
        `;
    }

    showLoading() {
        const mainElement = document.querySelector('main');
        mainElement.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Memuat detail cerita...</p>
            </div>
        `;
    }
}

export default DetailView;
