import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BirthdaySvc } from './bday.service';
import { Rsvp } from './models';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  rsvpForm:FormGroup
  POST_TO_SERVER: string = "http://localhost:3000/api/rsvp"
  constructor(private fb: FormBuilder, private http: HttpClient, private bdaySvc: BirthdaySvc,
    private router: Router) { }
  
  ngOnInit(): void {
    this.rsvpForm = this.createForm()
  }


  createForm() {
    return this.fb.group({
      name: this.fb.control(''),
      email: this.fb.control(''),
      phone: this.fb.control(''),
      attending: this.fb.control('')
    })
  }

  async sendToServer(){
    console.log("form vals", this.rsvpForm.value)
    // this.bdaySvc.addRsvp(this.rsvpForm.value as Rsvp).subscribe(rsvp => {
    //   console.log(rsvp);
    //   this.router.navigate(['/addRsvp']);
    // });
    await this.bdaySvc.addRsvp(this.rsvpForm.value as Rsvp)
    this.router.navigate(['/rsvp']);
  }
}
