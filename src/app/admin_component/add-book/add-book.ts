import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-book.html',
  styleUrls: ['./add-book.css']
})
export class AddBookComponent implements OnInit {
  bookForm!: FormGroup;
  @Output() bookAdded = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbn: ['', Validators.required],
      publishedYear: ['', Validators.required],
      copiesAvailable: [1, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmitBook() {
    if (this.bookForm.valid) {
      this.bookAdded.emit(this.bookForm.value);
      this.bookForm.reset();
    }
  }
}