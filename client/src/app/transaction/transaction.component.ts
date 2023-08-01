import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DealService } from '../services/deal.service';
import { loadStripe, StripeCardElement, Stripe } from '@stripe/stripe-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  @ViewChild('cardElement') cardElement: ElementRef;

  deal: any;

  stripe: Stripe;
  card: StripeCardElement;
  cardErrors;

  email: string;

  publishableKey: string;
  clientSecret: string;
  paymentIntentId: string;

  constructor(private dealService: DealService,
    private router: Router) { }

  async ngOnInit() {

    this.deal = this.dealService.getSavedDeal();
    this.dealService.getPublisableKey().subscribe(async (res) => {
      this.publishableKey = res.publishableKey;
      this.stripe = await loadStripe(this.publishableKey);
      this.dealService.getSecretKey(this.deal.id).subscribe(async (res) => {
        this.clientSecret = await res.paymentIntent.clientSecret;
        this.paymentIntentId = await res.paymentIntent.id;
        const element = this.stripe.elements({ clientSecret: this.clientSecret });

        this.card = element.create('card');
        this.card.mount(this.cardElement.nativeElement);
        this.card?.on('change', (event) => {
          this.cardErrors = event.error ? event.error.message : '';
        });
      });
    });
  }
  async handleSubmit() {

    // Things could work fine without this check but I got code 400 from https://api.stripe.com/v1/payment_methods
    // when the email isn't valid
    if(!this.isValidEmail(this.email))
    {
      this.cardErrors = "Your email address is invalid."
      return;
    }
    
    const { error, paymentMethod } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.card,
      billing_details: {
        email: this.email,
      },
    });

    if (error) {
      this.cardErrors = error.message;
      return;
    } else {
        this.dealService.checkoutDeal(this.deal.id, this.paymentIntentId, paymentMethod.id).subscribe( ()=>{
          this.router.navigate(['deals']);
        });
    }

  }
  isValidEmail(email) {
    const atIndex = email.indexOf('@');
    const dotIndex = email.lastIndexOf('.');
    return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1;
  }
  
}
