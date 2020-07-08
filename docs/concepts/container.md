---
id: container
title: Container
---

当创建应用后，我们可以通过 `getContainer` 获取 Model 对应的 Container 得到当前的应用状态以及衍生数据。我们也可以通过 Container 进行 action 分发，从而改变应用状态。

```tsx
const Model = createModel(
  class extends ModelBase {
    // ...
  }
);

const { getContainer, registerModels } = createNyax(/* options */);
registerModels({ model: Model });

const container = getContainer(Model);
container.state.someState;
container.getters.someGetter;
container.actions.someAction.dispatch({});
```

## State

可以通过 Container 中的 state 获得当前容器的状态。state 的初始值由 Model 中的 initialState 生成。

:::info

当 Container 未注册时，state 的值为默认参数生成的初始值而不是空。这是为了避免 [Stale Props](https://react-redux.js.org/api/hooks#stale-props-and-zombie-children) 导致问题。

:::

```tsx
const Model = createModel(
  class extends ModelBase {
    public initialState() {
      return {
        foo: "foo",
      };
    }
  }
);

const container = getContainer(Model);
container.state.foo; // "foo"
```

## Getters

可以通过 Container 中的 getters 获得当前容器的衍生数据。getters 由 Model 中的 selectors 生成。

```tsx
const Model = createModel(
  class extends ModelBase {
    // ...

    public selectors() {
      return {
        fooText: () => `foo: ${this.state.foo}`,
      };
    }
  }
);

const container = getContainer(Model);
container.getters.fooText; // "foo: foo"
```

## Actions

可以通过 Container 中的 actions 获得当前容器的 action 助手。可以通过 action 助手断言 action 的类型，创建 action 以及分发 action。actions 由 Model 中的 reducers 和 effects 的共同生成。

分发 action 时会返回 `Promise<ReturnTypeOfEffect>`，可以等待它的值以获得对应 effect 的结果。

:::info

默认情况下分发 action 时对应的 reducer 会被同步执行，因此在不需要 effect 返回值的情况下可以不等待 Promise 结束。

:::

:::info

当 reducer / effect 中未定义 payload 时，建议使用 `{}` 作为创建 / 分发 action 时的 payload 参数。

:::

```tsx
const Model = createModel(
  class extends ModelBase {
    // ...

    public reducers() {
      return {
        setFoo: (value: string) => {
          this.state.foo = value;
        },
      };
    }

    public effects() {
      return {
        trimFoo: async () => {
          const trimmed = this.state.foo.trim();
          await this.actions.setFoo(trimmed);
          return trimmed;
        },
      };
    }
  }
);

const container = getContainer(Model);

const setFooAction = container.actions.setFoo.create("foo");
container.actions.setFoo.is(setFooAction); // true
container.actions.trimFoo.is(setFooAction); // false

container.actions.setFoo.dispatch("  foo  "); // Promise<void>
await container.actions.trimFoo.dispatch({}); // "foo"
```

## 注册 Container

通过调用 `register` 方法可以注册当前 Container。`register` 方法接受一个可选参数，该参数会和 Model 中的 defaultArgs 进行合并然后传递给 initialState。

注册 Container 会挂载 state 到 store 上，订阅 action 并执行对应的 reducer 和 effect，以及监听 epics。当 Container 注册后，通过 `getContainer` 获得的 Container 的引用在注册期间不会改变。

:::info

当 Container 已经注册时调用该方法会抛出错误。

:::

```tsx
container.register();
container.register({ foo: "foo" });
```

## 卸载 Container

通过调用 `unregister` 方法可以卸载当前 Container。

卸载 Container 会从 store 中删除对应 state，停止订阅 action，并终止 epics 监听。Container 和对应 getters 的缓存也会被清理。

无论 Container 是否注册均可调用该方法以清理缓存。

:::info

卸载 Container 并不会中断 effect 的执行。当 Model 为 Lazy Model 时需要小心非期望的自动注册。

:::

```tsx
container.unregister();
```

## 注册状态

Container 提供 `isRegistered` 和 `canRegister` 属性用来判断注册状态以及是否可以注册。

## Sub Container

有些时候我们可能希望获得 Model 中的某一个 Sub Model 对应的 `ContainerCore`。这种时候我们可以通过 `createSubContainer` 以获得 Container 在某一个 namespace 下的的 Sub Container。

:::info

`ContainerCore` 是只包含 state，getters 和 actions 的 Container。Sub Container 实际上并不是一个真正的 Container，因为它没有对应的 Model 注册在应用上。

:::

```tsx
const AModel = createModel(
  class extends ModelBase {
    public initialState() {
      return {
        name: "A",
        x: "X",
      };
    }
  }
);

const BModel = createModel(
  class extends ModelBase {
    public initialState() {
      return {
        name: "B",
        y: "Y",
      };
    }
  }
);

const Model = mergeSubModels({
  a: AModel,
  b: BModel,
});

const container = getContainer(Model);
const aContainer = createSubContainer(container, "a");
aContainer.state.name; // "A"
aContainer.state.x; // "X"
```
