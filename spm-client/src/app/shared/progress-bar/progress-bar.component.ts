import {
  Component,
  Input,
  OnInit,
  ElementRef,
  AfterViewInit,
} from "@angular/core";

@Component({
  selector: "app-progress-bar",
  templateUrl: "./progress-bar.component.html",
  styleUrls: ["./progress-bar.component.scss"],
})
export class ProgressBarComponent implements OnInit, AfterViewInit {
  @Input() value: string;
  @Input() text: string;
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const degree: number = +this.value ? (+this.value / 100) * 180 : 0;
    console.log(degree);
    // .mask.full,.circle .fill
    const progressBar: HTMLElement = this.elementRef.nativeElement;
    const nodes = progressBar.querySelectorAll(".value");
    for (let index = 0; index < nodes.length; index++) {
      const element = nodes[index] as HTMLElement;
      element.style.transform = `rotate(${degree}deg)`;
    }
  }
}
