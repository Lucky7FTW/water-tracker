/* ────────────────────────────────────────────────────────────
   setup.component.ts · Wizard with unit-toggle + info modal
   ────────────────────────────────────────────────────────── */
   import { Component, OnInit, inject } from '@angular/core';
   import { CommonModule } from '@angular/common';
   import { FormsModule, NgForm } from '@angular/forms';
   import { Router } from '@angular/router';
   import { StorageService } from '../../core/storage.service';
   import { HydrationService } from '../../core/hydration.service';
   
   const PROFILE_KEY = 'hydration-profile';
   const UNIT_KEY    = 'hydration-units';   // "metric" | "imperial"
   
   interface FormModel {
     weight: number;   // kg or lb
     height: number;   // cm or in
     age:    number;
     sex:   'female' | 'male';
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
   
     unit: 'metric' | 'imperial' =
       (this.store.read<'metric'|'imperial'>(UNIT_KEY) ?? 'metric');
   
     model: FormModel = { weight: 70, height: 170, age: 30, sex: 'female' };
     goalPreview = 0;
     showInfo = false;
   
     /* ---------- life-cycle ---------- */
     ngOnInit(): void {
       const saved = this.store.read<FormModel>(PROFILE_KEY);
       if (saved) this.model = saved;
       this.recalc();
     }
   
     /* ---------- unit toggle ---------- */
     toggleUnits(): void {
       if (this.unit === 'metric') {
         this.model.weight = +(this.model.weight * 2.205).toFixed(1);  // kg→lb
         this.model.height = +(this.model.height / 2.54).toFixed(0);   // cm→in
         this.unit = 'imperial';
       } else {
         this.model.weight = +(this.model.weight / 2.205).toFixed(1);  // lb→kg
         this.model.height = +(this.model.height * 2.54).toFixed(0);   // in→cm
         this.unit = 'metric';
       }
       this.store.write(UNIT_KEY, this.unit);
       this.recalc();
     }
   
     /* ---------- live preview ---------- */
     recalc(): void {
       const { weight, height, age, sex } = this.model;
       if (!weight || !height || !age) { this.goalPreview = 0; return; }
   
       const kg = this.unit === 'metric' ? weight : weight / 2.205;
       const cm = this.unit === 'metric' ? height : height * 2.54;
   
       let water = kg * 30;
       water *= sex === 'male' ? 1.10 : 1;
       if (cm >= 180) water *= 1.05;
       if (age >= 70)      water *= 0.90;
       else if (age >= 55) water *= 0.95;
   
       this.goalPreview = Math.round(water / 50) * 50;
     }
   
     /** block "-", "e", "E" in number inputs */
     preventMinus(ev: KeyboardEvent) {
       if (['-', 'e', 'E'].includes(ev.key)) ev.preventDefault();
     }
   
     save(f: NgForm){
       if (f.invalid) return;
       this.store.write(PROFILE_KEY, this.model);
       this.hyd.setGoal({ mlPerDay: this.goalPreview });
       this.router.navigateByUrl('/tracker');
     }
   }
   