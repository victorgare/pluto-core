import { IBaseRepository } from "../interfaces/IBaseRepository";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { injectable } from "inversify";

@injectable()
export class BaseRepository implements IBaseRepository {
  protected readonly _app: firebase.app.App;
  protected readonly _firestore: firebase.firestore.Firestore;
  protected readonly _collection: firebase.firestore.CollectionReference;
  /**
   *
   */
  constructor() {
    var firebaseConfig = {
      apiKey: process.env.APPSETTING_FIREBASE_APIKEY,
      authDomain: process.env.APPSETTING_FIREBASE_AUTHDOMAIN,
      databaseURL: process.env.APPSETTING_FIREBASE_DATABASEURL,
      projectId: process.env.APPSETTING_FIREBASE_PROJECTID,
      storageBucket: process.env.APPSETTING_FIREBASE_STORAGEBUCKET,
      messagingSenderId: process.env.APPSETTING_FIREBASE_MESSAGINGSENDERID,
      appId: process.env.APPSETTING_FIREBASE_APPID,
      measurementId: process.env.APPSETTING_FIREBASE_MEASUREMENTID
    };

    if (!firebase.apps.length) {
      this._app = firebase.initializeApp(firebaseConfig);
    } else {
      this._app = firebase.apps[0];
    }

    this._firestore = this._app.firestore();
    this._collection = this._firestore.collection("pluto");
  }
}
