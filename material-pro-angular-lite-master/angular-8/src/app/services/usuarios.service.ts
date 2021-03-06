import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  url:string='http://localhost:3000/api/persona';
  constructor(private http:HttpClient) { }
  public add(item):Observable<any>{
    console.log(item);
    return this.http.post(this.url,item);
  }
  public list(){
    return this.http.get(this.url);
  }
  public edit(id,item){
    return this.http.put(this.url+'/'+id,item);
  }
  public delete(id){
    return this.http.delete(this.url+'/'+id);
  }

}
