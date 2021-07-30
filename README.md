# JsonMapping
Convert json to and from (nested) maps and sets

## Map/Set --> Json
The mapper function adds an identifier to the map and set objects.

Map --> json:
```
{test: new Map(['a', 1], ['b', 2])} 
--> (Mapping)
{"test":{"a":1,"b":2,"_map_":true}}
```

Set --> json:
```
{test: new Set([1,2,3])} 
--> (Mapping)
{"test":{"_set_":[1,2,3]}}
```

## Json --> Map/Set
Maps and sets can be reconstructed correctly because of the identifiers.