//file: scripts/presenters/home-presenter.js

import StoryApi from '../utils/api.js';

class HomePresenter {
    constructor(view) {
        this._view = view;
        this._stories = [];
    }

    async showStories() {
        try {
            this._view.showLoading();
            
            // Add timeout fallback
            this._view.startTimeout(() => {
                this._view.renderError('Waktu pemuatan habis');
            });
            
            // Ambil data dari API dan pastikan data yang diterima adalah listStory
            const response = await StoryApi.getAllStories();
            this._view.clearTimeout();

            // Kirim data listStory yang berupa array ke view
            this._view.renderStories(response.listStory);  // Mengakses listStory dari response

        } catch (error) {
            this._view.clearTimeout();
            this._view.renderError(error.message);
        }
    }
}

export default HomePresenter;
