import { Component, OnInit,Injectable  } from '@angular/core';
import { Chart } from 'chart.js';
import { Socket } from 'ngx-socket-io';
import { MedicionService } from '../../services/medicion.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


//import io from 'socket.io-client';

//const socket = io('http://localhost:3000');

@Component({
  selector: 'app-medicion',
  templateUrl: './medicion.component.html',
  styleUrls: ['./medicion.component.css']
})
export class MedicionComponent implements OnInit {
  constructor(private db:MedicionService,
    private socket: Socket,
    public dialog: MatDialog) { 

  }
  dato_m="";
  contador:number=0;
  getMessage() {
    return this.socket
        .fromEvent("data").subscribe( (data:any) =>{ 
          //console.log("sss1");
          //console.log(data);
          //**this.dato_m=data.value;
          try{
          let t=JSON.parse(data);
          //console.log(t);
          this.chart.data.labels.push(t.dato1);
          this.chart.data.labels.push(this.contador);
          this.chart.data.datasets.forEach(element => {
            element.data.push(t.dato1);
            //element.data.push(t.dato2);
          });
        
           this.contador=this.contador+1;
           this.chart.update();
          }catch{
            console.log("no llego");
          }
           });

          
}
title = 'dashboard';
  chart;
  //chart2 = [];
  //data1 = [];
  data=[];
ngOnInit() {
  this.getMessage();
  this.chart= new Chart('canvas',{
  type:'line',
  data: {
    labels: ['January'],
    datasets: [{
        label: 'Nivel de Combustible',
        backgroundColor: 'rgb(115, 24, 5)',
        borderColor: 'rgb(10, 4, 3)',
        data: [1,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100],
        fill: true,
    }]
},
  
  })
}
}