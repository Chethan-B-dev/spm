import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatSelectionList } from "@angular/material";

import { MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject, Subject } from "rxjs";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { AdminColumns, Field } from "../admin.constants";

@Component({
  selector: "app-column-selector",
  templateUrl: "./column-selector.component.html",
  styleUrls: ["./column-selector.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnSelectorComponent implements OnInit, OnDestroy {
  availableFieldChanges: string[] = [];
  visibleFieldChanges: string[] = [];

  @ViewChild("availableList", { static: false })
  availableList: MatSelectionList;

  @ViewChild("visibleList", { static: false })
  visibleList: MatSelectionList;

  private readonly availableFieldsSubject = new BehaviorSubject<string[]>([]);
  readonly availableFields$ = this.availableFieldsSubject.asObservable();

  private readonly visibleFieldsSubject = new BehaviorSubject<string[]>([]);
  readonly visibleFields$ = this.visibleFieldsSubject.asObservable();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly dialogRef: MatDialogRef<ColumnSelectorComponent>,
    private readonly snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.setFields();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.availableFieldsSubject.complete();
    this.visibleFieldsSubject.complete();
  }

  searchAvailableFields(searchTerm: string): void {
    console.log(searchTerm);
  }

  searchVisibleFields(searchTerm: string): void {
    console.log(searchTerm);
  }

  onFirst(): void {
    // if no field changes do not do anything
    if (!this.visibleFieldChanges.length) {
      return;
    }

    // if multiple fields selected do nothing with message
    if (this.visibleFieldChanges.length > 1) {
      this.snackBarService.showSnackBar("Cannot move multiple fields");
      return;
    }

    const selectedField = this.visibleFieldChanges[0];
    const visibleFields = this.visibleFieldsSubject.getValue();

    // if selectedField is already on top do not do anything
    if (selectedField === visibleFields[0]) {
      return;
    }

    const visibleFieldsWithoutSelection = visibleFields.filter(
      (field) => field !== selectedField
    );

    this.visibleFieldsSubject.next([
      selectedField,
      ...visibleFieldsWithoutSelection,
    ]);
  }

  onLast(): void {
    // if no field changes do not do anything
    if (!this.visibleFieldChanges.length) {
      return;
    }

    // if multiple fields selected do nothing with message
    if (this.visibleFieldChanges.length > 1) {
      this.snackBarService.showSnackBar("Cannot move multiple fields");
      return;
    }

    const selectedField = this.visibleFieldChanges[0];
    const visibleFields = this.visibleFieldsSubject.getValue();

    // if selectedField is already on last do not do anything
    if (selectedField === visibleFields[visibleFields.length - 1]) {
      return;
    }

    const visibleFieldsWithoutSelection = visibleFields.filter(
      (field) => field !== selectedField
    );

    this.visibleFieldsSubject.next([
      ...visibleFieldsWithoutSelection,
      selectedField,
    ]);
  }

  onUp(): void {
    // if no field changes do not do anything
    if (!this.visibleFieldChanges.length) {
      return;
    }

    // if multiple fields selected do nothing with message
    if (this.visibleFieldChanges.length > 1) {
      this.snackBarService.showSnackBar("Cannot move multiple fields");
      return;
    }

    const selectedField = this.visibleFieldChanges[0];
    const visibleFields = this.visibleFieldsSubject.getValue();

    // if selectedField is already on top do not do anything
    if (selectedField === visibleFields[0]) {
      return;
    }

    const selectedFieldIndex = visibleFields.indexOf(selectedField);

    const aboveFieldIndex = selectedFieldIndex - 1;

    const aboveFields = visibleFields.slice(0, aboveFieldIndex);
    const belowFields = visibleFields.slice(
      selectedFieldIndex + 1,
      visibleFields.length
    );

    this.visibleFieldsSubject.next([
      ...aboveFields,
      selectedField,
      visibleFields[aboveFieldIndex],
      ...belowFields,
    ]);
  }

  onDown(): void {
    // if no field changes do not do anything
    if (!this.visibleFieldChanges.length) {
      return;
    }

    // if multiple fields selected do nothing with message
    if (this.visibleFieldChanges.length > 1) {
      this.snackBarService.showSnackBar("Cannot move multiple fields");
      return;
    }

    const selectedField = this.visibleFieldChanges[0];
    const visibleFields = this.visibleFieldsSubject.getValue();

    // if selectedField is already on last do not do anything
    if (selectedField === visibleFields[visibleFields.length - 1]) {
      return;
    }

    const selectedFieldIndex = visibleFields.indexOf(selectedField);

    const belowFieldIndex = selectedFieldIndex + 1;

    const aboveFields = visibleFields.slice(0, selectedFieldIndex);
    const belowFields = visibleFields.slice(
      belowFieldIndex + 1,
      visibleFields.length
    );

    this.visibleFieldsSubject.next([
      ...aboveFields,
      visibleFields[belowFieldIndex],
      selectedField,
      ...belowFields,
    ]);
  }

  onRight(): void {
    if (!this.availableFieldChanges.length) {
      return;
    }

    const visibleFields = this.visibleFieldsSubject.getValue();
    this.visibleFieldsSubject.next([
      ...visibleFields,
      ...this.availableFieldChanges,
    ]);

    const availableChangesSet = new Set(this.availableFieldChanges);
    const availableFields = this.availableFieldsSubject.getValue();
    this.availableFieldsSubject.next(
      availableFields.filter((field) => !availableChangesSet.has(field))
    );

    this.discardColumnChanges();
  }

  onLeft(): void {
    if (!this.visibleFieldChanges.length) {
      return;
    }

    const visibleFields = this.visibleFieldsSubject.getValue();
    if (visibleFields.length === this.visibleFieldChanges.length) {
      this.snackBarService.showSnackBar(
        "At least one column should be visible",
        2000
      );
      return;
    }

    const availableFields = this.availableFieldsSubject.getValue();
    this.availableFieldsSubject.next([
      ...availableFields,
      ...this.visibleFieldChanges,
    ]);

    const visibleChangesSet = new Set(this.visibleFieldChanges);
    this.visibleFieldsSubject.next(
      visibleFields.filter((field) => !visibleChangesSet.has(field))
    );

    this.discardColumnChanges();
  }

  onApply(): void {
    this.saveState();
    this.close(this.visibleFieldsSubject.getValue());
  }

  onSelect(fields: string[], fieldType: Field): void {
    if (fieldType === Field.AVAILABLE) {
      this.availableFieldChanges = fields;
    } else {
      this.visibleFieldChanges = fields;
    }
  }

  close(fields?: string[]): void {
    this.dialogRef.close(fields || null);
  }

  setDefaultFields(): void {
    const availableDefaultFields: string[] = [];
    const visibleDefaultFields: string[] = [];

    AdminColumns.forEach((column) => {
      if (column.fieldType === Field.AVAILABLE) {
        availableDefaultFields.push(column.name);
      } else if (column.fieldType === Field.VISIBLE) {
        visibleDefaultFields.push(column.name);
      }
    });

    this.availableFieldsSubject.next(availableDefaultFields);
    this.visibleFieldsSubject.next(visibleDefaultFields);
    this.discardColumnChanges();
  }

  private setFields(): void {
    const availableFields = JSON.parse(localStorage.getItem("availableFields"));
    const visibleFields = JSON.parse(localStorage.getItem("visibleFields"));
    if (!availableFields || !visibleFields) {
      this.setDefaultFields();
      return;
    }
    this.availableFieldsSubject.next(availableFields);
    this.visibleFieldsSubject.next(visibleFields);
  }

  private discardColumnChanges(): void {
    if (this.availableList && this.visibleList) {
      this.availableList.selectedOptions.clear();
      this.visibleList.selectedOptions.clear();
      this.availableFieldChanges = [];
      this.visibleFieldChanges = [];
    }
  }

  private saveState(): void {
    localStorage.removeItem("availableFields");
    localStorage.removeItem("visibleFields");
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
