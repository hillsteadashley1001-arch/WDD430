import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  standalone: true
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;  // Toggle .open class
  
  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;  // Click → toggle
  }
}
