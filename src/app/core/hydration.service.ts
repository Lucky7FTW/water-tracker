/* src/app/core/hydration.service.ts */
import { Injectable, inject, signal, computed } from '@angular/core';
import { StorageService } from './storage.service';

export interface Goal  { mlPerDay: number; }
export interface Drink { ml: number; ts: number; }

@Injectable({ providedIn: 'root' })
export class HydrationService {
  private readonly store     = inject(StorageService);
  private readonly goalKey   = 'hydration-goal';
  private readonly drinksKey = `drinks-${new Date().toISOString().slice(0, 10)}`;

  /* start empty, fill in the constructor */
  goal   = signal<Goal | null>(null);
  drinks = signal<Drink[]>([]);

  constructor() {
    this.goal.set(this.store.read<Goal>(this.goalKey));
    this.drinks.set(this.store.read<Drink[]>(this.drinksKey) ?? []);
  }

  /* ---------- mutations ---------- */
  setGoal(goal: Goal) {
    this.goal.set(goal);
    this.store.write(this.goalKey, goal);
  }

  addDrink(ml: number) {
    const drink: Drink = { ml, ts: Date.now() };
    this.drinks.update(list => [...list, drink]);
    this.store.write(this.drinksKey, this.drinks());
  }

  undo(drink: Drink) {
    this.drinks.update(list => list.filter(d => d !== drink));
    this.store.write(this.drinksKey, this.drinks());
  }

  /* ---------- derived ---------- */
  total   = computed(() => this.drinks().reduce((s, d) => s + d.ml, 0));
  percent = computed(() => {
    const g = this.goal();
    return g ? Math.min(100, (this.total() / g.mlPerDay) * 100) : 0;
  });
}
