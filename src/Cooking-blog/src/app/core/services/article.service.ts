import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, Timestamp } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { from, Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import ArticleModel from '../models/article-model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(
    private firestore: Firestore,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
  ) { }

  private readonly articleCollection = 'articles';

  private mapArticle(id: string, data: any): ArticleModel {
    return {
      ...data,
      _id: id,
      _kmd: {
        ect: data?.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data?.createdAt,
        lmt: data?.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data?.updatedAt,
      },
    } as ArticleModel;
  }

  createArticle$(body: ArticleModel): Observable<ArticleModel> {
    const { _id, _kmd, ...data } = body as any;
    return from(
      addDoc(collection(this.firestore, this.articleCollection), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).then(ref => {
        this.toastr.success('Article created successfully');
        return { ...data, _id: ref.id } as ArticleModel;
      })
    );
  }

  getArticles$(): Observable<ArticleModel[]> {
    return from(
      getDocs(query(
        collection(this.firestore, this.articleCollection),
        orderBy('createdAt', 'desc')
      )).then(snap => snap.docs.map(d => this.mapArticle(d.id, d.data())))
    );
  }

  getArticleById$(id: string): Observable<ArticleModel> {
    return from(
      getDoc(doc(this.firestore, this.articleCollection, id))
        .then(snap => this.mapArticle(snap.id, snap.data()))
    );
  }

  getUserArticles$(): Observable<ArticleModel[]> {
    const currentUser = this.authenticationService.returnUserName();
    return from(
      getDocs(query(
        collection(this.firestore, this.articleCollection),
        where('author', '==', currentUser)
      )).then(snap => snap.docs
        .map(d => this.mapArticle(d.id, d.data()))
        .sort((a, b) => (b._kmd?.ect ?? '') > (a._kmd?.ect ?? '') ? 1 : -1)
      )
    );
  }

  deleteArticle$(id: string): Observable<ArticleModel> {
    return from(
      deleteDoc(doc(this.firestore, this.articleCollection, id))
        .then(() => {
          this.toastr.success('Article deleted successfully');
          return { _id: id } as ArticleModel;
        })
    );
  }

  editArticle$(body: ArticleModel, id: string): Observable<ArticleModel> {
    const { _id, _kmd, ...data } = body as any;
    return from(
      updateDoc(doc(this.firestore, this.articleCollection, id), {
        ...data,
        updatedAt: serverTimestamp(),
      }).then(() => {
        this.toastr.success('Article updated successfully');
        return { ...data, _id: id } as ArticleModel;
      })
    );
  }
}
