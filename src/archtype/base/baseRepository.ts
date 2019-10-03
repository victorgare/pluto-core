import { IBaseRepository } from "../interfaces/IBaseRepository";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { injectable } from "inversify";

@injectable()
export class BaseRepository implements IBaseRepository {
  protected readonly _app: firebase.app.App;
  protected readonly _firestore: firebase.firestore.Firestore;
  /**
   *
   */
  constructor() {
    var firebaseConfig = {
      apiKey: "AIzaSyC4IVFiJfJNToIwy0DuezU_WpC6imPKE9k",
      authDomain: "pluto-core.firebaseapp.com",
      databaseURL: "https://pluto-core.firebaseio.com",
      projectId: "pluto-core",
      storageBucket: "pluto-core.appspot.com",
      messagingSenderId: "99926566159",
      appId: "1:99926566159:web:e8021e9b68dd608a50ca7a",
      measurementId: "G-ZF9PQH5Z85"
    };

    this._app = firebase.initializeApp(firebaseConfig);
    this._firestore = this._app.firestore();
  }
}
