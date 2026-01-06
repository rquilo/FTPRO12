import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { CitasService } from '../services/citas.service';
import { FormularioCitaComponent } from '../components/formulario-cita/formulario-cita.component';
import { ListaCitasComponent } from '../components/lista-citas/lista-citas.component';
import { Cita } from '../models/cita.model';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    FormularioCitaComponent,
    ListaCitasComponent
  ]
})
export class CitasPage implements OnInit {
  private citasService = inject(CitasService);
  citas: Cita[] = [];

  async ngOnInit(): Promise<void> {
    await this.cargarCitas();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarCitas();
  }

  async cargarCitas(): Promise<void> {
    await this.citasService.inicializar();
    this.citas = this.citasService.obtenerCitas();
  }

  async onNuevaCita(evento: { frase: string; autor: string }): Promise<void> {
    await this.citasService.agregarCita(evento.frase, evento.autor);
    this.citas = this.citasService.obtenerCitas();
  }

  async onEliminarCita(id: number): Promise<void> {
    await this.citasService.eliminarCita(id);
    this.citas = this.citasService.obtenerCitas();
  }
}
