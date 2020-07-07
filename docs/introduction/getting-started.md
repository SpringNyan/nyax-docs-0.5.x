---
id: getting-started
title: 快速开始
---

Nyax 是一个基于 Redux 的框架，旨在提供完备的 TypeScript 类型推断提示以及应用的模块化，且整合了常用的 Redux 方案。

## 特性

- 完备的 TypeScript 类型推断提示，拒绝 "AnyScript"
- 整合常用的 Redux 方案，满足绝大部分业务需求
- 应用模块化，多个 Model 之间可交互
- 支持 Container 的动态注册卸载，可以在运行时动态注册相同 Model 的多个独立的 Container
- 基于原生 Redux，可以自由进行额外定制

## 安装

Nyax 依赖于 [Redux](https://github.com/reduxjs/redux)，[Redux Observable](https://github.com/redux-observable/redux-observable)，[RxJS](https://github.com/ReactiveX/rxjs) 和 [Immer](https://github.com/immerjs/immer)。

```bash
npm install nyax redux redux-observable rxjs immer
```

## 基本示例

基本示例展示了如何创建一个简单的计数器应用以及与 React 进行集成。

```tsx
import { createModel, createModelBase, createNyax } from "nyax";
import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import { Provider, useSelector } from "react-redux";

interface Dependencies {
  generateRandomNumber: () => number;
}

const ModelBase = createModelBase<Dependencies>();

const CounterModel = createModel(
  class extends ModelBase {
    public initialState() {
      return {
        title: "Counter",
        count: 0,
      };
    }

    public selectors() {
      return {
        text: () => `${this.state.title} - ${this.state.count}`,
      };
    }

    public reducers() {
      return {
        setTitle: (value: string) => {
          this.state.title = value;
        },
        setCount: (value: number) => {
          this.state.count = value;
        },
        increase: () => {
          this.state.count += 1;
        },
        decrease: () => {
          this.state.count -= 1;
        },
      };
    }

    public effects() {
      return {
        randomCount: async () => {
          const count = this.dependencies.generateRandomNumber();
          await this.actions.setCount.dispatch(count);
        },
      };
    }
  }
);

const dependencies: Dependencies = {
  generateRandomNumber: () => Math.floor(Math.random() * 1000),
};
const nyax = createNyax({
  dependencies,
});

const rootModels = {
  counter: CounterModel,
};
nyax.registerModels(rootModels);

const GetContainerContext = React.createContext(nyax.getContainer);

const Counter = React.memo(() => {
  const getContainer = useContext(GetContainerContext);
  const counterContainer = getContainer(CounterModel);

  const title = useSelector(() => counterContainer.state.title);
  const count = useSelector(() => counterContainer.state.count);
  const text = useSelector(() => counterContainer.getters.text);

  const [titleInputValue, setTitleInputValue] = useState("");
  const [countInputValue, setCountInputValue] = useState("");

  return (
    <div>
      <div>Title: {title}</div>
      <div>Count: {count}</div>
      <div>Text: {text}</div>

      <div>
        <input
          type="text"
          value={titleInputValue}
          onChange={(event) => setTitleInputValue(event.target.value)}
        />
        <button
          onClick={() =>
            counterContainer.actions.setTitle.dispatch(titleInputValue)
          }
        >
          setTitle
        </button>
      </div>
      <div>
        <input
          type="text"
          value={countInputValue}
          onChange={(event) => setCountInputValue(event.target.value)}
        />
        <button
          onClick={() =>
            counterContainer.actions.setCount.dispatch(
              parseInt(countInputValue)
            )
          }
        >
          setCount
        </button>
      </div>
      <div>
        <button onClick={() => counterContainer.actions.increase.dispatch({})}>
          increase
        </button>
        <button onClick={() => counterContainer.actions.decrease.dispatch({})}>
          decrease
        </button>
        <button
          onClick={() => counterContainer.actions.randomCount.dispatch({})}
        >
          random
        </button>
      </div>
    </div>
  );
});

ReactDOM.render(
  <GetContainerContext.Provider value={nyax.getContainer}>
    <Provider store={nyax.store}>
      <Counter />
    </Provider>
  </GetContainerContext.Provider>,
  document.getElementById("root")
);
```
