declare module 'uservice/src/rfp' {
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

}
declare module 'uservice/src/spec' {
	import { Observable } from 'uservice/src/rfp';
	export type Type = string | ArrayType | ObjectType;
	export interface ArrayType {
	    type: Type;
	}
	export interface Types {
	    [name: string]: Type;
	}
	export interface ObjectType {
	    types: Types;
	}
	export interface Parameter {
	    name: string;
	    type: Type;
	}
	export interface Method {
	    parameters: Parameter[];
	    returnType: Type;
	    cardinality: number;
	}
	export interface Methods {
	    [name: string]: Method;
	}
	export interface Spec<T> {
	    name: string;
	    methods: Methods;
	}
	export interface Specs {
	    [name: string]: Spec<any>;
	}
	export type Action = (...args: any[]) => void;
	export type Function = (...args: any[]) => Promise<any>;
	export type Event = (...args: any[]) => Observable<any>;
	export function visitor(onMethod: (name: string, method: Method) => void): (spec: Spec<any>) => void;

}
declare module 'uservice/src/specGenerator' {
	import * as s from 'typescript-schema';
	import { Spec } from 'uservice/src/spec';
	export function generateSpec(moduleSchema: s.ModuleSchema, interfaceSchema: s.InterfaceSchema): Spec<any>;

}
declare module 'uservice/src/split' {
	import { Spec, Action, Function, Event, Method, Methods } from 'uservice/src/spec';
	export interface Actions {
	    [name: string]: Action;
	}
	export interface Functions {
	    [name: string]: Function;
	}
	export interface Events {
	    [name: string]: Event;
	}
	export interface SplitService {
	    actions: Actions;
	    functions: Functions;
	    events: Events;
	    visit(onAction: (name: string, action: Action) => void, onFunction: (name: string, func: Function) => void, onEvent: (name: string, event: Event) => void): void;
	}
	export interface SplitSpec {
	    actions: Methods;
	    functions: Methods;
	    events: Methods;
	    visit(onAction: (name: string, action: Method) => void, onFunction: (name: string, func: Method) => void, onEvent: (name: string, event: Method) => void): void;
	}
	export function splitSpec(spec: Spec<any>): SplitSpec;
	export function splitService<T>(spec: Spec<T>, service: T): SplitService;

}
declare module 'uservice' {
	export * from 'uservice/src/rfp';
	export * from 'uservice/src/spec';
	export * from 'uservice/src/specGenerator';
	export * from 'uservice/src/split';

}
