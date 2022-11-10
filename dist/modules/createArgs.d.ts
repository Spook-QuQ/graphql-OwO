import { GraphQLInputObjectType, GraphQLNonNull, GraphQLList, GraphQLScalarType } from 'graphql';
declare type ArgumentType = GraphQLInputObjectType | GraphQLList<GraphQLInputObjectType> | GraphQLNonNull<GraphQLList<GraphQLInputObjectType>> | GraphQLNonNull<GraphQLInputObjectType> | (GraphQLScalarType<string, string> | GraphQLScalarType<number, number> | GraphQLScalarType<boolean, boolean>) | GraphQLNonNull<(GraphQLScalarType<string, string> | GraphQLScalarType<number, number> | GraphQLScalarType<boolean, boolean>) | GraphQLList<GraphQLScalarType<string, string> | GraphQLScalarType<number, number> | GraphQLScalarType<boolean, boolean>>>;
export declare type ArgumentsType = {
    [x: string]: {
        type: ArgumentType;
    };
};
declare const createArgs: (args: {
    [x: string]: any;
} | undefined) => ArgumentsType;
export default createArgs;
