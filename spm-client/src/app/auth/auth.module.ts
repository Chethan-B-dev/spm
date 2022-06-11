import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../shared/material/material.module";
import { ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./auth.interceptor";
@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [RouterModule, CommonModule, MaterialModule, ReactiveFormsModule],
  exports: [LoginComponent, SignupComponent],
})
export class AuthModule {}
