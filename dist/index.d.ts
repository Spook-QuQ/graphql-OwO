import { GraphQLSchema } from 'graphql';
import { SupportedTypes } from './modules/objectTypeDetector.js';
import { Field } from './modules/createType.js';
export declare type ArgumentsField = {
    [keyname: string]: {
        type: SupportedTypes | Array<ArgumentsField | SupportedTypes> | ArgumentsField;
        nonNull?: boolean;
    };
};
declare type Resolver<T = any> = (args: T) => any;
declare type ListResolver<T = any> = (args: T) => Array<any>;
export declare type QueryType = {
    name: string;
    idTypeOff?: boolean;
    description?: string;
    typeDescription?: string;
    fields: Field;
    args?: ArgumentsField;
    resolver: Resolver;
    list?: boolean;
    listDescription?: string;
    listArgs?: ArgumentsField;
    listResolver?: ListResolver;
};
declare type Description = {
    query: string;
    mutation: string;
};
export declare type Schema = {
    query: QueryType[];
    mutation: QueryType[];
    description: Description;
};
export default class GraphqlOwO {
    run: (_query: any, _variables: any) => Promise<any>;
    [THIS: symbol]: {
        schema: GraphQLSchema;
    };
    constructor(_schema: Schema);
}
export declare const graphiqlHTML: (url: string) => any;
export {};
