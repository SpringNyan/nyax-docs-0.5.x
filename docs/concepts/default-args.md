---
id: default-args
title: Default Args
---

defaultArgs 定义了 Model 的默认参数。其同时被用来推断注册 Container 时需要提供的参数的类型。

## 基本

当 Container 注册时，我们需要生成其初始 state。在某些情况下，我们可能希望根据参数动态生成其初始 state。（类似于 Class 的 constructor）

默认情况下，定义的参数在注册 Container 时是可选的。我们在 initialState 中通过 `this.args` 获取提供的参数。

:::info

`this.args` 仅在 initialState 中可用。如果你在其它地方需要访问参数值，你应该将对应的值保存到 state 中。

:::

```tsx
const Model = createModel(
  class extends ModelBase {
    public defaultArgs() {
      return {
        name: "Nyax",
        version: "1.0.0",
      };
    }

    public initialState() {
      return {
        name: this.args.name,
        version: this.args.version,
        description: "",
      };
    }
  },
  {
    isDynamic: true,
  }
);

const container = getContainer(Model, "someContainerKey");
container.register({ version: "2.3.3" });
container.state; // { name: "Nyax", version: "2.3.3", description: "" }
```

## 必要参数

有些时候我们希望某些参数是必填的（例如 ID）。我们可以通过 `createRequiredArg` 来定义必要参数。

使用 `createRequiredArg` 定义的参数在注册 Container 时必填。`createRequiredArg` 接受一个可选的参数用于初始化 Container 未注册时的模拟 state。如果未提供该参数，则在访问模拟 state 时会抛出错误。

```tsx
// createRequiredArg without default value

const Model = createModel(
  class extends ModelBase {
    public defaultArgs() {
      return {
        id: createRequiredArg<string>(),
      };
    }

    public initialState() {
      return {
        id: this.args.id,
      };
    }
  },
  {
    isDynamic: true,
    isLazy: true,
  }
);

const container = getContainer(Model, "someContainerKey");
container.state.id; // throw error
container.register({ id: "123" });
container.state.id; // "123"
```

```tsx
// createRequiredArg with default value

const Model = createModel(
  class extends ModelBase {
    public defaultArgs() {
      return {
        id: createRequiredArg("fakeId"),
      };
    }

    public initialState() {
      return {
        id: this.args.id,
      };
    }
  },
  {
    isDynamic: true,
    isLazy: true,
  }
);

const container = getContainer(Model, "someContainerKey");
container.state.id; // "fakeId"
container.register({ id: "123" });
container.state.id; // "123"
```

:::info

出于性能因素，合并后的 Sub Model 的 defaultArgs 的类型会被推断为可选的，无论其中是否包含必要参数。如果 defaultArgs 包含必要参数又未在注册 Container 时提供对应参数，则会抛出错误。

:::
