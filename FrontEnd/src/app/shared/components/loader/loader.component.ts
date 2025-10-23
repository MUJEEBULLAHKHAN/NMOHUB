import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  classname: string='';
  constructor(){
    if(localStorage.getItem('Loader') == 'enable'){
      setTimeout(() => {
        document.querySelector('#loader')?.classList.add('d-none');
      }, 2000);
  }
}

  ngOnInit(): void {
    
  }
 
}