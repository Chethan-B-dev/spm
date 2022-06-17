import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, shareReplay } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { IProject } from "../shared/interfaces/project.interface";
import { handleError } from "../shared/utility/error";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  private employeeUrl = "http://localhost:8080/api/employee";

  projects$: Observable<IProject[]> = this.http
    .get<IProject[]>(`${this.employeeUrl}/projects`)
    .pipe(shareReplay(1), catchError(handleError));

  constructor(private authService: AuthService, private http: HttpClient) {}
}
