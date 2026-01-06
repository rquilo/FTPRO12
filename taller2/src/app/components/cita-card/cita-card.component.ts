import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-cita-card',
  templateUrl: './cita-card.component.html',
  styleUrls: ['./cita-card.component.scss'],
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton, IonIcon],
})
export class CitaCardComponent {
  @Input() cita!: Cita;
  @Input() mostrarBotonEliminar = false;
  @Output() eliminar = new EventEmitter<number>();

  constructor() {
    addIcons({ trashOutline });
  }

  onEliminar(): void {
    this.eliminar.emit(this.cita.id);
  }
}
