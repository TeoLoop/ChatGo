import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../supabase/chat.service';
import { Ichat } from '../../interface/chat-response';
import { DatePipe } from '@angular/common';
import { DeleteModalComponent } from '../../layout/delete-modal/delete-modal.component';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DeleteModalComponent, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent {
  private auth= inject(AuthService);
  private chat_service= inject(ChatService);
  private router= inject(Router);
  private fb =inject(FormBuilder);
  chatForm !: FormGroup;
  chats= signal<Ichat[]>([]);
  urlInput: string = '';
  realtimeChats = this.chat_service.realtimeChats;


  constructor(){
    this.chatForm=this.fb.group({
      chat_message: ['', Validators.required]
    });

    effect(() => {
      this.onListChat();
    })

    effect(() => {
      this.chats.set(this.realtimeChats()); // Actualizamos los chats cuando la señal de tiempo real cambia
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    // Cargar chats iniciales al iniciar el componente
    this.chat_service.listChat().then(chats => {
      if (chats) {
        this.chat_service.realtimeChats.set(chats); // Inicializar con los datos actuales
      }
    });
  }

      async logOut(){
        this.auth.signOut().then(() =>{
          this.router.navigate(['/login']);
        })
          .catch((err) => {
          alert(err.message);
        });
      }

      onSubmit(){
        const formValue=this.chatForm.value.chat_message;
        console.log(formValue);

        this.chat_service.chatMessage(formValue).then((res) =>{
          console.log(res);
          this.chatForm.reset();

          this.onListChat();

        }).catch((err) =>{
          alert(err.message);
        });

  

      }

      onListChat(){
        this.chat_service.listChat().then((res: Ichat[] | null) =>{

          console.log(res);
          if (res !==null) {
            this.chats.set(res);
          }else{
            console.log("No se encontraron Mensajes")
          }
          
        }).catch((err) => {
          alert(err.message);
        });
      }

      openDropDown(msg: Ichat){
        console.log(msg);
        this.chat_service.selectedChats(msg);
      }


      openUrlPopup() {
        document.getElementById('urlPopup')!.style.display = 'block';
      }
    
      closeUrlPopup() {
        document.getElementById('urlPopup')!.style.display = 'none';
      }
    
      processUrl() {
        console.log('URL ingresada:', this.urlInput);

        this.chat_service.insertImage(this.urlInput).then((res) =>{
          console.log(res);
          this.chatForm.reset();

          this.onListChat();

        }).catch((err) =>{
          alert(err.message);
        });
        // Aquí puedes agregar la lógica para procesar la URL
        this.closeUrlPopup();
      }
}
