import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Rsvp } from './models';

@Injectable()
export class BirthdaySvc{


//config
POST_TO_SERVER: string = "http://localhost:3000/api/rsvp"
GET_FROM_SERVER: string = "http://localhost:3000/api/rsvps"


//need to set headers for content-type json as we want to retrieve in json
// httpOptions = {
//     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
//   };
headers = (new HttpHeaders()).set('Content-Type', 'application/json')

constructor(private http: HttpClient){}    


async addRsvp(rsvp: Rsvp): Promise<any>{
    
    return await this.http.post<any>(this.POST_TO_SERVER, rsvp, {headers: this.headers}).toPromise()
        .catch((err: HttpErrorResponse) => {
            console.error("Error from addRsvp ", err)
        })
    }

async getAllRsvps(): Promise<Rsvp[]> {
    return await this.http.get<any>(this.GET_FROM_SERVER).toPromise()
        .catch((err: HttpErrorResponse) => {
            console.error("Error from getRsvp ", err)
        })
    } 



/* getAllRsvps(): Observable<Rsvp[]> {
    return this.http.get<Rsvp[]>(this.POST_TO_SERVER)
        .pipe(
        tap(_ => console.log('fetched rsvps')),
        catchError(this.handleError<Rsvp[]>('getAllRsvps', []))
        );
    }

addRsvp(rsvp: Rsvp): Observable<Rsvp> {
    console.log(this.POST_TO_SERVER)
    return this.http.post<Rsvp>(this.POST_TO_SERVER, rsvp, this.httpOptions).pipe(
        tap((newRsvp: Rsvp) => console.log(`added rsvp`)),
        catchError(this.handleError<Rsvp>('addRsvp'))
);
} 

private handleError<T>(operation = 'operation', result?: T) {
return (error: any): Observable<T> => {
    console.error(error); // log to console instead
    return of(result as T);
};
}*/
}