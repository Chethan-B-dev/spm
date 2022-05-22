import { Directive, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appSpacing]",
})
export class SpacingDirective implements OnInit {
  @Input() margin: string;
  @Input() padding: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {}
}
