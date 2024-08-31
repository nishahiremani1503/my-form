import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    mobile: '',
    role: 'User'
  };
  roles = ['User', 'Admin', 'Guest'];

  constructor(private userService: UserService, private router: Router) {}

  signup() {
    this.userService.signup(this.user).subscribe(
      response => {
        console.log('User registered successfully', response);
        // Navigate to user list or login after successful registration
        localStorage.setItem("jwt", response.token)
        this.router.navigate(['/user-list']);
      },
      error => {
        console.error('Error registering user', error);
      }
    );
  }
}
