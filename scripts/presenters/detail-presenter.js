// file: scripts/presenters/detail-presenter.js

import StoryApi from '../utils/api.js';

class DetailPresenter {
    constructor(view) {
        this._view = view;
    }

    async showStory(id) {
        try {
            this._view.showLoading();
            
            const response = await StoryApi.getStoryById(id);
            const story = response.story;

            // Normalize properti agar konsisten
            story.photoUrl = story.photoUrl || story.photo_url;

            if (!story || !story.name || !story.description || !story.photoUrl) {
                throw new Error('Data cerita tidak lengkap');
            }

            this._view.showStory(story);
        } catch (error) {
            console.error('Detail error:', error);
            this._view.showError(error.message || 'Terjadi kesalahan dalam menampilkan detail cerita');
        }
    }
}

export default DetailPresenter;
