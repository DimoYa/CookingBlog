import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Favorite {
  _id?: string;
  userId: string;
  articleId: string;
  createdAt?: any;
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private readonly favoritesCollection = 'favorites';

  constructor(private firestore: Firestore, private toastr: ToastrService) {}

  addFavorite$(userId: string, articleId: string): Observable<Favorite> {
    console.log('Adding favorite for userId:', userId, 'articleId:', articleId);
    return from(
      addDoc(collection(this.firestore, this.favoritesCollection), {
        userId,
        articleId,
        createdAt: serverTimestamp(),
      }).then((ref) => {
        console.log('Favorite added with id:', ref.id);
        this.toastr.success('Added to favorites');
        return { _id: ref.id, userId, articleId } as Favorite;
      }).catch((err) => {
        console.error('Error adding favorite:', err);
        this.toastr.error('Failed to add to favorites');
        throw err;
      })
    );
  }

  removeFavorite$(userId: string, articleId: string): Observable<void> {
    console.log('Removing favorite for userId:', userId, 'articleId:', articleId);
    return from(
      getDocs(
        query(
          collection(this.firestore, this.favoritesCollection),
          where('userId', '==', userId),
          where('articleId', '==', articleId)
        )
      ).then(async (snap) => {
        if (snap.docs.length > 0) {
          await deleteDoc(snap.docs[0].ref);
          console.log('Favorite removed');
          this.toastr.success('Removed from favorites');
        }
      }).catch((err) => {
        console.error('Error removing favorite:', err);
        this.toastr.error('Failed to remove from favorites');
        throw err;
      })
    );
  }

  getFavoritesByUser$(userId: string): Observable<Favorite[]> {
    console.log('Fetching favorites for userId:', userId);
    return from(
      getDocs(
        query(
          collection(this.firestore, this.favoritesCollection),
          where('userId', '==', userId)
        )
      ).then((snap) => {
        const favorites = snap.docs
          .map((d) => ({
            _id: d.id,
            ...d.data(),
          } as Favorite))
          .sort((a, b) => {
            const dateA = a.createdAt?.toMillis?.() ?? 0;
            const dateB = b.createdAt?.toMillis?.() ?? 0;
            return dateB - dateA;
          });
        console.log('Favorites fetched:', favorites);
        return favorites;
      })
    ).pipe(
      map((result) => {
        console.log('Mapped favorites:', result);
        return result;
      })
    );
  }

  isFavorited$(userId: string, articleId: string): Observable<boolean> {
    console.log('Checking if favorited - userId:', userId, 'articleId:', articleId);
    return from(
      getDocs(
        query(
          collection(this.firestore, this.favoritesCollection),
          where('userId', '==', userId),
          where('articleId', '==', articleId)
        )
      ).then((snap) => {
        const isFav = snap.docs.length > 0;
        console.log('Is favorited:', isFav);
        return isFav;
      }).catch((err) => {
        console.error('Error checking favorite status:', err);
        return false;
      })
    );
  }

  removeFavoriteByArticleId$(articleId: string): Observable<void> {
    console.log('Removing favorites for articleId:', articleId);
    return from(
      getDocs(
        query(
          collection(this.firestore, this.favoritesCollection),
          where('articleId', '==', articleId)
        )
      ).then(async (snap) => {
        await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
        console.log('Favorites for article removed:', articleId);
      }).catch((err) => {
        console.error('Error removing favorites by articleId:', err);
      })
    );
  }
}
