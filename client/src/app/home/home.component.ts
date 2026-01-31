import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    RegisterComponent,
    RouterModule
  ]
})
export class HomeComponent implements OnInit {
  private router = inject(Router);

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { openRegister: boolean };

    if (state?.openRegister) {
      this.registerMode = true;
    }
    if (history.state?.openRegister) {
      this.registerMode = true;
    }
  }
  registerMode = false;

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(cancel: boolean) {
    this.registerMode = cancel;
  }
}