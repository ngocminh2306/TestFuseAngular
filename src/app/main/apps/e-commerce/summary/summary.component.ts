import { Component, OnInit } from '@angular/core';
import { LinkService } from 'app/main/apps/e-commerce/link/link.service';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  department: any;
  jobTitle: any;
  employee: any;
  constructor(private linkService: LinkService) {
    this.linkService.loadDepartment().subscribe(data =>{
      this.department = data;
    })
    this.linkService.loadJobTitles().pipe().subscribe(data =>{
      this.jobTitle = data;
    })
    this.linkService.loadEmployee().subscribe(data=>{
      this.employee = data;
    })
   }

  ngOnInit() {
  }

}
