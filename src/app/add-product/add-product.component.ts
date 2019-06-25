import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";

import { ProductService } from "./../services/product.service";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.css"]
})
export class AddProductComponent implements OnInit {
  isSubmitted: boolean;
  selectedImage: any = null;

  successMsg: boolean = false;

  formTemplate = new FormGroup({
    title: new FormControl("", Validators.required),
    productImg: new FormControl("", Validators.required),
    description: new FormControl("", Validators.required)
  });

  constructor(
    private storage: AngularFireStorage,
    public productService: ProductService
  ) {}

  ngOnInit() {}

  uploadFile(event) {
    this.selectedImage = event.target.files[0];
  }

  onSubmit(formValue) {
    this.isSubmitted = true;

    if (this.formTemplate.valid) {
      const filePath = `product-img/${this.selectedImage.name
        .split(".")
        .slice(0, -1)
        .join(".")}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);

      this.storage
        .upload(filePath, this.selectedImage)
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              formValue["productImg"] = url;
              this.productService.addProduct(formValue);
              this.successMsg = true;
              this.isSubmitted = false;
              this.formTemplate.reset();
            });
          })
        )
        .subscribe();
    }
  }

  get formControls() {
    return this.formTemplate["controls"];
  }
}
