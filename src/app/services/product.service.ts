import { Injectable } from "@angular/core";

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Product } from "./../modules/product";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  products: Observable<Product[]>;

  productDoc: AngularFirestoreDocument<Product>;

  productsCollection: AngularFirestoreCollection<Product>;

  constructor(public afs: AngularFirestore) {
    this.productsCollection = afs.collection<Product>("products");

    // get the data and the id use the map operator.
    this.products = this.productsCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as Product;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  getProducts() {
    return this.products;
  }

  addProduct(product: Product) {
    this.productsCollection.add(product);
  }
}
