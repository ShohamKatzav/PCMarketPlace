import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [
    RouterModule
  ]
})
export class FooterComponent {

  private router = inject(Router);

  navigateToRegister() {
    this.router.navigate(['/home'], { state: { openRegister: true } });
  }

}
