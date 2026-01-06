import { Injectable, inject } from '@angular/core';
import { DatabaseService } from './database.service';
import { Cita } from '../models/cita.model';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  private databaseService = inject(DatabaseService);
  private citas: Cita[] = [];

  async inicializar(): Promise<void> {
    await this.databaseService.inicializar();
    await this.cargarCitas();
  }

  private async cargarCitas(): Promise<void> {
    this.citas = await this.databaseService.obtenerCitas();
  }

  obtenerCitas(): Cita[] {
    return [...this.citas];
  }

  obtenerCitaAleatoria(): Cita | null {
    if (this.citas.length === 0) return null;
    const indice = Math.floor(Math.random() * this.citas.length);
    return this.citas[indice];
  }

  async agregarCita(frase: string, autor: string): Promise<Cita> {
    const nuevaCita = await this.databaseService.agregarCita(frase, autor);
    this.citas.push(nuevaCita);
    return nuevaCita;
  }

  async actualizarCita(id: number, frase: string, autor: string): Promise<Cita | null> {
    const citaActualizada = await this.databaseService.actualizarCita(id, frase, autor);
    if (citaActualizada) {
      const indice = this.citas.findIndex(c => c.id === id);
      if (indice !== -1) {
        this.citas[indice] = citaActualizada;
      }
    }
    return citaActualizada;
  }

  async eliminarCita(id: number): Promise<boolean> {
    const eliminado = await this.databaseService.eliminarCita(id);
    if (eliminado) {
      const indice = this.citas.findIndex(c => c.id === id);
      if (indice !== -1) {
        this.citas.splice(indice, 1);
      }
    }
    return eliminado;
  }
}
