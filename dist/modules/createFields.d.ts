import { Field } from './createType.js';
declare const createFields: (data: Field | Field[], option: {
    useIDType?: boolean;
    matchWithTypeName?: boolean | undefined;
    nonNull?: boolean | undefined;
}) => {
    [x: string]: any;
};
export default createFields;
