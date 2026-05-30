import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule // Critical for nested navigation
  ], 
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  // Currently, no complex logic is needed here because 
  // the LibraryComponent and MyBooksComponent handle their own data!
}