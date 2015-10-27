import * as m from './model';
export declare function stringify(services: m.Services<any>): string;
export declare function jsonify(services: m.Services<any>): any;
export declare function parse(serviceString: string): m.Services<any>;
export declare function dejsonify(jsonified: any): m.Services<any>;
