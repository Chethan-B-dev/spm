import { Directive, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appSpacing]",
})
export class SpacingDirective implements OnInit {
  @Input() margin: string;
  @Input() padding: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.setStyle(
      this.el.nativeElement,
      "padding",
      this.padding + "px"
    );
    this.renderer.setStyle(this.el.nativeElement, "margin", this.margin + "px");
    console.log(`parent is ${this.renderer.parentNode(this.el.nativeElement)}`);
    let parentDiv: ElementRef = this.renderer.parentNode(this.el.nativeElement);
    console.log(parentDiv.nativeElement);
  }
}
