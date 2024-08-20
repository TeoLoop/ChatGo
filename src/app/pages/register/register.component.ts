import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterService } from '../../supabase/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  private fb =inject(FormBuilder);
  registerForm !: FormGroup;
  private authService= inject(AuthService);
  private register_service=inject(RegisterService);
  private router= inject(Router);

  constructor(){
    this.registerForm=this.fb.nonNullable.group({
      full_name: ['',Validators.required],
      email: ['', Validators.required, Validators.email],
      password: ['',Validators.required],
      confirm_password: ['', Validators.required],
      terms: ['',Validators.requiredTrue],
    }, { validators: this.passwordsMatch() });
  }
  
  errorMessage: string | null= null;

  ngOnInit(): void {}

  passwordsMatch(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: boolean } | null => {
      const password = group.get('password')?.value;
      const confirm_password = group.get('confirm_password')?.value;
      
      return password === confirm_password ? null : { passwordMismatch: true };
    };
  }

  onSubmit(){

    const rawForm= this.registerForm.getRawValue();
    console.log(rawForm.email, rawForm.full_name, rawForm.password);
    this.authService.register(rawForm.email, rawForm.full_name, rawForm.password).subscribe(result =>{
      if (result.error) {
        this.errorMessage=result.error.message
      }else{
        this.router.navigateByUrl('/login');
      }
    })
  }
  

}
