import { Injectable, signal } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { Ichat } from '../interface/chat-response';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private supabase!: SupabaseClient;
  public savedChat= signal({});

  constructor() {
    this.supabase= createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }
  
  async chatMessage(text: string){
    try{
      const {data, error}= await this.supabase.from('chat').insert({text});
      if (error){
        alert (error.message);
      }
    } catch(error){
      alert (error);
    }
  }

  async listChat(){
    try{
      const {data, error} = await this.supabase.from('chat').select('*,users(*)');
      if (error){
        alert (error.message);
      }

      return data;

    }catch (error){
      throw error;
    }
  }

  async deleteChat(id: string){
    const data= await this.supabase.from('chat').delete().eq('id',id);
  }

  selectedChats(msg: Ichat){
    this.savedChat.set(msg)
  }

  async insertImage(avatar_url: string){
    const { data: { session }, error: sessionError } = await this.supabase.auth.getSession();
    try{
      const {data, error}= await this.supabase.from('users').update({avatar_url}).eq('id',session?.user.id);
      if (error){
        alert (error.message);
      }
    } catch(error){
      alert (error);
    }
  }

}
