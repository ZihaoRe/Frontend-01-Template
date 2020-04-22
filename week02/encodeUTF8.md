```js
const encodeUTF8 = str => str.split('').map(char => `\\u${char.charCodeAt().toString(16)}`).join('');
```
