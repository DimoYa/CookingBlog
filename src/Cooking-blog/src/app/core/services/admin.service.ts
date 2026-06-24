import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { from, Observable } from 'rxjs';
import UserModel from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private firestore: Firestore,
    private toastr: ToastrService,
  ) { }

  getAllUsers$(): Observable<UserModel[]> {
    return from(
      getDocs(collection(this.firestore, 'users'))
        .then(snap => snap.docs.map(d => this.mapUser(d.id, d.data())))
    );
  }

  suspendUser$(id: string): Observable<UserModel> {
    return from(
      updateDoc(doc(this.firestore, 'users', id), { disabled: true })
        .then(async () => {
          this.toastr.success('User disabled successfully');
          const snap = await getDoc(doc(this.firestore, 'users', id));
          return this.mapUser(snap.id, snap.data());
        })
    );
  }

  restoreUser$(id: string): Observable<UserModel> {
    return from(
      updateDoc(doc(this.firestore, 'users', id), { disabled: false })
        .then(async () => {
          this.toastr.success('User enabled successfully');
          const snap = await getDoc(doc(this.firestore, 'users', id));
          return this.mapUser(snap.id, snap.data());
        })
    );
  }

  private mapUser(uid: string, data: any): UserModel {
    return {
      ...data,
      _id: uid,
      _kmd: {
        status: data?.disabled ? 'disabled' : undefined,
        roles: data?.isAdmin ? [{ role: 'admin' }] : undefined,
      },
    } as UserModel;
  }
}
