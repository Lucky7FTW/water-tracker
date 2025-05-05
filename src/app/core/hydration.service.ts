/* ────────────────────────────────────────────────────────────
   src/app/core/hydration.service.ts
   Daily‑goal + drink‑log state, auto‑resetting at midnight
   ────────────────────────────────────────────────────────── */
   import { Injectable, inject, signal, computed } from '@angular/core';
   import { StorageService } from './storage.service';
   
   export interface Goal  { mlPerDay: number; }
   export interface Drink { ml: number; ts: number; }
   
   @Injectable({ providedIn: 'root' })
   export class HydrationService {
     private readonly store = inject(StorageService);
   
     /* ⚠️  DATE‑SCOPED KEYS  ——  reset every calendar day  */
     private readonly today = new Date().toISOString().slice(0, 10);   // YYYY‑MM‑DD
     private readonly goalKey   = `hydration-goal-${this.today}`;
     private readonly drinksKey = `drinks-${this.today}`;
   
     /* reactive signals (Angular 17) */
     goal   = signal<Goal | null>(null);
     drinks = signal<Drink[]>([]);
   
     constructor() {
       /* hydrate from storage */
       this.goal.set(this.store.read<Goal>(this.goalKey));
       this.drinks.set(this.store.read<Drink[]>(this.drinksKey) ?? []);
     }
   
     /* ---------- mutations ---------- */
     setGoal(goal: Goal): void {
       this.goal.set(goal);
       this.store.write(this.goalKey, goal);
     }
   
     addDrink(ml: number): void {
       const drink: Drink = { ml, ts: Date.now() };
       this.drinks.update(list => [...list, drink]);
       this.store.write(this.drinksKey, this.drinks());
     }
   
     undo(drink: Drink): void {
       this.drinks.update(list => list.filter(d => d !== drink));
       this.store.write(this.drinksKey, this.drinks());
     }
   
     /* ---------- derived values ---------- */
     total = computed(() =>
       this.drinks().reduce((sum, d) => sum + d.ml, 0)
     );
   
     percent = computed(() => {
       const g = this.goal();
       return g ? Math.min(100, (this.total() / g.mlPerDay) * 100) : 0;
     });
   }
   