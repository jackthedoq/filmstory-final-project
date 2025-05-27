// scripts/views/notfound-view.js

export default class NotFoundView {
  render() {
    return `
      <div class="not-found-container" style="text-align:center; padding: 3rem;">
        <div style="font-size: 5rem;">😕</div>
        <h2 style="font-size: 2rem; color: #e53935;">404 - Halaman Tidak Ditemukan</h2>
        <p style="font-size: 1.1rem; color: #555;">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <a href="#/home" style="margin-top: 1.5rem; display: inline-block; padding: 0.7rem 1.5rem; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
          ⬅ Kembali ke Beranda
        </a>
      </div>
    `;
  }
}
