import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HydrationService } from '../../core/hydration.service';

/** template backing model */
interface FormModel {
  kg:  number;
  cm:  number;
  age: number;
  sex: 'female' | 'male';
}

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setup.component.html',
  styleUrls:  ['./setup.component.scss']
})
export class SetupComponent {
  model: FormModel = { kg: 70, cm: 170, age: 30, sex: 'female' };
  goalPreview = 0;               // live‑updated mL goal shown in the UI

  constructor(private hyd: HydrationService, private router: Router) {
    this.recalc();               // show a value on first render
  }

  /** recompute when any field changes */
  recalc(): void {
    const { kg, cm, age, sex } = this.model;

    if (!kg || !cm || !age) { this.goalPreview = 0; return; }

    let water = kg * 30;                 // base: 30 mL × kg

    water *= sex === 'male' ? 1.10 : 1;  // +10 % if male
    if (cm >= 180) water *= 1.05;        // +5 % if 180 cm or taller

    if (age >= 70)      water *= 0.90;   // −10 % age ≥ 70
    else if (age >= 55) water *= 0.95;   // −5 %  55 – 69

    this.goalPreview = Math.round(water / 50) * 50;   // round to nearest 50 mL
  }

  /** persist goal then route to the tracker */
  save(form: NgForm): void {
    if (form.invalid) return;
    this.hyd.setGoal({ mlPerDay: this.goalPreview });
    this.router.navigateByUrl('/tracker');
  }
}
