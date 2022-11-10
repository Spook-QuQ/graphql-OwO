import { GraphQLObjectType } from 'graphql';
import { SupportedTypes } from './objectTypeDetector.js';
export declare type Field = SupportedTypes | SupportedTypes[] | {
    [keyname: string]: Field | Field[];
};
declare const createType: (name: string, data: Field | Field[], description: string | undefined, option: {
    matchWithTypeName?: boolean;
    nonNull?: boolean;
    idTypeOff?: boolean;
}) => GraphQLObjectType<any, any>;
export default createType;
