import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() supportedLanguages: string[];
  @Input() currentLang: string;
  @Output() selectedLanguage = new EventEmitter<string>();
  selectedValue: string;
  prevLang: string;
  next: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
    this.selectedValue = this.currentLang;
  }

  isCurrentLanguage(l: string): boolean {
    return this.currentLang !== undefined && l.toLowerCase() === this.currentLang.toLowerCase();
  }

  selectLanguage(lang: string, event: any): void {
    if (event.isUserInput) {
      this.currentLang = lang;
      this.selectedLanguage.emit(lang);
    }

  }
}
