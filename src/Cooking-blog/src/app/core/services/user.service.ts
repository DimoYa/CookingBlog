import { Injectable } from '@angular/core';
import { Auth, deleteUser } from '@angular/fire/auth';
import { Firestore, doc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { from, Observable } from 'rxjs';
import UserModel from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private toastr: ToastrService,
  ) { }

  updateUser$(usrModel: UserModel, id: string): Observable<UserModel> {
    const { _id, _kmd, ...data } = usrModel as any;
    return from(
      updateDoc(doc(this.firestore, 'users', id), data)
        .then(() => {
          this.toastr.success('User updated successfully');
          return { ...data, _id: id } as UserModel;
        })
    );
  }

  deleteUser$(id: string): Observable<void> {
    return from(
      deleteDoc(doc(this.firestore, 'users', id))
        .then(async () => {
          const currentUser = this.auth.currentUser;
          if (currentUser && currentUser.uid === id) {
            await deleteUser(currentUser);
          }
          this.toastr.success('User deleted successfully');
        })
    );
  }

  getUser$(profileId: string): Observable<UserModel> {
    return from(
      getDoc(doc(this.firestore, 'users', profileId))
        .then(snap => {
          const data = snap.data() as any;
          return {
            ...data,
            _id: snap.id,
            _kmd: {
              status: data?.disabled ? 'disabled' : undefined,
              roles: data?.isAdmin ? [{ role: 'admin' }] : undefined,
            },
          } as UserModel;
        })
    );
  }
}