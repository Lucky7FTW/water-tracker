import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly memory    = new Map<string, string>();        // server fallback

  /* ---------- helpers ---------- */
  private readRaw(key: string): string | null {
    return this.isBrowser ? localStorage.getItem(key) : this.memory.get(key) ?? null;
  }
  private writeRaw(key: string, value: string): void {
    if (this.isBrowser) localStorage.setItem(key, value);
    else                this.memory.set(key, value);
  }
  private removeRaw(key: string): void {
    if (this.isBrowser) localStorage.removeItem(key);
    else                this.memory.delete(key);
  }

  /* ---------- public API ---------- */
  read<T>(key: string): T | null {
    const raw = this.readRaw(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  write<T>(key: string, value: T): void {
    this.writeRaw(key, JSON.stringify(value));
  }

  remove(key: string): void {
    this.removeRaw(key);
  }
}
