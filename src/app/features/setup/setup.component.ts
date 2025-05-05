/* ────────────────────────────────────────────────────────────
   setup.component.ts · Wizard for personal daily water goal
   ────────────────────────────────────────────────────────── */
   import { Component, OnInit, inject } from '@angular/core';
   import { CommonModule } from '@angular/common';
   import { FormsModule, NgForm } from '@angular/forms';
   import { Router } from '@angular/router';
   import { StorageService } from '../../core/storage.service';
   import { HydrationService } from '../../core/hydration.service';
   
   const PROFILE_KEY = 'hydration-profile';
   
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
     styleUrls: ['./setup.component.scss']
   })
   export class SetupComponent implements OnInit {
     private store  = inject(StorageService);
     private router = inject(Router);
     private hyd    = inject(HydrationService);
   
     model: FormModel = { kg: 70, cm: 170, age: 30, sex: 'female' };
     goalPreview = 0;
   
     ngOnInit(): void {
       const saved = this.store.read<FormModel>(PROFILE_KEY);
       if (saved) this.model = saved;
       this.recalc();
     }
   
     /** live goal preview */
     recalc(): void {
       const { kg, cm, age, sex } = this.model;
       if (!kg || !cm || !age) { this.goalPreview = 0; return; }
   
       let water = kg * 30;
       water *= sex === 'male' ? 1.10 : 1;
       if (cm >= 180) water *= 1.05;
       if (age >= 70)      water *= 0.90;
       else if (age >= 55) water *= 0.95;
   
       this.goalPreview = Math.round(water / 50) * 50;
     }
   
     /** block "-", "e", "E" in number inputs */
     preventMinus(ev: KeyboardEvent): void {
       if (['-', 'e', 'E'].includes(ev.key)) ev.preventDefault();
     }
   
     save(f: NgForm): void {
       if (f.invalid) return;
   
       this.store.write(PROFILE_KEY, this.model);                 // persist profile
       this.hyd.setGoal({ mlPerDay: this.goalPreview });          // persist today
       this.router.navigateByUrl('/tracker');
     }
   }
// Compare this snippet from src/app/core/storage.service.ts:   