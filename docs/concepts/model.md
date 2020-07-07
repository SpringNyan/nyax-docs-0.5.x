---
id: model
title: Model
---

使用 Model 可以将一个复杂的应用分割成许多较小的模块。每个 Model 都拥有自己的 defaultArgs，initialState，selectors，reducers，effects 和 epics。

```tsx
const Model = createModel(
  class extends ModelBase {
    // ...
  }
);
```

## Dynamic Model

默认的 Model 是静态的，在注册 Model 的时候会自动注册其唯一 Container。当我们需要注册同一 Model 的多个相互独立的 Container 时，我们可以将 Model 配置为 Dynamic Model。

当 Model 为 Dynamic Model 时，我们在获取 Container 时需要额外提供 `containerKey` 作为标识。默认情况下 Dynamic Model 对应的 Container 需要显式注册。

```tsx
const Model = createModel(
  class extends ModelBase {
    // ...
  },
  {
    isDynamic: true, // Model is dynamic
  }
);

const container = getContainer(Model, "someContainerKey");
container.register(); // need register container explicitly
```

## Lazy Model

默认的 Model 是非惰性的。这意味着对于 Static Model 会立即注册其唯一的 Container；对于 Dynamic Model 则会要求显式注册其每一个 Container。如果我们希望 Model 的 Container 不会立即注册，且在分发 action 时自动（隐式）注册，则可以配置 Model 为 Lazy Model。

:::info

Container 隐式注册时会使用其默认参数。请确保对应的 Model 的默认参数中不包含必要参数，否则会抛出错误。

:::

```tsx
const Model = createModel(
  class extends ModelBase {
    // ...
  },
  {
    isDynamic: true,
    isLazy: true, // Model is lazy
  }
);

const container = getContainer(Model, "someContainerKey");
container.actions.someAction.dispatch({}); // container will be registered implicitly
```

## 合并 Model

多个 Model 可以被合并为一个新的 Model，每个 Model 的定义的内容会被递归地合并。

Model 的定义不允许重复。

```tsx
const AModel = createModel(
  class extends ModelBase {
    public initialState() {
      return {
        a: "A",
      };
    }
  }
);

const BModel = createModel(
  class extends ModelBase {
    public initialState() {
      return {
        b: "B",
      };
    }
  }
);

const Model = mergeModels(AModel, BModel);
const container = getContainer(Model);
container.state.a; // A
container.state.b; // B
```

## 合并 Sub Model

多个 Model 可以作为 Sub Model 被合并为一个新的 Model，每个 Model 的定义的内容会被放到相应的 namespace 下。

```tsx
const AModel = createModel(
  class extends ModelBase {
    public initialState() {
      return {
        x: "X",
        name: "A",
      };
    }
  }
);

const BModel = createModel(
  class extends ModelBase {
    public initialState() {
      return {
        y: "Y",
        name: "B",
      };
    }
  }
);

const Model = mergeSubModels({
  a: AModel,
  b: BModel,
});
const container = getContainer(Model);
container.state.a.x; // X
container.state.b.y; // Y
container.state.a.name; // A
container.state.b.name; // B
```

## 重写定义内容

可以在新的 Model 中重写被继承的 Model 的定义的内容。

```tsx
const AModel = createModel(
  class extends ModelBase {
    public effects() {
      return {
        someEffect: async () => {
          console.log("A");
        },
      };
    }
  }
);

const BModel = createModel(
  class extends AModel {
    public effects() {
      return {
        ...super.effects(),

        someEffect: async () => {
          console.log("B");
        },
      };
    }
  }
);
```
