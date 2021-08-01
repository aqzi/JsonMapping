const identifiers = {
    Map: '_map_',
    Set: '_set_'
}

interface Keys {
    Map?: string[],
    Set?: string[]
}

/**
 * Convert an object with nested maps and sets to json. This function will add a _map_ identifier to the records.
 * When converting the json back to an object with nesting, that identifier is neccessary to reconstruct the original object.
 * The difference between obj2Json with noIdentifier = true and json.stringify is that the first will convert a map to an object
 * with all its props and json.stringify will do the conversion to an empty object.
 * @param obj object with nested maps/sets
 * @param noIdentifier Determines whether or not the json should have identifiers.
 * @returns json
 */
export function obj2Json(obj: object, noIdentifier?: boolean): string{
    return JSON.stringify(obj, (_, value) => (typeof value === 'object' && value !== null) ? replacer(value, noIdentifier) : value);
}

/**
 * Convert a json to an object with nested maps/sets. Conversion can be achieved in two ways.
 * 1) If the objects in the json have the _map_/_set_ identifier.
 * 2) When keysToConvert is specified. 
 * If the json structure has multiple keys with the same name and that name was specified in the keysToConvert than all those keys 
 * will be converted accordingly. If an object in the json has an identifier and the key of that object was specified in keysToConvert
 * than conversion with identifier will come first because the identifiers shouldn't be visible in the resulting object.
 * @param json json that will be converted to an object
 * @returns an object
 */
export function json2Obj(json: string, keysToConvert?: Keys) {
    return JSON.parse(json, (key: any, value: any) => reviver(key, value, keysToConvert));
}

//Replace sets and maps to an object with identifier.
function replacer(value: object, noIdentifier?: boolean): Record<string, any> | object{
    if(value instanceof Map){
        let record: Record<string, any> = Array.from(value.entries()).reduce((main, [key, value]) => ({...main, [key]: value}), {});
        if(noIdentifier !== true) record[identifiers.Map] = true;
        return record;
    } 
    
    if(value instanceof Set) {
        return noIdentifier === true ? 
            Array.from(value.values()) : {_set_: Array.from(value.values())};
    }
    
    const record: Record<string, any> = value;
    return record;
}

//Replace objects with identifier to an instance of map or set.
function reviver(key: any, value: any, keysToConvert?: Keys) {
    if(typeof value === 'object' && value !== null){
        if(identifiers.Map in value){
            return convertObj2Map(value);
        }

        if(identifiers.Set in value){
            const obj = Object.values(value);
            return convertObj2Set(obj[0]);
        }

        if(keysToConvert){
            if(keysToConvert.Map && keysToConvert.Map.find(i => i === key)){
                return convertObj2Map(value);
            }

            if(keysToConvert.Set && keysToConvert.Set.find(i => i === key)){
                return convertObj2Set(value);
            }
        }
    }

    return value;
}

function convertObj2Map(value: object){
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

function convertObj2Set(obj: unknown){
    const set = new Set();

    if(obj instanceof Array){
        Array.from(obj).forEach(item => set.add(item));
    } else {
        throw new Error('The value of key: _set_ should be an array.');
    }

    return set;
}