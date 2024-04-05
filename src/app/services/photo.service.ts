import { Injectable } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { CameraSource } from '@capacitor/camera/dist/esm/definitions';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  public imageUrl: any;
  constructor() { }

  public async takePicture(){
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
    this.imageUrl = image.base64String;
  };

}
