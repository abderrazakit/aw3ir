import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class App implements OnInit {
  title = '⛅ Weather webapp @Master 3ir²';
  isDark = true;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.applyTheme(savedTheme);
  }

  toggleTheme(): void {
    const nextTheme = this.isDark ? 'light' : 'dark';
    this.applyTheme(nextTheme);
  }

  private applyTheme(theme: string): void {
    this.isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}