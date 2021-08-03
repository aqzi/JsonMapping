# JsonMapping
Convert json to and from (nested) maps and sets

## Map/Set --> Json
The mapper function adds an identifier to the map and set objects.
When the parameter noIdentifier is true, it will convert the map to an object and the set will be a list.
(Json.stringify would transform a map to an empty object.)

Map --> json:
```
{test: new Map(['😀', 1], ['👻', 2])} 
--> (Mapping)
{"test":{"😀":1,"👻":2,"_map_":true}}
```

Set --> json:
```
{test: new Set([1,2,3])} 
--> (Mapping)
{"test":{"_set_":[1,2,3]}}
```

## Json --> Map/Set
The package provides two ways to reconstruct maps and sets correctly.
1) identifiers: If the json contains identifiers it will automaticly perform the transformation.
2) keysToConvert: You can specify some keys belonging to objects that should be converted.
    if the same key is specified as value for Map and Set, than the corresponding object will be transformed
    to a map. If the json contains multiple objects with the same key than all those objects will be converted
    if that key was specified. Following code gives an example.

```
json2Obj(dataAsJson, {Map: ['🐔', '🐷'], Set: ['😺']})
```

Object with keys 🐔 or 🐷 will be transformed to a map and an object with key 😺 will become a set.