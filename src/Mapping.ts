const identifiers = {
    Map: '_map_',
    Set: '_set_'
}

/**
 * Convert an object with nested maps and sets to json. This function will add a _map_ identifier to the records.
 * When converting the json back to an object with nesting, that identifier is neccessary to reconstruct the original object.
 * @param obj object with nested maps/sets
 * @returns json
 */
export function obj2Json(obj: object): string{
    return JSON.stringify(obj, (_, value) => (typeof value === 'object' && value !== null) ? replacer(value) : value);
}

/**
 * Convert a json to an object with nested maps/sets. Conversion can only be achieved if the objects in the json
 * have the _map_/_set_ identifier.
 * @param json json that will be converted to an object
 * @returns an object
 */
export function json2Obj(json: string) {
    return JSON.parse(json, reviver);
}

//Replace sets and maps to an object with identifier.
function replacer(value: object): Record<string, any> | object{
    if(value instanceof Map){
        let record: Record<string, any> = Object.fromEntries(value);
        record[identifiers.Map] = true;
        return record;
    } else if(value instanceof Set) {
        return {_set_: Array.from(value.values())}
    } else {
        const record: Record<string, any> = value;
        return record;
    }    
}

//Replace objects with identifier to an instance of map or set.
function reviver(_: any, value: any) {
    if(typeof value === 'object' && value !== null){
        if(identifiers.Map in value){
            const map = new Map();

            Object.entries(value).forEach((item) => {
                if(item[0] === identifiers.Map){
                    if(typeof item[1] === 'boolean'){
                        if(!item[1]) map.set(item[0], item[1]);
                    } else{
                        throw new Error('The value of key: _map_ should be a boolean.')
                    }
                } else{
                    map.set(item[0], item[1]);
                }
            })

            return map;
        }

        if(identifiers.Set in value){
            const set = new Set();
            const obj = Object.values(value);

            if(obj[0] instanceof Array){
                Array.from(obj[0]).forEach(item => set.add(item));
            } else {
                throw new Error('The value of key: _set_ should be an array.');
            }

            return set;
        }
    }

    return value;
}