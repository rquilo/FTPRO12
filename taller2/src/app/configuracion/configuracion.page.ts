import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonToggle } from '@ionic/angular/standalone';
import { ConfiguracionService } from '../services/configuracion.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonToggle
  ]
})
export class ConfiguracionPage implements OnInit {
  private configuracionService = inject(ConfiguracionService);
  permitirBorrarEnInicio = false;

  async ngOnInit(): Promise<void> {
    await this.cargarConfiguracion();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarConfiguracion();
  }

  async cargarConfiguracion(): Promise<void> {
    await this.configuracionService.inicializar();
    this.permitirBorrarEnInicio = this.configuracionService.obtenerPermitirBorrarEnInicio();
  }

  async onToggleChange(): Promise<void> {
    await this.configuracionService.setPermitirBorrarEnInicio(this.permitirBorrarEnInicio);
  }
}
