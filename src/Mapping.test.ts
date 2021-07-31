import { json2Obj, obj2Json } from './Mapping';

test('Map conversion in json', () => {
    interface TestObject {
        value1: number,
        value2: number
    }

    interface TestObject2 {
        txt1: string,
        txt2: string,
        list: number[],
        list2: string[]
    }

    interface SubMaps {
        map1: Map<string, Map<string, string>>
        map2: Map<string, TestObject>,
        map3: Map<string, Set<string>>
    }

    interface SubMaps2 {
        map1: Record<string, Record<string, string>>
        map2: Record<number, TestObject>
    }

    interface IMap {
        txt: string,
        submaps: SubMaps
        extraTxt: TestObject2,
        set: Set<string>
    }

    const a = new Map([
        ['a', 'aa'],
        ['b', 'bb'],
        ['c', 'cc']
    ])

    const b = new Map([
        ['d', 'dd'],
        ['e', 'ee'],
        ['f', 'ff']
    ])

    const set = new Set(['hey', 'hallo', 'hoy']);
    const set2 = new Set(['bye', 'goodbye', '👋']);

    const testObj: IMap = {
        txt: 'txt1',
        submaps: {
            map1: new Map([
                ['map1.1.', a],
                ['map1.2.', a],
                ['map1.3.', b]
            ]),
            map2: new Map([
                ['1', {value1: 2, value2: 1}],
                ['2', {value1: 2, value2: 2}],
                ['3', {value1: 2, value2: 3}]
            ]),
            map3: new Map([
                ['s1', set],
                ['s2', set2]
            ])
        },
        extraTxt: {
            txt1: 'hello',
            txt2: 'world',
            list: [1,2,3,4,5,6],
            list2: ['t', 'j'],
        },
        set: new Set(['a', 'b', 'c'])
    }

    const record = {
        "txt":"txt1",
        "submaps":{
            "map1":{
                "map1.1.":{
                    "a":"aa",
                    "b":"bb",
                    "c":"cc",
                    "_map_":true
                },
                "map1.2.":{
                    "a":"aa",
                    "b":"bb",
                    "c":"cc",
                    "_map_":true
                },
                "map1.3.":{
                    "d":"dd",
                    "e":"ee",
                    "f":"ff",
                    "_map_":true
                },
                "_map_":true
            },
            "map2":{
                "1":{"value1":2,"value2":1},
                "2":{"value1":2,"value2":2},
                "3":{"value1":2,"value2":3},
                "_map_":true
            },
            "map3":{
                "s1":{"_set_":["hey","hallo","hoy"]},
                "s2":{"_set_":["bye","goodbye","👋"]},
                "_map_":true
            },
        },
        "extraTxt":{
            "txt1":"hello",
            "txt2":"world",
            "list":[1,2,3,4,5,6],
            "list2":["t","j"]
        },
        "set":{
            "_set_":['a','b','c']
        }
    }

    const json = obj2Json(testObj);
    expect(json).toStrictEqual(JSON.stringify(record)); //record should be converted to json to compare

    const original = json2Obj(json) as IMap;
    expect(original).toStrictEqual(testObj);
});