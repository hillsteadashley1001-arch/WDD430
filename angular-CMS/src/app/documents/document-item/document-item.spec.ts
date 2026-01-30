import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DocumentItemComponent } from "./document-item";

describe("DocumentItemComponent", () => {
  let component: DocumentItemComponent;
  let fixture: ComponentFixture<DocumentItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentItemComponent],
  })
  .compileComponents();

  fixture = TestBed.createComponent(DocumentItemComponent);
  component = fixture.componentInstance;
  await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});