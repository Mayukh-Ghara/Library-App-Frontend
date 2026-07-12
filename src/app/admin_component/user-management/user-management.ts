import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UserManagementComponent {
  @Input() users: any[] = [];
  @Output() roleChanged = new EventEmitter<any>();

  toggleRole(user: any) {
    this.roleChanged.emit(user);
  }
}