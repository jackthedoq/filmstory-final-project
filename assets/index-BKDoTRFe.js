(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const b="story-db",v=1;function h(){return new Promise((n,e)=>{const t=indexedDB.open(b,v);t.onerror=()=>e("Error opening DB"),t.onsuccess=()=>n(t.result),t.onupgradeneeded=i=>{const a=i.target.result;a.objectStoreNames.contains("stories")||a.createObjectStore("stories",{keyPath:"id"})}})}async function k(n){const t=(await h()).transaction("stories","readwrite");return t.objectStore("stories").put(n),t.complete}async function E(){const n=await h();return new Promise(e=>{const a=n.transaction("stories","readonly").objectStore("stories").getAll();a.onsuccess=()=>e(a.result)})}async function _(n){const t=(await h()).transaction("stories","readwrite");return t.objectStore("stories").delete(n),t.complete}class S{render(){return`
        <div class="auth-container">
          <h2>Login</h2>
          <form id="loginForm" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" class="form-control" required>
            </div>
            <button type="submit" class="btn btn--primary">Login</button>
            <p class="auth-switch">Belum punya akun? <a href="#/register">Daftar disini</a></p>
          </form>
        </div>
      `}bindLogin(e){const t=document.getElementById("loginForm");t&&t.addEventListener("submit",async i=>{i.preventDefault();const a=document.getElementById("email").value,r=document.getElementById("password").value;await e({email:a,password:r})})}showError(e){const t=document.createElement("div");t.className="error-message",t.textContent=e;const i=document.getElementById("loginForm");if(i){const a=i.querySelector(".error-message");a&&i.removeChild(a),i.prepend(t)}}navigateToHome(){window.location.hash="#/home"}navigateToLogin(){window.location.hash="#/login"}}class P{render(){return`
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
      `}show(e,t){e.innerHTML=this.render(),this.bindRegister(t)}bindRegister(e){const t=document.getElementById("registerForm");t&&t.addEventListener("submit",async i=>{i.preventDefault();const a=document.getElementById("name").value,r=document.getElementById("email").value,s=document.getElementById("password").value;await e({name:a,email:r,password:s})})}showSuccess(e){const t=document.getElementById("registerForm");if(!t)return;const i=t.querySelector(".success-message");i&&i.remove();const a=document.createElement("div");a.className="success-message",a.textContent=e,t.prepend(a)}showError(e){const t=document.createElement("div");t.className="error-message",t.textContent=e;const i=document.getElementById("registerForm");if(i){const a=i.querySelector(".error-message");a&&i.removeChild(a),i.prepend(t)}}navigateToLogin(){window.location.hash="#/login"}}class T{renderStories(e){const t=document.querySelector("main");if(!e||e.length===0){t.innerHTML=`
                <div class="empty-state">
                    <h2>Tidak ada cerita film</h2>
                    <p>Belum ada cerita film yang dibagikan. Jadilah yang pertama!</p>
                    <a href="#/add" class="btn btn--primary">Tambah Cerita Film</a>
                </div>
            `;return}t.innerHTML=`
            <section>
                <h2 class="section-title">Peta Lokasi Cerita Film</h2>
                <div id="map" style="height: 400px; margin: 20px 0;"></div>
            </section>
            <section>
                <h2 class="section-title">Katalog Film Terbaru</h2>
                <div class="stories">
                    ${e.map(i=>`
                        <article class="card" data-id="${i.id}" tabindex="0">
                            <div class="card__header">
                                <img src="${i.photoUrl}" 
                                    alt="${i.description}" 
                                    class="card__image"
                                    loading="lazy">
                            </div>
                            <div class="card__body">
                                <h3 class="card__title">${i.name}</h3>
                                <div class="card__author">
                                    <i class="fas fa-user"></i>
                                    <span>${i.name}</span>
                                </div>
                                <p class="card__description">${i.description}</p>
                            </div>
                            <div class="card__footer">
                                <time datetime="${new Date(i.createdAt).toISOString()}">
                                    ${new Date(i.createdAt).toLocaleDateString("id-ID")}
                                </time>
                                <a href="#/detail/${i.id}" class="btn btn--primary">Lihat Detail</a>
                                <button class="btn btn--danger delete-button">Hapus Cerita</button>
                            </div>
                        </article>
                    `).join("")}
                </div>
            </section>
        `,this.renderMap(e),document.querySelectorAll(".delete-button").forEach(i=>{i.addEventListener("click",async a=>{const r=a.target.closest(".card"),s=r.getAttribute("data-id");confirm("Yakin ingin menghapus cerita ini?")&&(await _(s),r.remove())})})}renderMap(e){const t=L.map("map").setView([-2.5,118],5);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"Map data © OpenStreetMap contributors"}).addTo(t),e.forEach(i=>{i.lat&&i.lon&&L.marker([i.lat,i.lon]).addTo(t).bindPopup(`<strong>${i.name}</strong><br>${i.description}`)})}renderError(e){const t=document.querySelector("main");t.innerHTML=`
            <div class="error-state">
                <h2>Terjadi Kesalahan</h2>
                <p>${e}</p>
                <button class="btn btn--primary" onclick="window.location.reload()">Coba Lagi</button>
            </div>
        `}showLoading(){const e=document.querySelector("main");e.innerHTML=`
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Memuat cerita film...</p>
            </div>
        `}startTimeout(e){this._timeoutId=setTimeout(e,1e4)}clearTimeout(){this._timeoutId&&(clearTimeout(this._timeoutId),this._timeoutId=null)}}class B{constructor(){this.stream=null,this.isCameraOn=!1,this.isSubmitting=!1}showForm(){const e=document.querySelector("main");e.innerHTML=`
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
        `,this._initializeMap(),this._setupCamera(),window.onbeforeunload=()=>{this._stopCamera()}}_initializeMap(){if(!document.getElementById("map")){console.error("Map element not found");return}if(typeof L>"u"){console.error("Leaflet library not loaded");return}this.map&&this.map.remove(),this.map=L.map("map").setView([-2.5489,118.0149],5);try{const t=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.map);this.map.on("click",i=>{const{lat:a,lng:r}=i.latlng;document.getElementById("lat").value=a,document.getElementById("lon").value=r,this.marker&&this.map.removeLayer(this.marker),this.marker=L.marker([a,r]).addTo(this.map).bindPopup(`Lokasi: ${a.toFixed(4)}, ${r.toFixed(4)}`).openPopup()})}catch(t){console.error("Error initializing map:",t),document.getElementById("map").innerHTML='<p class="error">Gagal memuat peta. Silakan coba lagi.</p>'}}_setupCamera(){const e=document.getElementById("cameraPreview"),t=document.getElementById("startCamera"),i=document.getElementById("capturePhoto"),a=document.getElementById("uploadPhoto"),r=document.getElementById("photo");t.addEventListener("click",async()=>{if(this.isCameraOn)this._stopCamera(),this.isCameraOn=!1,t.innerHTML='<i class="fas fa-camera"></i> Buka Kamera';else try{this.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:!1}),e.innerHTML="<video autoplay playsinline></video>";const s=e.querySelector("video");s.srcObject=this.stream,i.disabled=!1,t.innerHTML='<i class="fas fa-stop"></i> Matikan Kamera',this.isCameraOn=!0}catch(s){console.error("Camera error:",s),this.showError("Akses kamera ditolak. Silakan aktifkan izin kamera di pengaturan browser.");return}}),i.addEventListener("click",()=>{if(!this.stream)return;const s=e.querySelector("video"),o=document.createElement("canvas");o.width=s.videoWidth,o.height=s.videoHeight,o.getContext("2d").drawImage(s,0,0,o.width,o.height),o.toBlob(m=>{const l=new File([m],"captured-photo.jpg",{type:"image/jpeg"});this._displayPhotoPreview(l),this._stopCamera(),this.isCameraOn=!1},"image/jpeg",.9)}),a.addEventListener("click",()=>{r.click()}),r.addEventListener("change",s=>{s.target.files.length>0&&this._displayPhotoPreview(s.target.files[0])})}_stopCamera(){const e=document.getElementById("cameraPreview");this.stream&&(this.stream.getTracks().forEach(t=>t.stop()),this.stream=null),e.innerHTML="<p>Pratinjau kamera akan muncul di sini</p>"}_displayPhotoPreview(e){const t=document.getElementById("cameraPreview"),i=new FileReader;i.onload=a=>{t.innerHTML=`<img src="${a.target.result}" alt="Pratinjau foto">`,this.photoFile=e},i.onerror=()=>{this.showError("Gagal memuat gambar. Silakan coba lagi.")},i.readAsDataURL(e)}bindAddStory(e){const t=document.getElementById("storyForm");t&&t.addEventListener("submit",async i=>{if(i.preventDefault(),console.log("[DEBUG] Form submitted"),this.isSubmitting)return;const a=document.getElementById("submitBtn"),r=document.getElementById("formError"),s=document.getElementById("description").value.trim(),o=document.getElementById("lat").value,m=document.getElementById("lon").value;console.log("[DEBUG] Description:",s),console.log("[DEBUG] Photo file:",this.photoFile),console.log("[DEBUG] Latitude:",o),console.log("[DEBUG] Longitude:",m),this.isSubmitting=!0,a&&(a.disabled=!0,a.innerHTML='<i class="fas fa-spinner fa-spin"></i> Mengirim...',a.classList.add("loading"),console.log("Tombol submit berubah menjadi loading")),this.showLoadingIndicator(!0),r&&(r.style.display="none");try{const l=document.getElementById("description").value.trim(),u=document.getElementById("lat").value,p=document.getElementById("lon").value;if(!l)throw new Error("Deskripsi film tidak boleh kosong");if(!this.photoFile)throw new Error("Silakan ambil atau unggah foto terlebih dahulu");if(!u||!p)throw new Error("Silakan tandai lokasi pada peta");await Promise.race([e({description:l,photo:this.photoFile,lat:u,lon:p}),new Promise((j,y)=>setTimeout(()=>y(new Error("Waktu tunggu habis. Periksa koneksi internet Anda.")),3e4))]),t.reset(),this._stopCamera(),this.photoFile=null;const g=document.getElementById("cameraPreview");g&&(g.innerHTML="<p>Pratinjau kamera akan muncul di sini</p>"),this.marker&&(this.map.removeLayer(this.marker),this.marker=null);const f=document.getElementById("capturePhoto"),w=document.getElementById("startCamera");f&&(f.disabled=!0),w&&(w.innerHTML='<i class="fas fa-camera"></i> Buka Kamera'),this.isCameraOn=!1,this.showSuccessNotification("Cerita berhasil dikirim!")}catch(l){console.error("Error adding story:",l),this.showError(l.message||"Terjadi kesalahan saat mengirim cerita")}finally{this.isSubmitting=!1,a&&(a.disabled=!1,a.innerHTML='<i class="fas fa-paper-plane"></i> Kirim Cerita',a.classList.remove("loading"),console.log("Tombol submit berubah menjadi loading")),this.showLoadingIndicator(!1)}})}showLoadingIndicator(e){console.log(`Menampilkan indikator loading: ${e}`);const t=document.getElementById("loadingIndicator")||this.createLoadingIndicator();t.style.display=e?"block":"none"}createLoadingIndicator(){const e=document.createElement("div");e.id="loadingIndicator",e.style.display="none",e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.width="100%",e.style.height="100%",e.style.backgroundColor="rgba(0,0,0,0.5)",e.style.zIndex="1000",e.style.display="flex",e.style.justifyContent="center",e.style.alignItems="center";const t=document.createElement("div");return t.className="spinner",t.innerHTML='<i class="fas fa-spinner fa-spin fa-3x" style="color: white;"></i>',e.appendChild(t),document.body.appendChild(e),e}showSuccessNotification(e){const t=document.createElement("div");t.className="notification success",t.innerHTML=`
            <i class="fas fa-check-circle"></i>
            <span>${e}</span>
        `,document.body.appendChild(t),setTimeout(()=>{t.style.opacity="1",t.style.transform="translateY(0)"},10),setTimeout(()=>{t.style.opacity="0",t.style.transform="translateY(-100%)",setTimeout(()=>{t.remove(),window.location.hash="#/home"},500)},3e3)}showError(e){const t=document.getElementById("formError");t?(t.textContent=e,t.style.display="block",t.scrollIntoView({behavior:"smooth",block:"center"})):alert(`Error: ${e}`)}}class I{showStory(e){const t=document.querySelector("main");t.innerHTML=`
            <div class="detail-container">
                <article>
                    <img src="${e.photoUrl}" alt="${e.description}" class="detail-image">
                    <h2>${e.name}</h2>
                    <div class="meta-info">
                        <span><i class="fas fa-user"></i> ${e.name}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${new Date(e.createdAt).toLocaleDateString("id-ID")}</span>
                    </div>
                    <p>${e.description}</p>
                    
                    <h3>Lokasi</h3>
                    <div id="detailMap" class="detail-map"></div>
                    
                    <div class="actions">
                        <a href="#/home" class="btn btn--primary"><i class="fas fa-arrow-left"></i> Kembali</a>
                    </div>
                </article>
            </div>
        `,this._initializeMap(e)}_initializeMap(e){if(!e.lat||!e.lon)return;const t=L.map("detailMap").setView([e.lat,e.lon],13);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(t),L.marker([e.lat,e.lon]).addTo(t).bindPopup(`Lokasi: ${e.lat.toFixed(4)}, ${e.lon.toFixed(4)}`).openPopup()}showError(e){const t=document.querySelector("main");t.innerHTML=`
            <div class="error-state">
                <h2>Terjadi Kesalahan</h2>
                <p>${e}</p>
                <a href="#/home" class="btn btn--primary">Kembali ke Beranda</a>
            </div>
        `}showLoading(){const e=document.querySelector("main");e.innerHTML=`
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Memuat detail cerita...</p>
            </div>
        `}}const c="https://story-api.dicoding.dev/v1";class d{static _checkToken(){const e=localStorage.getItem("token");if(!e)throw console.error("Token tidak ditemukan!"),new Error("Session expired. Please log in again.");return e}static async login({email:e,password:t}){var s;const i=await fetch(`${c}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})});if(!i.ok){const o=await i.json();throw new Error(o.message||"Login failed")}const a=await i.json();console.log("Login Response:",a);const r=(s=a.loginResult)==null?void 0:s.token;if(!r)throw new Error("Token tidak ditemukan dalam respons login");return r}static async register({name:e,email:t,password:i}){const a=await fetch(`${c}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,password:i})});return this._handleResponse(a)}static async addStory({description:e,photo:t,lat:i,lon:a}){const r=this._checkToken(),s=new FormData;s.append("description",e),s.append("photo",t),i!==void 0&&s.append("lat",String(i)),a!==void 0&&s.append("lon",String(a));const o=await fetch(`${c}/stories`,{method:"POST",headers:{Authorization:`Bearer ${r}`},body:s});return this._handleResponse(o)}static async getAllStories(){const e=this._checkToken(),t=await fetch(`${c}/stories`,{headers:{Authorization:`Bearer ${e}`}});return this._handleResponse(t)}static async getStoryById(e){const t=this._checkToken(),i=await fetch(`${c}/stories/${e}`,{headers:{Authorization:`Bearer ${t}`}}),a=await this._handleResponse(i);return console.log("Detail story:",a),a}static async _handleResponse(e){if(e.status===401)throw console.error("Token kadaluarsa atau tidak valid"),localStorage.removeItem("token"),new Error("Session expired. Please log in again.");if(!e.ok){const t=await e.json();throw console.error("Error response:",t),new Error(t.message||"Request failed")}return e.json()}}class M{constructor(e,t){this._loginView=e,this._registerView=t}async login({email:e,password:t}){try{const i=await d.login({email:e,password:t});localStorage.setItem("token",i),this._loginView.navigateToHome()}catch(i){console.error("Login error:",i.message),this._loginView.showError(i.message||"Login gagal")}}async register({name:e,email:t,password:i}){try{await d.register({name:e,email:t,password:i}),this._registerView.showSuccess("Registrasi berhasil! Silakan login"),this._registerView.navigateToLogin()}catch(a){this._registerView.showError(a.message||"Registrasi gagal")}}showLoginPage(e){e.innerHTML=this._loginView.render(),this._loginView.bindLogin(this.login.bind(this))}showRegisterPage(e){e.innerHTML=this._registerView.render(),this._registerView.bindRegister(this.register.bind(this))}}class C{constructor(e){this._view=e,this._stories=[]}async showStories(){try{this._view.showLoading(),this._view.startTimeout(()=>{this._view.renderError("Waktu pemuatan habis")});const e=await d.getAllStories();this._view.clearTimeout(),this._view.renderStories(e.listStory)}catch(e){this._view.clearTimeout(),this._view.renderError(e.message)}}}class D{constructor(e){this._view=e}showForm(){this._view.showForm(),this._view.bindAddStory(this._addStory.bind(this))}async _addStory({description:e,photo:t,lat:i,lon:a}){try{await d.addStory({description:e,photo:t,lat:i,lon:a}),this._view.showSuccessNotification("Cerita berhasil dikirim!")}catch(r){throw this._view.showError(r.message||"Terjadi kesalahan saat mengirim cerita"),r}}}class x{constructor(e){this._view=e}async showStory(e){try{this._view.showLoading();const i=(await d.getStoryById(e)).story;if(i.photoUrl=i.photoUrl||i.photo_url,!i||!i.name||!i.description||!i.photoUrl)throw new Error("Data cerita tidak lengkap");this._view.showStory(i)}catch(t){console.error("Detail error:",t),this._view.showError(t.message||"Terjadi kesalahan dalam menampilkan detail cerita")}}}class A{render(){return`
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
    `}}class F{constructor(){this._initialize(),this._setupEventListeners()}_initialize(){this._views={home:new T,addStory:new B,detail:new I,login:new S,register:new P,notfound:new A},this._presenters={home:new C(this._views.home),addStory:new D(this._views.addStory),detail:new x(this._views.detail),auth:new M(this._views.login,this._views.register)},this._renderPage()}_setupEventListeners(){window.addEventListener("hashchange",()=>{window.location.hash!=="#/add"&&this._views.addStory.stream&&(this._views.addStory.stream.getTracks().forEach(e=>e.stop()),this._views.addStory.stream=null),this._currentPresenter&&typeof this._currentPresenter.destroy=="function"&&this._currentPresenter.destroy(),this._renderPage()}),document.getElementById("hamburgerButton").addEventListener("click",e=>{document.getElementById("navigationDrawer").classList.toggle("open"),e.stopPropagation()}),document.addEventListener("click",e=>{const t=document.getElementById("navigationDrawer");t.classList.contains("open")&&!e.target.closest(".app-bar__navigation")&&t.classList.remove("open")})}async _renderPage(){const e=document.querySelector("main"),t=window.location.hash||"#/home";if(!document.startViewTransition){this._renderWithoutTransition(e,t);return}await document.startViewTransition(()=>{this._renderWithoutTransition(e,t)}).finished}_renderWithoutTransition(e,t){switch(e.innerHTML="",t){case"#/home":this._currentPresenter=this._presenters.home,this._presenters.home.showStories();break;case"#/add":this._currentPresenter=this._presenters.addStory,this._presenters.addStory.showForm();break;case"#/about":this._currentPresenter=null,this._renderAboutPage(e);break;case"#/login":this._currentPresenter=this._presenters.auth,this._presenters.auth.showLoginPage(e);break;case"#/register":this._currentPresenter=this._presenters.auth,this._presenters.auth.showRegisterPage(e);break;default:if(t.startsWith("#/detail/")){const i=t.split("/")[2];this._currentPresenter=this._presenters.detail,this._presenters.detail.showStory(i)}else e.innerHTML=this._views.notfound.render(),this._currentPresenter=null;break}}_renderAboutPage(e){e.innerHTML=`
            <div class="about-container">
                <h2>Tentang FilmStory</h2>
                <p>Aplikasi FilmStory adalah platform untuk berbagi cerita tentang film-film favorit Anda. 
                Anda dapat menambahkan cerita film dengan gambar, deskripsi, dan lokasi.</p>
                <p>Aplikasi ini dibangun menggunakan Dicoding Story API dan memanfaatkan teknologi 
                modern seperti Single Page Application (SPA), View Transition API, dan aksesibilitas web.</p>
            </div>
        `}async _loadStoriesWithFallback(){try{const e=localStorage.getItem("token"),t=await fetch("https://story-api.dicoding.dev/v1/stories",{headers:{Authorization:`Bearer ${e}`}});if(!t.ok)throw new Error("Gagal ambil data API");const{listStory:i}=await t.json();i.forEach(a=>k(a)),this._presenters.home._view.displayStories(i)}catch(e){console.warn("⚠ Tidak bisa ambil dari API, fallback ke IndexedDB",e);const t=await E();this._presenters.home._view.displayStories(t)}}}document.addEventListener("DOMContentLoaded",()=>{const n=document.querySelector("#main-content"),e=document.querySelector(".skip-link");n&&e&&e.addEventListener("click",function(t){t.preventDefault(),e.blur(),n.focus(),n.scrollIntoView()})});new F;function $(n){const e="=".repeat((4-n.length%4)%4),t=(n+e).replace(/-/g,"+").replace(/_/g,"/"),i=window.atob(t);return Uint8Array.from([...i].map(a=>a.charCodeAt(0)))}"serviceWorker"in navigator&&"PushManager"in window&&window.addEventListener("load",async()=>{try{const n=await navigator.serviceWorker.register("/filmstory-final-project/service-worker.js");console.log("✅ Service Worker registered:",n);const e=await n.pushManager.getSubscription();e&&(await e.unsubscribe(),console.log("🔁 Existing subscription unsubscribed"));const t=await n.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:$("BJQjAMpxWGi5oLOx-42CvpCrtRC1EEd7RgBZ9njuMUXcgDmajNvESbeBZfx_hkDLBtux6mM0inl7dHjbrg9C-MY")});console.log("🔔 Push Subscription:",JSON.stringify(t))}catch(n){console.error("❌ SW/Push Error:",n)}});
