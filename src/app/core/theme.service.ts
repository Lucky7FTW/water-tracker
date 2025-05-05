import { Injectable } from '@angular/core';

const KEY = 'hydration-theme';           // "light" | "dark" | null

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private get root(){ return document.documentElement; }

  constructor(){
    const saved = localStorage.getItem(KEY);
    if (saved) this.apply(saved as 'light'|'dark');
  }

  toggle(){
    const next = this.root.classList.contains('theme-dark') ? 'light' : 'dark';
    this.apply(next as 'light'|'dark');
    localStorage.setItem(KEY,next);
  }

  private apply(mode:'light'|'dark'){
    this.root.classList.remove('theme-light','theme-dark');
    this.root.classList.add(`theme-${mode}`);
  }
}
