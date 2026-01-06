import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-lista-citas',
  templateUrl: './lista-citas.component.html',
  styleUrls: ['./lista-citas.component.scss'],
  standalone: true,
  imports: [CommonModule, IonList, IonItem, IonLabel, IonButton, IonIcon],
})
export class ListaCitasComponent {
  @Input() citas: Cita[] = [];
  @Output() eliminar = new EventEmitter<number>();

  constructor() {
    addIcons({ trashOutline });
  }

  onEliminar(id: number): void {
    this.eliminar.emit(id);
  }
}
