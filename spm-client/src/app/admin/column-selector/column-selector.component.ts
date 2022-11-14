import { JsonPipe } from "@angular/common";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Inject,
} from "@angular/core";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BehaviorSubject, Subject } from "rxjs";
import { AdminColumns, ColumnData, Field } from "../admin.constants";

@Component({
  selector: "app-column-selector",
  templateUrl: "./column-selector.component.html",
  styleUrls: ["./column-selector.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnSelectorComponent implements OnInit, OnDestroy {
  availableFieldChanges: string[] = [];
  visibleFieldChanges: string[] = [];

  private readonly availableFieldsSubject = new BehaviorSubject<string[]>([]);
  readonly availableFields$ = this.availableFieldsSubject.asObservable();

  private readonly visibleFieldsSubject = new BehaviorSubject<string[]>([]);
  readonly visibleFields$ = this.visibleFieldsSubject.asObservable();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialogRef: MatDialogRef<ColumnSelectorComponent>
  ) {}

  ngOnInit(): void {
    this.setFields();
  }

  setFields() {
    const availableFields = JSON.parse(localStorage.getItem("availableFields"));
    const visibleFields = JSON.parse(localStorage.getItem("visibleFields"));
    if (!availableFields || !visibleFields) {
      this.setDefaultFields();
      return;
    }
    this.availableFieldsSubject.next(availableFields);
    this.visibleFieldsSubject.next(visibleFields);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.availableFieldsSubject.complete();
    this.visibleFieldsSubject.complete();
  }

  searchAvailableFields(searchTerm: string) {
    console.log(searchTerm);
  }

  searchVisibleFields(searchTerm: string) {
    console.log(searchTerm);
  }

  onRight() {
    if (!this.availableFieldChanges.length) {
      return;
    }
    const visibleFields = this.visibleFieldsSubject.getValue();
    this.visibleFieldsSubject.next([
      ...visibleFields,
      ...this.availableFieldChanges,
    ]);
    const availableFields = this.availableFieldsSubject.getValue();
    this.availableFieldsSubject.next(
      availableFields.filter(
        (field) => !this.availableFieldChanges.includes(field)
      )
    );
    this.availableFieldChanges = [];
    this.visibleFieldChanges = [];
  }

  onLeft() {
    if (!this.visibleFieldChanges.length) {
      return;
    }
    const availableFields = this.availableFieldsSubject.getValue();
    this.availableFieldsSubject.next([
      ...availableFields,
      ...this.visibleFieldChanges,
    ]);
    const visibleFields = this.visibleFieldsSubject.getValue();
    this.visibleFieldsSubject.next(
      visibleFields.filter((field) => !this.visibleFieldChanges.includes(field))
    );
    this.availableFieldChanges = [];
    this.visibleFieldChanges = [];
  }

  onApply() {
    this.saveState();
    this.close(this.visibleFieldsSubject.getValue());
  }

  onSelect(fields: string[], fieldType: Field) {
    if (fieldType === Field.AVAILABLE) {
      this.availableFieldChanges = fields;
    } else {
      this.visibleFieldChanges = fields;
    }
  }

  close(fields?: string[]): void {
    this.saveState();
    this.dialogRef.close(fields || null);
  }

  setDefaultFields() {
    this.availableFieldsSubject.next(
      AdminColumns.filter((field) => field.fieldType === Field.AVAILABLE).map(
        (field) => field.name
      )
    );
    this.visibleFieldsSubject.next(
      AdminColumns.filter((field) => field.fieldType === Field.VISIBLE).map(
        (field) => field.name
      )
    );
  }

  private saveState() {
    try {
      localStorage.removeItem("availableFields");
      localStorage.removeItem("visibleFields");
    } catch (error) {
      console.log("got errr");
      console.error(error);
    }
    localStorage.setItem(
      "availableFields",
      JSON.stringify(this.availableFieldsSubject.getValue())
    );
    localStorage.setItem(
      "visibleFields",
      JSON.stringify(this.visibleFieldsSubject.getValue())
    );
  }
}
