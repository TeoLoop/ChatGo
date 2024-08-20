import { inject, Injectable, NgZone } from '@angular/core';
import { AuthResponse, SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { compileNgModule } from '@angular/compiler';
import {Router} from  '@angular/router'
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase!: SupabaseClient;
  private _ngZone = inject(NgZone);
  private router= inject(Router);


  constructor() {
    this.supabase= createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.supabase.auth.onAuthStateChange((event, session) =>{
      console.log("event",event);
      console.log("session",session);

      localStorage.setItem('session', JSON.stringify(session?.user));

      if (session?.user) {
        this._ngZone.run(() =>{
          this.router.navigate(['/chat'])
        })
      }
    });
   }

   //register
   register(email: string, full_name: string, password: string): Observable<AuthResponse>{
    const promise = this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        }
      }
    });
    return from(promise);
   }

   //login

   login(email: string, password: string): Observable<AuthResponse>{
    const promise = this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    return from(promise);
   }

   get isLoggedIn(): boolean{
    const user = localStorage.getItem('session');
    console.log(user);
    return user !== null && user !== 'undefined';
   }

   async signInGoogle() {
    await this.supabase.auth.signInWithOAuth({
      provider: 'google',
    });
   }

   async signOut() {
    await this.supabase.auth.signOut();
   }
  
}
