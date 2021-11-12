# Use Routable Helpers (use-routable-helpers)

In the Routable code base, there are helper functions that we regularly use.

## Rule Details

### Object.values

Invalid:
```javascript
const testObj = { hello: 'world' };
console.log(testObj.values());
```

Valid:
```javascript
const testObj = { hello: 'world' };
console.log(allValues(testObj));
```
