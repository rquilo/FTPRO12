import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonItem, IonInput, IonButton, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-formulario-cita',
  templateUrl: './formulario-cita.component.html',
  styleUrls: ['./formulario-cita.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonItem, IonInput, IonButton, IonText],
})
export class FormularioCitaComponent {
  private fb = inject(FormBuilder);

  @Output() nuevaCita = new EventEmitter<{ frase: string; autor: string }>();

  formulario: FormGroup = this.fb.group({
    frase: ['', [Validators.required, Validators.minLength(5)]],
    autor: ['', [Validators.required, Validators.minLength(2)]],
  });

  onSubmit(): void {
    if (this.formulario.valid) {
      this.nuevaCita.emit({
        frase: this.formulario.value.frase,
        autor: this.formulario.value.autor,
      });
      this.formulario.reset();
    }
  }

  get fraseInvalida(): boolean {
    const control = this.formulario.get('frase');
    return control ? control.invalid && control.touched : false;
  }

  get autorInvalido(): boolean {
    const control = this.formulario.get('autor');
    return control ? control.invalid && control.touched : false;
  }
}
