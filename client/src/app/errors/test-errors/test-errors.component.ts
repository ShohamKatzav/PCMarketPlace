import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  selector: 'app-test-errors',
  templateUrl: './test-errors.component.html',
  styleUrls: ['./test-errors.component.css'],
  imports: [CommonModule],
})
export class TestErrorsComponent {
  private http = inject(HttpClient);

  baseUrl = environment.apiUrl;
  validationErrors: string[] = [];

  get404Error() {
    this.http.get(this.baseUrl + 'buggy/not-found').subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    });
  }

  get400Error() {
    this.http.get(this.baseUrl + 'buggy/bad-request').subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    });
  }

  get500Error() {
    this.http.get(this.baseUrl + 'buggy/server-error').subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    });
  }

  get401Error() {
    this.http.get(this.baseUrl + 'buggy/auth').subscribe({
      next: res => console.log(res),
      error: err => console.log(err)
    });
  }

  get400Validation() {
    this.http.post(this.baseUrl + 'account/register', {}).subscribe({
      next: res => console.log(res),
      error: err => {
        console.log(err);
        this.validationErrors = err;
      }
    });
  }
}