import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionService {
  private readonly PERMITIR_BORRAR_KEY = 'permitir_borrar_en_inicio';
  private permitirBorrarEnInicio = false;

  async inicializar(): Promise<void> {
    const { value } = await Preferences.get({ key: this.PERMITIR_BORRAR_KEY });
    this.permitirBorrarEnInicio = value === 'true';
  }

  obtenerPermitirBorrarEnInicio(): boolean {
    return this.permitirBorrarEnInicio;
  }

  async setPermitirBorrarEnInicio(valor: boolean): Promise<void> {
    this.permitirBorrarEnInicio = valor;
    await Preferences.set({
      key: this.PERMITIR_BORRAR_KEY,
      value: valor.toString()
    });
  }
}
