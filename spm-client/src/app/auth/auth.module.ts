import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [RouterModule, ReactiveFormsModule, SharedModule],
})
export class AuthModule {}
