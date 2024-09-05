import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  roles: string[] = [];
  searchTerm: string = '';
  emailSearchTerm: string = '';
  selectedRole: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      response => {
        this.users = response;
        this.filteredUsers = [...this.users];
        this.extractRoles();
        this.filterUsers();
      },
      error => {
        console.error('Error fetching users', error);
      }
    );
  }

  extractRoles() {
    const allRoles = this.users.map(user => user.role);
    this.roles = Array.from(new Set(allRoles));
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const isNameMatch = fullName.includes(this.searchTerm.toLowerCase());
      const isEmailMatch = user.email.toLowerCase().includes(this.emailSearchTerm.toLowerCase());
      const isRoleMatch = this.selectedRole === '' || user.role === this.selectedRole;

      return isNameMatch && isEmailMatch && isRoleMatch;
    });
  }

  // New method to reset filters and refresh the user list
  refreshList() {
    // Reset all filters
    this.searchTerm = '';
    this.emailSearchTerm = '';
    this.selectedRole = '';

    // Reload the user list
    this.loadUsers();
  }
}
