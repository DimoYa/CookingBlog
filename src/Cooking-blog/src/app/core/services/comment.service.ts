import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, serverTimestamp, Timestamp } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { from, Observable } from 'rxjs';
import CommentModel from '../models/comment-model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(
    private firestore: Firestore,
    private toastr: ToastrService,
  ) { }

  private readonly commentCollection = 'comments';

  private mapComment(id: string, data: any): CommentModel {
    return {
      ...data,
      _id: id,
      _kmd: {
        ect: data?.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data?.createdAt,
        lmt: data?.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data?.updatedAt,
      },
    } as CommentModel;
  }

  getAllCommentsByArticle$(articleId: string): Observable<CommentModel[]> {
    return from(
      getDocs(query(
        collection(this.firestore, this.commentCollection),
        where('articleId', '==', articleId)
      )).then(snap => snap.docs
        .map(d => this.mapComment(d.id, d.data()))
        .sort((a, b) => (b._kmd?.ect ?? '') > (a._kmd?.ect ?? '') ? 1 : -1)
      )
    );
  }

  addComment$(body: CommentModel): Observable<CommentModel> {
    const { _id, _kmd, ...data } = body as any;
    return from(
      addDoc(collection(this.firestore, this.commentCollection), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).then(ref => {
        this.toastr.success('Comment created successfully');
        return { ...data, _id: ref.id } as CommentModel;
      })
    );
  }

  deleteComment$(id: string): Observable<CommentModel> {
    return from(
      deleteDoc(doc(this.firestore, this.commentCollection, id))
        .then(() => {
          this.toastr.success('Comment deleted successfully');
          return { _id: id } as CommentModel;
        })
    );
  }

  deleteAllCommentsByArticle$(articleId: string): Observable<CommentModel[]> {
    return from(
      getDocs(query(
        collection(this.firestore, this.commentCollection),
        where('articleId', '==', articleId)
      )).then(async snap => {
        await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
        return [] as CommentModel[];
      })
    );
  }

  getCommentById$(id: string): Observable<CommentModel> {
    return from(
      getDoc(doc(this.firestore, this.commentCollection, id))
        .then(snap => this.mapComment(snap.id, snap.data()))
    );
  }

  editComment$(body: CommentModel, id: string, operation: string): Observable<CommentModel> {
    const { _id, _kmd, ...data } = body as any;
    return from(
      addDoc(collection(this.firestore, this.commentCollection), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).then(ref => {
        this.toastr.success(`Comment ${operation} successfully`);
        return { ...data, _id: ref.id } as CommentModel;
      })
    );
  }
}
