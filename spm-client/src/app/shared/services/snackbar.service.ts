import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";

@Injectable({
  providedIn: "root",
})
export class SnackbarService {
  constructor(private readonly snackBar: MatSnackBar) {}

  showSnackBar(message: string, duration?: number): void {
    this.snackBar.open(message || "An unknown error occurred", "Close", {
      duration: duration || 3000,
    });
  }
}
