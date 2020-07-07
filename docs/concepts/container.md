---
id: container
title: Container
---

当创建应用后，我们通过 Container 得到当前的应用状态以及衍生数据。我们也可以通过 Container 进行 action 分发，从而改变应用状态。

```tsx
const Model = createModel(
  class extends ModelBase {
    // ...
  }
);

const container = getContainer(Model);
container.state.someState;
container.getters.someGetter;
container.actions.someAction.dispatch({});
```

## State

可以通过 Container 中的 state 获得当前容器的状态。state 的初始值由 Model 中的 initialState 生成。

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
container.state.foo; // foo
```

## Getters

可以通过 Container 中的 getters 获得当前容器的衍生数据。getters 由 Model 中的 selectors 生成。相关概念可以参见 [Reselect](https://github.com/reduxjs/reselect)。

```tsx
const Model = createModel(
  class extends ModelBase {
    public initialState() {
      return {
        foo: "foo",
      };
    }

    public selectors() {
      return {
        fooText: () => `foo: ${this.state.foo}`,
      };
    }
  }
);

const container = getContainer(Model);
container.getters.fooText; // foo: foo
```

## Actions

可以通过 Container 中的 actions 获得当前容器的 action 助手。可以通过 action 助手检查 action 的类型，创建 action 以及分发 action。actions 由 Model 中的 reducers 和 effects 的合并结果生成。

分发 action 方法的返回值为 `Promise<TReturnTypeOfEffect>`。

```tsx
const Model = createModel(
  class extends ModelBase {
    public initialState() {
      return {
        foo: "foo",
      };
    }

    public reducers() {
      return {
        setFoo: (value: string) => {
          this.state.foo = value;
        },
      };
    }

    public effects() {
      return {
        setTrimmedFoo: async (value: string) => {
          const trimmed = value.trim();
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
container.actions.setTrimmedFoo.is(setFooAction); // false

container.actions.setFoo.dispatch("foo"); // Promise<void>
await container.actions.setTrimmedFoo.dispatch(" foo "); // foo
```

## 注册

通过调用 register 方法可以注册当前 Container。register 方法接受一个可选参数，该参数会和 Model 中的 defaultArgs 共同计算出 args 并传递给 initialState。

当 Container 注册后，通过 getContainer 获得的 Container 引用在注册期间不会改变。

当 Container 已经注册时调用该方法会抛出错误。

```tsx
container.register();
container.register({ foo: "foo" });
```

## 卸载

通过调用 unregister 方法可以卸载当前 Container。该方法会从 store 中删除对应 state，终止 epics 并清理 Container 的引用缓存。

无论 Container 是否注册均可调用该方法以清理引用缓存。

```tsx
container.unregister();
```

## 注册状态

Container 提供 canRegister 和 isRegistered 用来判断注册状态。
