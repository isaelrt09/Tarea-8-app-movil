import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Vivencia } from 'src/app/interfaces/vivencia';
import { CrudService } from 'src/app/services/crud-storage.service';
import { ImageService } from 'src/app/services/photo.service';
import { VoiceRecorder, VoiceRecorderPlugin, RecordingData, GenericResponse, CurrentRecordingStatus } from 'capacitor-voice-recorder';
import { AlertController, IonButton, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-form-vivencias',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent  implements OnInit {

  data: Vivencia[] = [];
  image: string = "";
  textGrabar: string = "Grabar Audio"
  private audio: string = "";
  private type: string = "";

  constructor(
    private _crudService: CrudService,
    private _photoService: ImageService,
    private alertController: AlertController,
    private toastController: ToastController
    ) { }

  ngOnInit() {
    this.getVivencias();
  }

  getVivencias() {
    this._crudService.getAll().then(data => {
      this.data = data;
      console.log("data", this.data);
    });
  }

  async saveVivencia(form: NgForm){
    if(!form.value.titulo || !form.value.descripcion || !form.value.fecha) {
      await this.showAlert("Debe completar todos los campos!");
      return;
    };

    form.value.audio = this.audio;
    form.value.type = this.type;
    form.value.image = this._photoService.imageUrl;
    this._crudService.saveIdentity(form.value).then(rs => {
      this.presentToast("Agregado con Exito!", 'top')
      form.reset();
      this.image = "";
      this.getVivencias();
    });
  }

  recordAudio(button: IonButton) {
    VoiceRecorder.canDeviceVoiceRecord()
      .then((result: GenericResponse) => {
        if (result.value) {
          VoiceRecorder.requestAudioRecordingPermission()
            .then((result: GenericResponse) => {
              if (result.value) {
                VoiceRecorder.hasAudioRecordingPermission().then((result: GenericResponse) => {
                    if (result.value) {
                      VoiceRecorder.startRecording()
                        .then((result: GenericResponse) => {
                          console.log(result.value);
                          this.textGrabar = "Grabando...."
                          button.disabled = true;
                        })
                        .catch(error => console.log(error))
                    }
                  })
              }
            })
        }
    });
  }

  stopRecording(button: IonButton) {
    VoiceRecorder.stopRecording()
      .then((result: RecordingData) => {
        this.textGrabar = "Grabar Audio"
        button.disabled = false;
        this.audio = result.value.recordDataBase64;
        this.type = result.value.mimeType;
      })
      .catch(error => console.log(error))
  }

  addPhotoToGallery() {
    this._photoService.takePicture()
      .then(rs => {
        this.image = `data:png;base64,${this._photoService.imageUrl}`;
      })
  }

  async showAlert(message: string){
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentToast(message: string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position
    });

    await toast.present();
  }

  clearImage(){
    this.image = "";
  }

}
