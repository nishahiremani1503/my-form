import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private userService: UserService, private router: Router) {}

  login() {
    this.userService.login(this.credentials).subscribe(
      response => {
        console.log('User logged in successfully', response);
        // Handle successful login (e.g., navigate to user list)
        localStorage.setItem("jwt", response.token);
        this.router.navigate(['/user-list']);
      },
      error => {
        console.error('Error logging in user', error);
      }
    );
  }


}
