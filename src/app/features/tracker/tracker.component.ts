/* ────────────────────────────────────────────────────────────
   tracker.component.ts · Daily water‑intake tracker
   ────────────────────────────────────────────────────────── */
   import { Component, computed, inject } from '@angular/core';
   import { CommonModule } from '@angular/common';
   import { FormsModule }  from '@angular/forms';
   import { Router }       from '@angular/router';
   import { HydrationService, Drink } from '../../core/hydration.service';
   
   @Component({
     selector: 'app-tracker',
     standalone: true,
     imports: [CommonModule, FormsModule],
     templateUrl: './tracker.component.html',
     styleUrls:  ['./tracker.component.scss']
   })
   export class TrackerComponent {
     /* dependencies */
     hyd    = inject(HydrationService);
     router = inject(Router);
   
     /* state */
     customMl = 0;
   
     /* derived signals */
     total   = this.hyd.total;
     percent = this.hyd.percent;
     drinks  = computed(() => this.hyd.drinks() as Drink[]);
   
     /* add preset or custom */
     add(ml: number) {
       if (ml > 0) this.hyd.addDrink(ml);
       this.customMl = 0;
     }
   }
   