import { Component, input, computed } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  product = input.required<Product>();

  productImageUrl = computed(() =>
    this.product().productPhoto?.url ?? './assets/no-image.jpeg'
  );
}