// file: scripts/presenters/add-story-view.js

class AddStoryView {
    constructor() {
        this.stream = null; // Menambahkan properti stream
        this.isCameraOn = false;  // Track jika kamera aktif
        this.isSubmitting = false; 
    }

    showForm() {
        const mainElement = document.querySelector('main');
        mainElement.innerHTML = `
            <section>
                <h2 class="section-title">Tambah Cerita Film Baru</h2>
                <form id="storyForm" class="form">
                    <div id="formError" class="error-message" style="display:none;"></div>

                    <div class="form-group">
                        <label for="description">Deskripsi Film</label>
                        <textarea id="description" class="form-control" required placeholder="Ceritakan tentang film ini..."></textarea>
                    </div>

                    <div class="form-group">
                        <label for="photo">Foto Film</label>
                        <div class="camera-preview" id="cameraPreview">
                            <p>Pratinjau kamera akan muncul di sini</p>
                        </div>
                        <div class="camera-actions">
                            <button type="button" id="startCamera" class="btn btn--primary">
                                <i class="fas fa-camera"></i> Buka Kamera
                            </button>
                            <button type="button" id="capturePhoto" class="btn btn--primary" disabled>
                                <i class="fas fa-camera-retro"></i> Ambil Foto
                            </button>
                            <button type="button" id="uploadPhoto" class="btn btn--primary">
                                <i class="fas fa-upload"></i> Unggah Foto
                            </button>
                        </div>
                        <input type="file" id="photo" accept="image/*" capture="environment" style="display: none;">
                    </div>

                    <div class="form-group">
                        <label for="location">Lokasi</label>
                        <div id="map" style="height: 300px;"></div>
                        <input type="hidden" id="lat" required>
                        <input type="hidden" id="lon" required>
                        <p class="help-text">Klik pada peta untuk menandai lokasi</p>
                    </div>

                    <button type="submit" class="btn btn--primary" id="submitBtn">
                        <i class="fas fa-paper-plane"></i> Kirim Cerita
                    </button>
                </form>
            </section>
        `;

        this._initializeMap();
        this._setupCamera();

        // Ensure camera is stopped when navigating away or closing the page
        window.onbeforeunload = () => {
            this._stopCamera(); // Ensure camera is stopped
        };
    }

