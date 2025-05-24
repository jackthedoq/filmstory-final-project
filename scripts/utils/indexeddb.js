// scripts/utils/indexeddb.js
const dbName = 'story-db';
const dbVersion = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);
    request.onerror = () => reject('Error opening DB');
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('stories')) {
        db.createObjectStore('stories', { keyPath: 'id' });
      }
    };
  });
}

export async function saveStory(story) {
  const db = await openDB();
  const tx = db.transaction('stories', 'readwrite');
  tx.objectStore('stories').put(story);
  return tx.complete;
}

export async function getAllStories() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction('stories', 'readonly');
    const store = tx.objectStore('stories');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
}

export async function deleteStory(id) {
  const db = await openDB();
  const tx = db.transaction('stories', 'readwrite');
  tx.objectStore('stories').delete(id);
  return tx.complete;
}
