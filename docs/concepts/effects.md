---
id: effects
title: Effects
---

通过在 Model 中定义 effects，我们能够订阅 action 从而执行副作用。其同时被用来生成 Container 中的 action 助手。

:::note

effect 和 [Redux Thunk](https://github.com/reduxjs/redux-thunk) 作用类似。但 effect 是由标准 action 进行触发的。

:::

## 基本

effect 接受一个 payload 参数，其代表对应 action 的 payload。payload 的类型需要被显式定义。

effect 是一个 async 函数，你可以在其中执行副作用，例如分发 action，调用 API 等等。

effect 可以有返回值。当使用 action 助手分发 action 时，会返回一个 Promise，其值为 effect 的返回值。

:::info

如果 reducer 和 effect 被同时定义，在分发 action 时 reducer 会被同步执行，然后执行 effect。

:::

```tsx
const Model = createModel(
  class extends ModelBase {
    // ...

    public effects() {
      return {
        fetchName: async () => {
          const name = await this.dependencies.api.fetchName(); // assume result is "Nyax"
          await this.actions.setName.dispatch(name);
          return name;
        },
      };
    }
  }
);

const container = getContainer(Model);
await container.actions.fetchName.dispatch({}); // "Nyax"
container.state.name; // "Nyax"
```
