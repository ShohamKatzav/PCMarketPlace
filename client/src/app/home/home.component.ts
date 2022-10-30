import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    //this.getUsers();
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe(
      {
        next: response => {
          this.users = response;
        }, // what to do with returned data
        error: error => {console.log(error);}, // what to do with error
        complete: () => {console.log('Finished');} // what to do when finished
      }
    )
  }
  cancelRegisterMode(event: boolean){
    this.registerMode = event;
  }

}
