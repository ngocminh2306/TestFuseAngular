import { Component, OnInit } from '@angular/core';
import { LinkService } from 'app/main/apps/e-commerce/link/link.service';
@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent implements OnInit {
  deparment: any;
  jobTitle: any;
  employee: any;
  constructor(private linkService: LinkService) { 
    this.linkService.loadDepartment().pipe().subscribe(data =>{
      this.deparment = data;
    })
    this.linkService.loadJobTitles().pipe().subscribe(data =>{
      this.jobTitle = data;
    })
    this.linkService.loadEmployee().subscribe(data =>{
      this.employee = data;
    })
  }

  ngOnInit() {
  }

}
