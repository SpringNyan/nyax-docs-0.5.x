---
id: default-args
title: Default Args
---

defaultArgs 定义了 Model 的默认参数。其同时被用来推断注册 Container 时需要提供的参数的类型。

## 基本

当 Container 注册时，我们需要生成其初始的 state。对于 Dynamic Model 而言，我们可能需要根据参数动态生成初始状态。（类似于 Class 的 constructor）

默认情况下，注册 Container 时参数是可选的。我们在 initialState 中使用 `this.args` 获取提供的参数。

:::info

`this.args` 仅在 initialState 中可用。如果你在其它地方需要使用参数，你应该将对应的参数保存到 state 中。

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

const container = getContainer(Model, "key");
container.register({ version: "2.3.3" });
container.state; // { name: "Nyax", version: "2.3.3", description: "" }
```

## 必要参数

有些时候我们希望某些参数是必填的（例如资源 ID，其初始化后不可变）。我们可以通过 `createRequiredArg` 来声明必要参数。

使用 `createRequiredArg` 生成的参数在注册 Container 时必填。`createRequiredArg` 接受一个可选的参数用于 Container 的模拟 state。如果未提供该参数，则访问模拟 state 时会抛出错误。

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

const container = getContainer(Model, "key");
container.state.id; // throw error
container.register({ id: "123" });
container.state.id; // 123
```

```tsx
// createRequiredArg with default value

const Model = createModel(
  class extends ModelBase {
    public defaultArgs() {
      return {
        id: createRequiredArg("0"),
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

const container = getContainer(Model, "key");
container.state.id; // 0
container.register({ id: "123" });
container.state.id; // 123
```

:::info

出于性能因素，合并后的 Sub Model 对应的 Container 在注册时 args 会被推断为可选的，无论其中是否包含必要参数。当 args 包含必要参数又未提供时，注册会抛出错误。

:::
