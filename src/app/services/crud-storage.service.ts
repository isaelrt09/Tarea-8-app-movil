import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage-angular";

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private storage: Storage) {
    this.initDb();
   }

  async initDb(){
    await this.storage.create();
  }

  async saveIdentity(data: any){
    let id = await this.storage.length() + 1;
    await this.storage.set(id.toString(), data);
  }

  async getById(id: string){
    if(!id) return;
    let data = await this.storage.get(id);
    return data;
  }

  async getAll(){
    let list: any[] = [];
    this.storage.forEach(data => {
      list.push(data);
    });
    return list;
  }

  async delete(){
    await this.storage.clear();
  }

}
