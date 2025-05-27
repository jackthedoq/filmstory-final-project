// file: scripts/utils/api.js

const BASE_URL = 'https://story-api.dicoding.dev/v1';

class StoryApi {
    // Cek dan ambil token dari localStorage
    static _checkToken() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token tidak ditemukan!');
            throw new Error('Session expired. Please log in again.');
        }
        return token;
    }

    // Login dan kembalikan token
    static async login({ email, password }) {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const responseJson = await response.json();
        console.log('Login Response:', responseJson);

        const token = responseJson.loginResult?.token;
        if (!token) throw new Error('Token tidak ditemukan dalam respons login');

        return token;
    }

    // Register pengguna baru
    static async register({ name, email, password }) {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        return this._handleResponse(response);
    }

    // Tambah cerita baru
    static async addStory({ description, photo, lat, lon }) {
        const token = this._checkToken();
        const formData = new FormData();
        formData.append('description', description);
        formData.append('photo', photo);
        if (lat !== undefined) formData.append('lat', String(lat));
        if (lon !== undefined) formData.append('lon', String(lon));

        const response = await fetch(`${BASE_URL}/stories`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        return this._handleResponse(response);
    }

    // Ambil semua cerita
    static async getAllStories() {
        const token = this._checkToken();
        const response = await fetch(`${BASE_URL}/stories`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        return this._handleResponse(response);
    }

    // Ambil cerita berdasarkan ID
    static async getStoryById(id) {
        const token = this._checkToken();
        const response = await fetch(`${BASE_URL}/stories/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    
        const data = await this._handleResponse(response);
        console.log('Detail story:', data); // Cek data yang diterima
    
        return data;
    }
    
    // Tangani semua response yang dikembalikan
    static async _handleResponse(response) {
        if (response.status === 401) {
            console.error('Token kadaluarsa atau tidak valid');
            localStorage.removeItem('token');
            throw new Error('Session expired. Please log in again.');
        }

        if (!response.ok) {
            const error = await response.json();
            console.error('Error response:', error);
            throw new Error(error.message || 'Request failed');
        }

        return response.json();
    }
}

export default StoryApi;
