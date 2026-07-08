import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  lgpdAceito:boolean= false;
  
  constructor(private router: Router) {}

  entrar() {
    if(this.lgpdAceito){
    this.router.navigate(['/dashboard']);
    }
  }


}