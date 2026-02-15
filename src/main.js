import './style.css';
import { Header } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { ImageStudio } from './components/ImageStudio.js';

const app = document.querySelector('#app');
let contentArea;

function navigate(page) {
  if (!contentArea) return;
  contentArea.innerHTML = '';

  if (page === 'image') {
    contentArea.appendChild(ImageStudio());
  } else if (page === 'video') {
    contentArea.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full gap-4">
        <div class="text-6xl">🎬</div>
        <h2 class="text-2xl font-bold text-white/80">Video Studio</h2>
        <p class="text-sm text-white/40 max-w-md text-center">AI video generation coming soon. Powered by Google Veo 3.</p>
        <div class="flex gap-2 mt-4">
          <span class="px-3 py-1 rounded-full text-xs bg-white/10 text-white/50">Text to Video</span>
          <span class="px-3 py-1 rounded-full text-xs bg-white/10 text-white/50">Image to Video</span>
          <span class="px-3 py-1 rounded-full text-xs bg-white/10 text-white/50">Camera Controls</span>
        </div>
      </div>`;
  } else if (page === 'cinema') {
    import('./components/CinemaStudio.js').then(({ CinemaStudio }) => {
      contentArea.appendChild(CinemaStudio());
    });
  } else if (page === 'library') {
    contentArea.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full gap-4">
        <div class="text-6xl">📚</div>
        <h2 class="text-2xl font-bold text-white/80">Library</h2>
        <p class="text-sm text-white/40 max-w-md text-center">Your generated images and videos will appear here. History is saved locally.</p>
        <div id="library-grid" class="grid grid-cols-3 gap-3 mt-6 max-w-2xl w-full px-8"></div>
      </div>`;
    loadLibrary();
  }
}

function loadLibrary() {
  try {
    const history = JSON.parse(localStorage.getItem('cinema_history') || '[]');
    const grid = document.getElementById('library-grid');
    if (!grid) return;
    if (!history.length) {
      grid.innerHTML = '<p class="col-span-3 text-center text-white/30 text-sm">No images yet. Start creating!</p>';
      return;
    }
    history.slice(-12).reverse().forEach(item => {
      const card = document.createElement('div');
      card.className = 'aspect-square rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-white/30 transition-all';
      card.innerHTML = `<img src="${item.url}" class="w-full h-full object-cover" alt="${item.prompt?.substring(0,50) || 'Generated'}">`;
      card.title = item.prompt || '';
      card.onclick = () => window.open(item.url, '_blank');
      grid.appendChild(card);
    });
  } catch(e) {}
}

app.innerHTML = '';

// Layout: sidebar + main area
const layout = document.createElement('div');
layout.className = 'flex h-screen w-screen overflow-hidden bg-app-bg';

layout.appendChild(Sidebar());

const mainCol = document.createElement('div');
mainCol.className = 'flex flex-col flex-1 h-full overflow-hidden';
mainCol.appendChild(Header(navigate));

contentArea = document.createElement('main');
contentArea.id = 'content-area';
contentArea.className = 'flex-1 relative w-full overflow-hidden flex flex-col';
mainCol.appendChild(contentArea);

layout.appendChild(mainCol);
app.appendChild(layout);

navigate('image');

window.addEventListener('navigate', (e) => {
  if (e.detail.page === 'settings') {
    import('./components/SettingsModal.js').then(({ SettingsModal }) => {
      document.body.appendChild(SettingsModal());
    });
  } else {
    navigate(e.detail.page);
  }
});
