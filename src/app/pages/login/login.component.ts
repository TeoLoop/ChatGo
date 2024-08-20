import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router= inject(Router);
  loginForm !: FormGroup;
  private fb = inject(FormBuilder);
  async handleAuth(){
    const response = await this.auth.signInGoogle()
  }

  constructor(){
    this.loginForm=this.fb.nonNullable.group({
      email: ['', Validators.required],
      password: ['',Validators.required],
    })
  }

  errorMessage: string | null= null;

  onSubmit(){
    const rawForm= this.loginForm.getRawValue();
    console.log(rawForm.email, rawForm.password);
    this.auth.login(rawForm.email, rawForm.password).subscribe(result =>{
      if (result.error) {
        this.errorMessage=result.error.message
      }else{
        this.router.navigateByUrl('/chat');
      }
    })
  }
  
}
