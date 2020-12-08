import { Component, OnInit } from '@angular/core';
import { BirthdaySvc } from './bday.service';
import { Rsvp } from './models';

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})
export class RsvpComponent implements OnInit {
  rsvpList: Rsvp[] = []

  constructor(private bdaySvc: BirthdaySvc) { }

  ngOnInit(): void {
    //get db data
    this.bdaySvc.getAllRsvps().then(results => {
      console.log("results", results)
      this.rsvpList = results.map(r => {
        return {
          name: r['name'],
          email: r['email'],
          phone: r['phone'],
          attending: r['status']
        }
    })
  })

  }
}
