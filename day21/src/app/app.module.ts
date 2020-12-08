import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormComponent } from './components/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BirthdaySvc } from './components/bday.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { RsvpComponent } from './components/rsvp.component';

const ROUTES: Routes = [
  { path : "", component: FormComponent},
  { path : "rsvp", component: RsvpComponent},
  { path : "**", redirectTo: "/", pathMatch: "full" }
]
@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    RsvpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [BirthdaySvc],
  bootstrap: [AppComponent]
})
export class AppModule { }
