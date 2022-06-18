import {
  Component,
  Input,
  OnInit,
  ElementRef,
  AfterViewInit,
  Renderer2,
} from "@angular/core";

@Component({
  selector: "app-progress-bar",
  templateUrl: "./progress-bar.component.html",
  styleUrls: ["./progress-bar.component.scss"],
})
export class ProgressBarComponent implements OnInit, AfterViewInit {
  @Input() value: string;
  @Input() text: string;
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const degree = +this.value ? (+this.value / 100) * 180 : 0;
    const progressBar = this.elementRef.nativeElement as HTMLElement;
    const nodes = progressBar.querySelectorAll(".value");
    Array.from(nodes).forEach((element) =>
      this.renderer.setStyle(element, "transform", `rotate(${degree}deg)`)
    );
  }
}
