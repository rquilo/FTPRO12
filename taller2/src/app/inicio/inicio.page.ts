import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonFooter, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { settingsOutline, listOutline, refreshOutline } from 'ionicons/icons';
import { CitasService } from '../services/citas.service';
import { ConfiguracionService } from '../services/configuracion.service';
import { CitaCardComponent } from '../components/cita-card/cita-card.component';
import { Cita } from '../models/cita.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonFooter,
    IonGrid,
    IonRow,
    IonCol,
    CitaCardComponent
  ]
})
export class InicioPage implements OnInit {
  private citasService = inject(CitasService);
  private configuracionService = inject(ConfiguracionService);

  citaAleatoria: Cita | null = null;
  mostrarBotonEliminar = false;

  constructor() {
    addIcons({ settingsOutline, listOutline, refreshOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.cargarDatos();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarDatos();
  }

  async cargarDatos(): Promise<void> {
    await this.citasService.inicializar();
    await this.configuracionService.inicializar();
    this.mostrarBotonEliminar = this.configuracionService.obtenerPermitirBorrarEnInicio();
    this.cargarCitaAleatoria();
  }

  cargarCitaAleatoria(): void {
    this.citaAleatoria = this.citasService.obtenerCitaAleatoria();
  }

  async onEliminarCita(id: number): Promise<void> {
    await this.citasService.eliminarCita(id);
    this.cargarCitaAleatoria();
  }
}
