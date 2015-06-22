export interface Observer<T> {
  onNext(value: T): void;
  onError(exception: any): void;
  onCompleted(): void;
}

export interface Observable<T> {
  subscribe(observer: Observer<T>): Disposable;

  subscribeOnNext(onNext: (value: T) => void, thisArg?: any): Disposable;
  subscribeOnError(onError: (exception: any) => void, thisArg?: any): Disposable;
  subscribeOnCompleted(onCompleted: () => void, thisArg?: any): Disposable;
}

export interface Disposable {
  dispose(): void;
}

// export interface ControlledObservable<T> extends Observable<T> {
//   request(numberOfItems?: number): Disposable;
// }
//
// export interface PausableObservable<T> extends Observable<T> {
//   pause(): void;
//   resume(): void;
// }
