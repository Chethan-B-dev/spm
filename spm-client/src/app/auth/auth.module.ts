import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../shared/material/material.module";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [RouterModule, CommonModule, MaterialModule, ReactiveFormsModule],
  exports: [LoginComponent, SignupComponent],
})
export class AuthModule {}
