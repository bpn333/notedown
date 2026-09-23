const DATABASE_NAME = "notedown";
const STORE_NAME = "images";
const DATABASE_VERSION = 1;

const openDatabase = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE_NAME)) {
            request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
});

const runTransaction = async (mode, operation) => {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, mode);
        const request = operation(transaction.objectStore(STORE_NAME));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => database.close();
        transaction.onerror = () => reject(transaction.error);
    });
};

export const saveImage = (blob) => {
    const id = crypto.randomUUID();
    return runTransaction("readwrite", (store) => store.put({
        id,
        blob,
        type: blob.type,
        createdAt: Date.now(),
    })).then(() => id);
};

export const getImage = (id) => runTransaction("readonly", (store) => store.get(id));

export const getImages = () => runTransaction("readonly", (store) => store.getAll());

export const deleteImage = (id) => runTransaction("readwrite", (store) => store.delete(id));
