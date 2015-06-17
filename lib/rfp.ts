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
