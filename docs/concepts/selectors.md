---
id: selectors
title: Selectors
---

通过在 Model 中定义 selectors，我们能够生成 Container 的 getters 并推断其值的类型。

:::note

我们默认你已拥有 [Reselect](https://github.com/reduxjs/reselect) 的相关知识。

:::

## 基本

在 Redux 中，对于衍生数据我们应当通过计算得到。selector 定义了如何从来源数据计算衍生数据。

你可以在 selector 中使用各种各样的来源数据，例如 `this.state`，`this.getters` 以及 `this.getContainer(Model).state` 等等。

```tsx
const Model = createModel(
  class extends ModelBase {
    public initialState() {
      return {
        name: "Nyax",
      };
    }

    public selectors() {
      return {
        year: () => 2020,
        text: () => `${this.state.name}@${this.getters.year}`,
      };
    }
  }
);

const container = getContainer(Model);
container.getters.text; // "Nyax@2020"
```

## 记忆化

对于复杂计算，我们应当缓存其结果，当下次访问时如果其依赖数据没有改变则直接返回缓存值。

我们使用 `createSelector` 对复杂计算进行记忆化。

:::note

请使用 Nyax 包提供的 `createSelector` 函数。Reselect 包中的 `createSelector` 函数与 Nyax 不兼容。

:::

:::info

TypeScript 在类型推断时可能会对循环引用报错。（例如访问 `this.getters` 的内容）

当出现类型推断报错时，你需要显式定义对应的类型。此时 TypeScript 会检查定义类型和推断类型是否相容。

:::

```tsx
const Model = createModel(
  class extends ModelBase {
    public initialState() {
      return {
        size: 233333,
      };
    }

    public selectors() {
      return {
        numArr: createSelector(
          () => this.state.size,
          (size) => new Array(size).fill(0).map((_, index) => index)
        ),
        strArr: createSelector(
          (): number[] => this.getters.numArr, // define `number[]` type explicitly
          (range) => range.map((num) => "" + num)
        ),
      };
    }
  }
);

const container = getContainer(Model);
container.getters.strArr; // ["0", "1", "2", ...]
```
