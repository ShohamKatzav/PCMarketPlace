import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { DealService } from '../services/deal.service';
import { loadStripe, StripeCardElement, Stripe } from '@stripe/stripe-js';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
  imports: [CommonModule, FormsModule]
})
export class TransactionComponent implements OnInit {
  @ViewChild('cardElement') cardElement: ElementRef;

  private dealService = inject(DealService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  deal = this.dealService.currentDeal;

  stripe: Stripe | null = null;
  card: StripeCardElement;
  cardErrors = signal<string>('');

  email: string = '';
  paymentIntentId: string;
  isProcessing = false; // Added to prevent double clicks

  ngOnInit() {
    this.dealService.getPublisableKey().subscribe({
      next: async (res) => {
        this.stripe = await loadStripe(res.publishableKey);
        this.initializeStripeElements();
      },
      error: (err) => this.toastr.error("Could not load payment gateway")
    });
  }

  private initializeStripeElements() {
    const currentDeal = this.deal();
    if (!this.stripe || !currentDeal) return;

    this.dealService.getSecretKey(currentDeal.id).subscribe(async (res) => {
      const clientSecret = res.paymentIntent.value.clientSecret;
      this.paymentIntentId = res.paymentIntent.value.id;

      const elements = this.stripe!.elements();
      this.card = elements.create('card');
      this.card.mount(this.cardElement.nativeElement);

      this.card.on('change', (event) => {
        this.cardErrors.set(event.error ? event.error.message : '');
      });
    });
  }

  async handleSubmit() {
    if (!this.stripe || !this.card || this.isProcessing) return;

    if (!this.isValidEmail(this.email)) {
      this.cardErrors.set("Your email address is invalid.");
      return;
    }

    this.isProcessing = true;

    const { error, paymentMethod } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card,
      billing_details: { email: this.email },
    });

    if (error) {
      this.cardErrors.set(error.message ?? 'Payment failed');
      this.isProcessing = false;
    } else {
      this.dealService.checkoutDeal(this.deal()!.id, this.paymentIntentId, paymentMethod.id).subscribe({
        next: () => {
          this.toastr.success("Transaction completed successfully");
          this.router.navigate(['/deals']);
        },
        error: () => {
          this.toastr.error("Payment confirmed, but server update failed.");
          this.isProcessing = false;
        }
      });
    }
  }

  isValidEmail(email: string): boolean {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  }
}