# eslint-plugin-lodash-to-native

Правило находит использование функции `_.map` из библиотеки Lodash, например `_.map(collection, fn)`, и, если это возможно, предлагает заменить его на использование нативного `Array#map`.

## Установка

- установить [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

- установить `@mikhin/eslint-plugin-lodash-to-native`:

```
$ npm install @mikhin/eslint-plugin-lodash-to-native --save-dev
```

## Использование

Добавить `lodash-to-native` в раздел `plugins` файла `.eslintrc`.

```json
{
    "plugins": [
        "@mikhin/lodash-to-native"
    ]
}
```

Добавить `@mikhin/lodash-to-native/map` в раздел `rules` файла `.eslintrc`.

```json
{
    "rules": [
        "@mikhin/lodash-to-native/map"
    ]
}
```