    _initializeMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }

        if (typeof L === 'undefined') {
            console.error('Leaflet library not loaded');
            return;
        }

        if (this.map) {
            this.map.remove();
        }

        this.map = L.map('map').setView([-2.5489, 118.0149], 5);

        try {
            const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);

            this.map.on('click', (e) => {
                const { lat, lng } = e.latlng;
                document.getElementById('lat').value = lat;
                document.getElementById('lon').value = lng;

                if (this.marker) {
                    this.map.removeLayer(this.marker);
                }

                this.marker = L.marker([lat, lng]).addTo(this.map)
                    .bindPopup(`Lokasi: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
                    .openPopup();
            });
        } catch (error) {
            console.error('Error initializing map:', error);
            document.getElementById('map').innerHTML = '<p class="error">Gagal memuat peta. Silakan coba lagi.</p>';
        }
    }

    _setupCamera() {
        const cameraPreview = document.getElementById('cameraPreview');
        const startCameraBtn = document.getElementById('startCamera');
        const capturePhotoBtn = document.getElementById('capturePhoto');
        const uploadPhotoBtn = document.getElementById('uploadPhoto');
        const photoInput = document.getElementById('photo');

        startCameraBtn.addEventListener('click', async () => {
            if (!this.isCameraOn) {
                try {
                    // Start the camera stream
                    this.stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: 'environment' },
                        audio: false
                    });

                    // Add video preview
                    cameraPreview.innerHTML = '<video autoplay playsinline></video>';
                    const videoElement = cameraPreview.querySelector('video');
                    videoElement.srcObject = this.stream;

                    // Enable capture button
                    capturePhotoBtn.disabled = false;
                    startCameraBtn.innerHTML = '<i class="fas fa-stop"></i> Matikan Kamera';
                    this.isCameraOn = true;  // Set camera status to on

                } catch (err) {
                    console.error('Camera error:', err);
                    this.showError('Akses kamera ditolak. Silakan aktifkan izin kamera di pengaturan browser.');
                    return;
                }
            } else {
                // Stop the camera if it's already on
                this._stopCamera();
                this.isCameraOn = false;  // Set camera status to off
                startCameraBtn.innerHTML = '<i class="fas fa-camera"></i> Buka Kamera';
            }
        });

        capturePhotoBtn.addEventListener('click', () => {
            if (!this.stream) return;

            const videoElement = cameraPreview.querySelector('video');
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
                this._displayPhotoPreview(file);

                // Stop camera stream
                this._stopCamera();
                this.isCameraOn = false;  // Set camera status to off
            }, 'image/jpeg', 0.9);
        });

        uploadPhotoBtn.addEventListener('click', () => {
            photoInput.click();
        });

        photoInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this._displayPhotoPreview(e.target.files[0]);
            }
        });
    }

    _stopCamera() {
        const cameraPreview = document.getElementById('cameraPreview');
        if (this.stream) {
            // Stop all tracks
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null; // Clear stream reference
        }

        // Reset camera preview and buttons
        cameraPreview.innerHTML = '<p>Pratinjau kamera akan muncul di sini</p>';
    }

    _displayPhotoPreview(file) {
        const cameraPreview = document.getElementById('cameraPreview');
        const reader = new FileReader();

        reader.onload = (e) => {
            cameraPreview.innerHTML = `<img src="${e.target.result}" alt="Pratinjau foto">`;
            this.photoFile = file;
        };

        reader.onerror = () => {
            this.showError('Gagal memuat gambar. Silakan coba lagi.');
        };

        reader.readAsDataURL(file);
    }

bindAddStory(handler) {
    const form = document.getElementById('storyForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('[DEBUG] Form submitted');

        if (this.isSubmitting) return;
        const submitBtn = document.getElementById('submitBtn');
        const errorElement = document.getElementById('formError');

        const description = document.getElementById('description').value.trim();
        const lat = document.getElementById('lat').value;
        const lon = document.getElementById('lon').value;

        console.log('[DEBUG] Description:', description);
        console.log('[DEBUG] Photo file:', this.photoFile);
        console.log('[DEBUG] Latitude:', lat);
        console.log('[DEBUG] Longitude:', lon);

        this.isSubmitting = true;

        // Ubah tombol submit menjadi loading
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            submitBtn.classList.add('loading');
             console.log('Tombol submit berubah menjadi loading');
        }

        // Tampilkan overlay loading
        this.showLoadingIndicator(true);

        // Sembunyikan pesan error sebelumnya
        if (errorElement) errorElement.style.display = 'none';

        try {
            const description = document.getElementById('description').value.trim();
            const lat = document.getElementById('lat').value;
            const lon = document.getElementById('lon').value;

            if (!description) throw new Error('Deskripsi film tidak boleh kosong');
            if (!this.photoFile) throw new Error('Silakan ambil atau unggah foto terlebih dahulu');
            if (!lat || !lon) throw new Error('Silakan tandai lokasi pada peta');

            // Simulasi kirim dan timeout
            await Promise.race([
                handler({ description, photo: this.photoFile, lat, lon }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Waktu tunggu habis. Periksa koneksi internet Anda.')), 30000))
            ]);

            // Reset form
            form.reset();
            this._stopCamera();
            this.photoFile = null;

            // Reset kamera preview
            const cameraPreview = document.getElementById('cameraPreview');
            if (cameraPreview) cameraPreview.innerHTML = '<p>Pratinjau kamera akan muncul di sini</p>';

            // Reset marker peta
            if (this.marker) {
                this.map.removeLayer(this.marker);
                this.marker = null;
            }

            // Reset tombol kamera
            const capturePhotoBtn = document.getElementById('capturePhoto');
            const startCameraBtn = document.getElementById('startCamera');
            if (capturePhotoBtn) capturePhotoBtn.disabled = true;
            if (startCameraBtn) startCameraBtn.innerHTML = '<i class="fas fa-camera"></i> Buka Kamera';
            this.isCameraOn = false;

            // Tampilkan notifikasi sukses
            this.showSuccessNotification("Cerita berhasil dikirim!");

        } catch (error) {
            console.error('Error adding story:', error);
            this.showError(error.message || 'Terjadi kesalahan saat mengirim cerita');
        } finally {
            this.isSubmitting = false;

            // Kembalikan tombol submit
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Cerita';
                submitBtn.classList.remove('loading');
                console.log('Tombol submit berubah menjadi loading');
            }

            // Sembunyikan overlay loading
            this.showLoadingIndicator(false);
        }
    });
}

    showLoadingIndicator(show) {
        console.log(`Menampilkan indikator loading: ${show}`);
        const loadingIndicator = document.getElementById('loadingIndicator') || 
            this.createLoadingIndicator();
            
        loadingIndicator.style.display = show ? 'block' : 'none';
    }

    createLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'loadingIndicator';
        indicator.style.display = 'none';
        indicator.style.position = 'fixed';
        indicator.style.top = '0';
        indicator.style.left = '0';
        indicator.style.width = '100%';
        indicator.style.height = '100%';
        indicator.style.backgroundColor = 'rgba(0,0,0,0.5)';
        indicator.style.zIndex = '1000';
        indicator.style.display = 'flex';
        indicator.style.justifyContent = 'center';
        indicator.style.alignItems = 'center';
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.innerHTML = '<i class="fas fa-spinner fa-spin fa-3x" style="color: white;"></i>';
        
        indicator.appendChild(spinner);
        document.body.appendChild(indicator);
        
        return indicator;
    }

    showSuccessNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animasi muncul
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Animasi hilang setelah 3 detik
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-100%)';
            
            // Hapus element setelah animasi selesai
            setTimeout(() => {
                notification.remove();
                window.location.hash = '#/home';
            }, 500);
        }, 3000);
    }

    showError(message) {
        const errorElement = document.getElementById('formError');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            // Scroll ke error message
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Fallback jika errorElement tidak ada
            alert(`Error: ${message}`);
        }
    }
}

export default AddStoryView;

