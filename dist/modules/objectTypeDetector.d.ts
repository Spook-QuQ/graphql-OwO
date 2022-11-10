import { GraphQLNonNull, GraphQLList, GraphQLScalarType } from 'graphql';
export declare type SupportedTypes = 'id' | 'string' | 'number' | 'integer' | 'int' | 'float' | 'boolean';
declare type ResultOfTypeDetector = GraphQLScalarType<string, string> | GraphQLScalarType<number, number> | GraphQLScalarType<boolean, boolean>;
declare const objectTypeDetector: (val: any, option: {
    matchWithTypeName?: boolean;
    nonNull?: boolean;
    isList?: boolean;
}) => {
    type: ResultOfTypeDetector | GraphQLNonNull<ResultOfTypeDetector | GraphQLList<ResultOfTypeDetector>>;
};
export default objectTypeDetector;
