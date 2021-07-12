# useDescendants ![npm bundle size](https://img.shields.io/bundlephobia/minzip/use-descendants@beta)

> This is the README for beta releases. The "stable" (but still v0) release is here: https://github.com/pacocoursey/use-descendants/tree/v0

useDescendants is a react hook for keeping track of descendant components and their relative indeces. It's based off the [@reach/descendants](https://www.npmjs.com/package/@reach/descendants) package, but faster and smaller.

If you want to understand more about what this package does or why we need it, read the [Problem Complex](https://www.npmjs.com/package/@reach/descendants) from the @reach/descendants package.

In short, this package allows each item in a list to know it's relative index and the parent of the list can keep track of each child, without needing to render in a loop and pass each component an index.

This enables component composition:

```js
<List>
  <Item /> {/* I'm index 0 */}
  <Item /> {/* I'm index 1 */}
  <div>
    <div>
      <Item /> {/* I'm arbitrarily nested, but still know that I'm index 2 */}
    </div>
  </div>
</List>
```

## Installation

```
$ yarn add use-descendants@beta
```

## Usage

In the parent, you call `useDescendants` and pass the result to `<Descendants>` that wraps the children. In each child item, retrieve that items index with the `useDescendant` hook.

```jsx
const Menu = () => {
  const context = useDescendants()
  return (
    <Descendants value={context}>
      <Item />
    </Descendants>
  )
}

const Item = () => {
  const index = useDescendant()
  return <div>My index is {index}</div>
}
```

#### React.memo

Items that use `React.memo` or stable keys will still have an up-to-date index, as they will be forcefully re-rendered whenever the parent re-renders. This means you can safely remove `React.memo`, as it will always be bypassed.

#### Data passing

You can pass any data you want to `useDescendant` and it will be available in the parent through `map`:

```jsx
// In Item
const ref = useRef()
const index = useDescendant({ ref })

// In Menu
const context = useDescendants()
console.log(context.map.current)
// => { '<randomItemId>': { index: 0, props: { ref: HTMLDivElement } } }
```

You can also pass un-memoized values or callbacks that are always up-to-date here because it's just kept in a ref:

```jsx
const index = useDescendant({
  onSelect: () => {
    /* Do something */
  }
})
```

## Credits

- [@reach/descendants](https://www.npmjs.com/package/@reach/descendants) and [Chance](https://twitter.com/chancethedev), who introduced me to this concept
- [Shu Ding](https://twitter.com/shuding_) for help with a faster, simpler implementation
