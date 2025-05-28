// file: scripts/presenters/add-story-presenter.js

import StoryApi from '../utils/api.js';

class AddStoryPresenter {
    constructor(view) {
        this._view = view;
    }

    showForm() {
        this._view.showForm();  // Render form dulu
        this._view.bindAddStory(this._addStory.bind(this));  // Pasang event listener setelah form ada
    }

    async _addStory({ description, photo, lat, lon }) {
        try {
            await StoryApi.addStory({ description, photo, lat, lon });

            await fetch('http://localhost:8000/send-notification', {
                method: 'POST'
            });

            this._view.showSuccessNotification("Cerita berhasil dikirim!");
        } catch (error) {
            this._view.showError(error.message || 'Terjadi kesalahan saat mengirim cerita');
            throw error;
        }
    }
}

export default AddStoryPresenter;
