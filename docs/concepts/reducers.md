---
id: reducers
title: Reducers
---

通过在 Model 中定义 reducers，我们能够订阅 action 从而改变 state。其同时被用来生成 Container 中的 action 助手。

## 基本

reducer 接受一个 payload 参数，其代表对应 action 的 payload。payload 的类型需要被显式定义。

在 reducer 中，我们可以直接修改 `this.state` 从而改变 state。

:::info

`this.state` 仅在 reducer 中可以被修改。（通过 [Immer](https://github.com/immerjs/immer) 支持）

:::

```tsx
const Model = createModel(
  class extends ModelBase {
    public initialState() {
      return {
        name: "",
      };
    }

    public reducers() {
      return {
        setName: (name: string) => {
          this.state.name = name;
        },
      };
    }
  }
);

const container = getContainer(Model);
container.actions.setName.dispatch("Nyax");
container.state.name; // "Nyax"
```
