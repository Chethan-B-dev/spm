import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthInterceptor } from "./auth/auth.interceptor";
import { AuthModule } from "./auth/auth.module";
import { EmployeeModule } from "./employee/employee.module";
import { ManagerModule } from "./manager/manager.module";
import { ReportingModule } from "./reporting/reporting.module";
import { SharedModule } from "./shared/shared.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AuthModule,
    ManagerModule,
    EmployeeModule,
    ReportingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
