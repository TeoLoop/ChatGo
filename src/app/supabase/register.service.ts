import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private supabase!: SupabaseClient;

  constructor() {
    this.supabase= createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async newUser(full_name: string, email: string, password: string){
    try{
      console.log(full_name,email,password);
      const {data, error}= await this.supabase.from('users').insert({full_name,email,password});
      if (error){
        console.log(error.message);
      }
    } catch(error){
      alert (error);
    }
  }
}
