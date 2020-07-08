---
id: initial-state
title: Initial State
---

initialState 定义了 Model 的初始 state。其同时被用来推断对应 Container 的 state 的类型。

## 基本

当 Container 注册时，我们需要生成其初始 state。在 initialState 中可以通过 `this.args` 获得可选的参数，并生成初始 state。

在 Model 中，可以通过 `this.state` 访问当前 state。

:::info

`this.state` 的行为和 Container 中的 state 一致。

:::

```tsx
const Model = createModel(
  class extends ModelBase {
    public initialState() {
      return {
        name: "Nyan",
        version: "1.0.0",
      };
    }
  }
);

const container = getContainer(Model);
container.state; // { name: "Nyax", version: "1.0.0" }
```
