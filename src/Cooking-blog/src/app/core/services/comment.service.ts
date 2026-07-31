import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { from, Observable } from 'rxjs';
import CommentModel from '../models/comment-model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(
    private firestore: Firestore,
    private toastr: ToastrService
  ) { }

  private readonly commentCollection = 'comments';

  private mapComment(id: string, data: any): CommentModel {
    return {
      ...data,
      _id: id,
      likes: data?.likes ?? [],
      _kmd: {
        ect:
          data?.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data?.createdAt,
        lmt:
          data?.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate().toISOString()
            : data?.updatedAt,
      },
    } as CommentModel;
  }

  getAllComments$(): Observable<CommentModel[]> {
    return from(
      getDocs(collection(this.firestore, this.commentCollection)).then((snap) =>
        snap.docs.map((d) => this.mapComment(d.id, d.data()))
      )
    );
  }

  getAllCommentsByArticle$(articleId: string): Observable<CommentModel[]> {
    return from(
      getDocs(
        query(
          collection(this.firestore, this.commentCollection),
          where('articleId', '==', articleId)
        )
      ).then((snap) =>
        snap.docs
          .map((d) => this.mapComment(d.id, d.data()))
          .sort((a, b) =>
            (b._kmd?.ect ?? '') > (a._kmd?.ect ?? '') ? 1 : -1
          )
      )
    );
  }

  addComment$(body: CommentModel): Observable<CommentModel> {
    const { _id, _kmd, ...data } = body as any;

    return from(
      addDoc(collection(this.firestore, this.commentCollection), {
        ...data,
        likes: data.likes ?? [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).then((ref) => {
        this.toastr.success('Comment created successfully');
        return { ...data, _id: ref.id, likes: data.likes ?? [] } as CommentModel;
      })
    );
  }

  deleteComment$(id: string): Observable<CommentModel> {
    return from(
      deleteDoc(doc(this.firestore, this.commentCollection, id)).then(() => {
        this.toastr.error('Comment deleted successfully');
        return { _id: id } as CommentModel;
      })
    );
  }

  deleteAllCommentsByArticle$(articleId: string): Observable<CommentModel[]> {
    return from(
      getDocs(
        query(
          collection(this.firestore, this.commentCollection),
          where('articleId', '==', articleId)
        )
      ).then(async (snap) => {
        await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
        return [] as CommentModel[];
      })
    );
  }

  getCommentById$(id: string): Observable<CommentModel> {
    return from(
      getDoc(doc(this.firestore, this.commentCollection, id)).then((snap) =>
        this.mapComment(snap.id, snap.data())
      )
    );
  }

  toggleLike$(id: string, likes: string[], operation: string): Observable<CommentModel> {
    const commentRef = doc(this.firestore, this.commentCollection, id);

    return from(
      updateDoc(commentRef, { likes })
        .then(() => {
          this.toastr.success(`Comment ${operation} successfully`);
          return { _id: id, likes } as CommentModel;
        })
        .catch(err => {
          this.toastr.error(`Failed to ${operation} comment`);
          console.error('toggleLike$ failed:', { id, err });
          throw err;
        })
    );
  }

  editComment$(
    body: CommentModel,
    id: string,
    operation: string
  ): Observable<CommentModel> {
    const { _id, _kmd, createdAt, updatedAt, ...data } = body as any;

    const commentRef = doc(this.firestore, this.commentCollection, id);

    return from(
      updateDoc(commentRef, {
        ...data,
        likes: data.likes ?? [],
        updatedAt: serverTimestamp(),
      })
        .then(() => {
          this.toastr.success(`Comment ${operation} successfully`);
          return { ...data, _id: id } as CommentModel;
        })
        .catch((err) => {
          this.toastr.error(`Failed to ${operation} comment`);
          console.error('editComment$ failed:', { id, err });
          throw err;
        })
    );
  }
}