import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, shareReplay } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IProject } from "../shared/interfaces/project.interface";
import { handleError } from "../shared/utility/error";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private employeeUrl = environment.employeeUrl;

  projects$ = this.http
    .get<IProject[]>(`${this.employeeUrl}/projects`)
    .pipe(shareReplay(1), catchError(handleError));

  constructor(private http: HttpClient) {}
}
