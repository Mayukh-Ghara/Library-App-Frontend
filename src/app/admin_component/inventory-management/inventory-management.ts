import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-management.html',
  styleUrls: ['./inventory-management.css']
})
export class InventoryManagementComponent {
  @Input() books: any[] = [];
  @Output() copiesAdjusted = new EventEmitter<{book: any, newCount: number}>();

  updateCopies(book: any, newCount: number) {
    this.copiesAdjusted.emit({ book, newCount });
  }
}