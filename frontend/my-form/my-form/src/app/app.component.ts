import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'my-form';

  isOnLoginPage: boolean = false;
  isOnSignupPage: boolean = false;
  isOnUserListPage: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Check the current route on initialization
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const currentUrl = this.router.url;
      this.isOnLoginPage = currentUrl === '/login';
      this.isOnSignupPage = currentUrl === '/signup';
      this.isOnUserListPage = currentUrl === '/user-list';
    });
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
