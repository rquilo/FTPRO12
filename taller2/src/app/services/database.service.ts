import { Injectable } from '@angular/core';
import { Cita } from '../models/cita.model';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private db!: IDBDatabase;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;
  private readonly DB_NAME = 'citasdb';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'citas';

  async inicializar(): Promise<void> {
    if (this.isInitialized) return;

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.ejecutarInicializacion();
    return this.initPromise;
  }
  private async ejecutarInicializacion(): Promise<void> {
    try {
      await this.openDatabase();
      await this.insertarCitasIniciales();
      this.isInitialized = true;
      console.log('IndexedDB: Base de datos inicializada correctamente');
    } catch (error) {
      this.initPromise = null; // Permitir reintentar en caso de error
      throw error;
    }
  }
  private openDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB: Conexión abierta');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true
          });
          store.createIndex('frase', 'frase', { unique: false });
          store.createIndex('autor', 'autor', { unique: false });
          console.log('IndexedDB: CREATE TABLE citas (id, frase, autor)');
        }
      };
    });
  }
  private async insertarCitasIniciales(): Promise<void> {
    const count = await this.contarCitas();

    if (count > 0) {
      console.log(`IndexedDB: Ya existen ${count} citas, no se insertan datos iniciales`);
      return;
    }

    const citasIniciales = [
      { frase: 'La imaginación es más importante que el conocimiento.', autor: 'Albert Einstein' },
      { frase: 'El único modo de hacer un gran trabajo es amar lo que haces.', autor: 'Steve Jobs' },
      { frase: 'Podrán cortar todas las flores, pero no podrán detener la primavera.', autor: 'Pablo Neruda' },
      { frase: 'El futuro de los niños es siempre hoy.', autor: 'Gabriela Mistral' },
      { frase: 'El conocimiento es poder.', autor: 'Francis Bacon' },
    ];

    for (const cita of citasIniciales) {
      await this.agregarCita(cita.frase, cita.autor);
    }
    console.log('IndexedDB: INSERT - 5 citas iniciales insertadas (primera carga)');
  }
  private contarCitas(): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  // ==================== MÉTODOS CRUD ====================
  async obtenerCitas(): Promise<Cita[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const citas = request.result.sort((a: Cita, b: Cita) => b.id - a.id);
        console.log('IndexedDB: SELECT * FROM citas ->', citas.length, 'filas');
        resolve(citas);
      };
      request.onerror = () => reject(request.error);
    });
  }
  async agregarCita(frase: string, autor: string): Promise<Cita> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.add({ frase, autor });

      request.onsuccess = () => {
        const nuevaCita: Cita = {
          id: request.result as number,
          frase,
          autor
        };
        console.log(`IndexedDB: INSERT INTO citas VALUES (${nuevaCita.id}, '${frase}', '${autor}')`);
        resolve(nuevaCita);
      };
      request.onerror = () => reject(request.error);
    });
  }
  async actualizarCita(id: number, frase: string, autor: string): Promise<Cita | null> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);

      // Primero verificamos que la cita existe
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        if (!getRequest.result) {
          console.log(`IndexedDB: UPDATE - Cita con id = ${id} no encontrada`);
          resolve(null);
          return;
        }

        // Actualizamos la cita
        const citaActualizada: Cita = { id, frase, autor };
        const putRequest = store.put(citaActualizada);

        putRequest.onsuccess = () => {
          console.log(`IndexedDB: UPDATE citas SET frase = '${frase}', autor = '${autor}' WHERE id = ${id}`);
          resolve(citaActualizada);
        };
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }
  async eliminarCita(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log(`IndexedDB: DELETE FROM citas WHERE id = ${id}`);
        resolve(true);
      };
      request.onerror = () => reject(request.error);
    });
  }
  async cerrarConexion(): Promise<void> {
    if (this.db) {
      this.db.close();
      console.log('IndexedDB: Conexión cerrada');
    }
  }
}
