import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountService } from './services/account.service';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component'
import { CoreModule } from './modules/core.module';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { ProductCardComponent } from './product/product-card/product-card.component';
import { ProductListComponent } from './product/product-list/product-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MessagesComponent,
    ListsComponent,
    TestErrorsComponent,
    ProductCardComponent,
    ProductListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    CoreModule
  ],
  providers: [AccountService],
  bootstrap: [AppComponent]
})
export class AppModule { }
