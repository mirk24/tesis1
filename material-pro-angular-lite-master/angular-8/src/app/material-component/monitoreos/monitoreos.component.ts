import { Component, OnInit,Injectable } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MonitoreosService } from '../../services/monitoreos.service';
import { FormulariomonitoreosComponent } from './formulariomonitoreos/formulariomonitoreos.component';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-monitoreos',
  templateUrl: './monitoreos.component.html',
  styleUrls: ['./monitoreos.component.css']
})
export class MonitoreosComponent implements OnInit {

  constructor(private db:MonitoreosService,
    private socket: Socket,
    public dialog: MatDialog) { 

  }
  dato_m="";
  getMessage() {
    return this.socket
        .fromEvent("dataSerial").subscribe( (dataSerial:any) =>{ 
          console.log("sss");
          //console.log(data);
          
          this.dato_m=dataSerial.value;
           });
}
  displayedColumns: string[] = ['temp_actual','lectura_actual','fecha', 'borrar','editar'];
  lista=[];
  dataSource = new MatTableDataSource<any>();
  ngOnInit() {
    this.getMessage();
    this.db.list().subscribe((dato:any)=>{
      console.log("pppppp");
      if(dato.estado==1){
        
        this.lista=dato.lista;
        this.dataSource.data=this.lista;
        console.log("pppppp");
      }else{
        this.lista=this.dataSource.data=[];

      }
    })
  }
  onBorrar(item){

    
 //     const dialogRef = this.dialog.open(ConfirmarComponent, {
  //      width: '250px',
  //      data: ''
  //    });
  
  /*     dialogRef.afterClosed().subscribe(result => {
        if(result=='ok'){

          this.db.delete(item._id).subscribe((dato:any)=>{
        if(dato.estado==1){

          this.lista.splice(this.lista.indexOf(item),1);
          this.dataSource.data=this.lista;
        }else{

        }
      });
        }
      });*/
  }
  onEditar(item){
    const dialogRef = this.dialog.open(FormulariomonitoreosComponent, {
      width: '650px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      //this.lista.push(result.data);
      //this.dataSource.data=this.lista;
      console.log(this.lista);
    });
  }
  open(){
    const dialogRef = this.dialog.open(FormulariomonitoreosComponent, {
      width: '750px',
      data: {temp_actual:'',lectura_actual:'',fecha:''}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.lista.push(result.data);
      this.dataSource.data=this.lista;
      console.log(this.lista);
    });
  }


}
