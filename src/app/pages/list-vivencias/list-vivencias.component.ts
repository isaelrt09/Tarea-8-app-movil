import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Vivencia } from 'src/app/interfaces/vivencia';
import { CrudService } from 'src/app/services/crud-storage.service';

@Component({
  selector: 'app-list-vivencias',
  templateUrl: './list-vivencias.component.html',
  styleUrls: ['./list-vivencias.component.scss'],
  providers: [CrudService]
})
export class ListVivenciasComponent  implements OnInit {

  @Input() listOfVivencias!: Vivencia[];

  handlerMessage: string = '';
  roleMessage: string = '';
  confirm: string | undefined;

  constructor(
    private _crudStorage: CrudService,
    private alertController: AlertController
    ) {
  }

  ngOnInit() {
  }

  play(audio: string, type: string) {
    const audioRef = new Audio(`data:${type};base64,${audio}`)
    audioRef.oncanplaythrough = () => audioRef.play()
    audioRef.load()
  }

  convertPhotoFromBase64(base: string): string {
    return `data:png;base64,${base}`;
  }

  clearData() {
    this.presentAlert().then(rs => {
      if(this.confirm !== "confirm"){
        console.log("confirm", this.confirm);
        return;
      }
      this._crudStorage.delete().then(_data => {
        this.listOfVivencias = [];
      });
    });

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: "Seguro que desea eliminar las vivencias?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = 'Alert canceled';
          },
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.handlerMessage = 'Alert confirmed';
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    this.confirm = role;
    this.roleMessage = `Dismissed with role: ${role}`;
  }

}
