# 01. 从一个对象生成一个联合类型

```typescript
export const fruitCounts = {
  apple: 1,
  pear: 4,
  banana: 26,
};

type SingleFruitCount =
  | { apple: number }
  | { banana: number }
  | { pear: number };

const singleFruitCount: SingleFruitCount = {
  banana: 12,
};
```

想要根据 `fruitCounts`对象生成联合类型, 像 `SingleFruitCount`这样虽然可行, 但后期维护相当麻烦, 并且看起来写的不够**高级**.

所以我们可以首先根据 `fruitCounts` 定义一个类型

```typescript
type FruitCounts = typeof fruitCounts;
```

然后定义一个新类型, 让它的 key 就是 FruitCounts 中的所有的 key

```typescript
type NewSingleFruitCount = {
    [K in keyof FruitCounts]: {}
}
```

此时我们使用这个类型大概是这样的:

```typescript
const singleFruitCount: NewSingleFruitCount = {
  apple: {},
  banana: {},
  pear: {},
}
```

由于 fruitCounts 中每个类型的值为数字, 所以我们需要进一步定义每个 key 下面的值为数字类型, 大概是这样:

```typescript
type NewSingleFruitCount = {
  [K in keyof FruitCounts]: {
    [K2 in K]: number;
  };
};

const singleFruitCount2: NewSingleFruitCount = {
  pear: { pear: 4 },
  apple: { apple: 1 },
  banana: { banana: 26 },
};
```

但这仍然不是我们想要的, 它的结构看起来太复杂了. 所以我们需要再进一步.

```typescript
type NewSingleFruitCount = {
  [K in keyof FruitCounts]: {
    [K2 in K]: number;
  };
}[keyof FruitCounts];
```

到这个时候, 我们就可以很轻松的使用这个类型了:

```typescript
const singleFruitCount2: NewSingleFruitCount = {
  pear: 4,
  apple: 1,
  banana: 26,
};
```

# 02. 增强联合类型

当想要把以下的联合类型:

```typescript
export type Entity = { type: 'user' } | { type: 'post' } | { type: 'comment' };
```

转换成以下类型, 即根据 type 的不同添加不同的 xxxId 类型, 类似这样:

```typescript
type EntityWithId =
  | { type: 'user'; userId: string }
  | { type: 'post'; postId: string }
  | { type: 'comment'; commentId: string };
```

如上期一样, 如何更优雅的转换呢?

```typescript
type EntityWithId = {
  [EntityType in Entity['type']]: {
    type: EntityType;
  }
}
```

此时我们大概可以这样使用:

```typescript
const result: EntityWithId = {
  comment: {
    type: 'comment'
  }
}
```

但这还不够, 我们的目标是将它变成一个联合类型, 所以和上次一样, 我们改造 EntityWithId 变成这样:

```typescript
type EntityWithId = {
  [EntityType in Entity['type']]: {
    type: EntityType;
  };
}[Entity['type']];
```

但是此时我们只是创造了一个和 `Entity` 相同的类型, 接下来我们可以往里面增加我们需要的内容.

```typescript
type EntityWithId = {
  [EntityType in Entity['type']]: {
    type: EntityType;
  } & Record<`${EntityType}Id`, string>;
}[Entity['type']];
```

使用 `& Record<>` 我们扩展了 `EntityWithId`, 并且在定义 Record 的 key 时, 我们规定了 key 的名称必须使用以 type 为开头的 xxxId.

# 03. ts-toolbelt

```typescript
// 我们有这样一个 query 字符串
const query = `/home?a=foo&b=wow`

// 最终我们希望得到一个这样的对象
const obj:Union.Merge<QueryParams> = {
    a: 'foo',
    b: 'wow'
}
```

并且, 当 query 改变成 `/home?a=bar&b=wow`时, 我们希望 TS 能够提示我们 obj 的 a 属性需要改变.

通过使用 ts-toolbelt :

```typescript
type Query = typeof query // /home?a=foo&b=wow

type SecondQueryPart = String.Split<Query, "?">[1]; // a=foo&b=wow

type QueryElements = String.Split<SecondQueryPart, "&">; // ['a=foo', 'b=wow']
```

接着

```typescript
type QueryParams = {
    [QueryElement in QueryElements[number]]: { // 这里的 QueryElements[number] 代表了 QueryElements 中的每一项
        [Key in String.Split<QueryElement, '='>[0]]: // 这里等于把 a=foo, b=wow 分别将 a 和 b 作为 QueryParams 类型的 key, 值就是对应的 foo 和 wow
        	String.Split<QueryElement, '='>[1];
    }
}[QueryElements[number]]
```

# 04. 函数重载

我们有这样三个函数:

```typescript
const addOne = (a: number) => {
  return a + 1;
};

const numToString = (a: number) => {
  return a.toString();
};

const stringToNum = (a: string) => {
  return parseInt(a);
};
```

然后我们希望有一个 `compose`方法能够组合以上三个函数并返回正确的函数签名, 比如说:

```typescript
const addOne1 = compose(addOne); // 我们希望 addOne1 的函数签名为 (input: number) => number

const addOneToString = compose(addOne, numToString) // 函数签名最好可以是 (input: number) => string

const fn = compose(addOne, numToString, stringToNum) // 函数签名应该为 (input: number) => number
```

此时我们可以利用 typescript 的函数签名重载功能来实现:

```typescript
export function compose<Input, FirstArg>(
  func: (input: Input) => FirstArg
): (input: Input) => FirstArg;

export function compose<Input, FirstArg, SecondArg>(
  func: (input: Input) => FirstArg,
  func2: (input: FirstArg) => SecondArg
): (input: Input) => SecondArg;

export function compose<Input, FirstArg, SecondArg, ThirdArg>(
  func: (input: Input) => FirstArg,
  func2: (input: FirstArg) => SecondArg,
  func3: (input: SecondArg) => ThirdArg
): (input: Input) => ThirdArg;

export function compose(...args: any[]) {
  // 具体的实现
}
```

# 05. 使用 extends 缩小泛型范围

假设我们有一个 `getDeepValue`方法, 可以用来查找对象深层次的属性值, 比如:

```typescript
const obj = {
  foo: {
    a: true,
    b: 2,
  },
  bar: {
    c: 'cool',
    d: 2,
  },
};

const result1 = getDeepValue(obj, 'foo', 'a') // true
const result2 = getDeepValue(obj, 'bar', 'd') // 2
```

我们希望当设置 `getDeepValue`的第二个参数为 'foo' 时, 第三个参数能够自动限制为 'a | b'. 

```typescript
export const getDeepValue = <
  Obj,
  FirstKey extends keyof Obj,
  SecondKey extends keyof Obj[FirstKey]
>(
  obj: Obj,
  firstKey: FirstKey,
  secondKey: SecondKey
): Obj[FirstKey][SecondKey] => {
  // 具体函数实现
};
```

此时, `getDeepValue`函数的第二个参数会自动被限制为 'foo | bar', 第三个参数也会自动根据第二个参数变化. 并且返回值也会有正确的类型.

# 06. React 根据组件使用的属性反推类型

```typescript
const MyComponent = (props: { enabled: boolean }) => {
    return null
}

type PropsFrom<T> = any

const props: PropsFrom<typeof MyComponent> = {
    enabled: true,
}
```

期望 PropsFrom 类型可以正确的反应出 `MyComponent`的 Props 的类型。

可以这样做：

```typescript
type PropsFrom<TComponent> = TComponent extends React.FC<infer Props>
    ? Props
    : never
```

当然如果还需要兼容 class 形式的 React 组件，还需要多做一步：

```typescript
class MyOtherComponent extends React.Component<{
    enabled: boolean
}> {}

type PropsFrom<TComponent> = TComponent extends React.FC<infer Props>
    ? Props
    : TComponent extends React.Component<infer Props>
    ? Props
    : never

const props: PropsFrom<MyOtherComponent> = {
    enabled: true,
}
```

# 07. 在 TypeScript 中优雅的使用 `Object.keys` 遍历

```typescript
export const myObject = {
    a: 1,
    b: 2,
    c: 3,
}

// 当有一个 object 我们需要遍历它所有的键值对时，最普遍的做法是：

Object.keys(myObject).forEach((key) => {
    console.log(myObject[key]) // 在 typescript 中这里会提示错误，表示 key 这个 string 类型并不在 myObject 的 key 签名 "a" | "b" | "c" 中
})
```

可以这样做：

```typescript
const objectKeys = <Obj extends Object>(obj: Obj): (keyof Obj)[] => {
    return Object.keys(obj) as (keyof Obj)[]
}

objectKeys(myObject).forEach((key) => {
  // 这里的 key 的类型会是更适合的 "a" | "b" | "c"
    console.log(myObject[key])
})
```

# 08. 泛型在 React 中的使用

在 React 的日常开发中，经常会碰到以下这种情况，即提供一系列数据 (items)，并指定每个数据的渲染方法 (renderItem)。

在这种情况下，往往提供的数据类型会被用在渲染方法中。

```typescript
interface TableProps {
    items: { id: string }[]
    renderItem: (item: { id: string }) => React.ReactNode
}

export const Table = (props: TableProps) => {
    return null
}

const Component = () => {
    return (
        <Table
            items={[{ id: '1' }]}
            renderItem={(item) => <div>{item.id}</div>}
        ></Table>
    )
}
```

此时，如果要为 items 的数据类型添加一个属性，则需要同时修改 items 和 renderItem 二处。更加优雅的方法是使用泛型：

```typescript
interface TableProps<TItem> {
    items: TItem[]
    renderItem: (item: TItem) => React.ReactNode
}

export function Table<TItem>(props: TableProps<TItem>) {
    return null
}

const Component = () => {
    return (
        <Table<{ id: string }> // 此时把 items 的类型定义的权利交给了使用者
            items={[{ id: '1' }]}
            renderItem={(item) => <div>{item.id}</div>}
        ></Table>
    )
}
```

# 09. `Omit`的使用1

如果想要实现一个删除对象中指定 key 的方法生成器，如下：

```typescript
export const makeKeyRemover = (keys: string[]) => (obj: any) => {}

const keyRemover = makeKeyRemover(['a', 'b'])

const newObject = keyRemover({ a: 1, b: 2, c: 3 })
```

怎样能够让 `newObject` 拥有正确的类型提示？（在这里应该标识它只有 `c` 这个属性）

可以使用 `TypeScript 3.5` 开始支持的 `Omit`:

```typescript
export const makeKeyRemover = 
<Key extends string>(keys: Key[]) => 
<Obj extends object>(obj: Obj): Omit<Obj, Key> => {
    return {} as any
}

const keyRemover = makeKeyRemover(['a', 'b'])

const newObject = keyRemover({ a: 1, b: 2, c: 3 })

// 此时 newObject 的类型提示中只会有 c 一个属性。
```

# 10. TypeScript 错误提示

当我们设计一个函数时，往往会对传入的参数作一些类型判断，并在参数不合法时抛出一个异常，比如这样：

```typescript
export const deepEqualCompare = <Arg>(a: Arg, b: Arg): boolean => {
    if (Array.isArray(a) || Array.isArray(b)) {
        throw new Error('无法使用 deepEqualCompare 判断数组是否相同')
    }
    return a === b
}

deepEqualCompare(1, 1)
deepEqualCompare([], ['a']) // 运行时抛出异常
```

我们可以通过以下的方式，让第二个 `deepEqualCompare` 在运行前就提示参数不合法。

```typescript
type CheckForBadArgs<Arg> = Arg extends any[]
    ? '无法使用 deepEqualCompare 判断数组是否相同'
    : Arg

export const deepEqualCompare = <Arg>(
    a: CheckForBadArgs<Arg>,
    b: CheckForBadArgs<Arg>
): boolean => {
    if (Array.isArray(a) || Array.isArray(b)) {
        throw new Error('无法使用 deepEqualCompare 判断数组是否相同')
    }
    return a === b
}

deepEqualCompare(1, 1)
deepEqualCompare([], ['a']) // 此时会直接提示参数不正确，并报一个问题
```

# 11. 部分类

当我们有这样一个 `interface` 时：

```typescript
export interface Post {
    id: string
    comments: { value: string }[]
    meta: {
        name: string
        description: string
    }
}

const post: Post = {
    id: '1',
}
```

此时 `post` 必须填入所有的属性，如果我们只想填入部分属性，并且在不能使用 `?` 改动 `Post` 接口时，可以使用 `Partial` 关键字：

```typescript
const post: Partial<Post> = {
    id: '1',
    meta: { // 提示错误
        description: '123',
    },
}
```

但 `Partial` 只能应用到类型的第一级参数中，如上，如果我还想只填入 `meta` 的部分属性，仍然会提示错误。所以下面这个 `DeepPartial` 工具类型会更加有用：

```typescript
type DeepPartial<Thing> = Thing extends Function
    ? Thing
    : Thing extends Array<infer InferredArrayMember>
    ? DeepPartialArray<InferredArrayMember>
    : Thing extends Object
    ? DeepPartialObject<Thing>
    : Thing | undefined

interface DeepPartialArray<Thing> extends Array<DeepPartial<Thing>> {}

type DeepPartialObject<Thing> = {
    [Key in keyof Thing]?: DeepPartial<Thing[Key]>
}

const post: DeepPartial<Post> = {
    meta: { // meta 是 DeepPartialObject, 可以缺省部分属性
        description: '123',
    },
    comments: [{}], // comments 是 DeepPartialArray, 里面的每个对象都可以缺少部分属性
}
```

# 12. `Omit` 的使用2

```typescript
type IconSize = 'sm' | 'xs'

interface IconProps {
    size: IconSize
}

export const Icon = (props: IconProps) => {
    return <></>
}

const Comp1 = () => {
    return (
        <>
            <Icon size="sm" />
            <Icon size="sth" />
        </>
    )
}
```

如上，当 `IconSize` 需要使用其他自定义值时，为了 `sth` 这里不报错，可以简单的将 `IconSize` 修改为：`type IconSize = 'sm' | 'xs' | string`。

但是此时，`IconSize` 将失去类型提示，因为 `string` 将覆盖 `'sm' | 'xs'`。 此时更合理的做法是使用 `Omit`。

```typescript
type IconSize = 'sm' | 'xs' | Omit<string, 'sm' | 'xs'>
```

但是这样写仍然不够优雅，比方说 `'sm'` 在这里出现了二次。所以可以提供一个更优雅的工具类型：

```typescript
type IconSize = LooseAutoComplete<'sm' | 'xs'>

export type LooseAutoComplete<T extends string> = T | Omit<string, T>
```

这样一来如果需要添加或修改关键字，只需要修改一处即可。

# 13. 在 `reducer` 中的应用

在使用 `Redux` 或者 `useReducer` 时，经常会有一个专门为 `Action` 的类型定义的常量文件，一般长这样：

```typescript
export const ADD_TODO = 'ADD_TODO'
export const REMOVE_TODO = 'REMOVE_TODO'
export const EDIT_TODO = 'EDIT_TODO'
```

那么如果需要给他们定义一个类型时，往往会这样写：

```typescript
export type Action = 'ADD_TODO' | 'EDIT_TODO' | 'REMOVE_TODO'
```

可以利用 `keyof` 更优雅的定义 `Action` 类型：

```typescript
export type ActionModule = typeof import('./13_constants')

export type Action = ActionModule[keyof ActionModule]
```

# 14. global

通过声明 (`declare`) 一个 `global`，可以在内部定义一个 `interface`，然后可以在所有需要用到的地方使用如下形式扩展这个接口，并且所有用到这个接口的地方都会看到扩展内容：

```typescript

// user.ts

declare global {
  interface GlobalReducerEvent {
    LOG_IN: {};
  }
}

// todos.ts

declare global {
  interface GlobalReducerEvent {
    ADD_TODO: {
      text: string;
    }
  }
}

```

# 15. Extract

```typescript
export type Event =
    | {
        type: 'LOG_IN';
        payload: {
            userId: string;
        };
    }
    | {
        type: 'SIGN_OUT';
    };

const sendEvent = (eventType: Event['type'], payload?: any) => { };

sendEvent('LOG_IN', { userId: '123' })
sendEvent('SIGN_OUT')
```

在以上代码中，`sendEvent` 的代码提示并不够完善，`payload` 是可选参数，且类型为 `any`。这会造成如下的错误：

```typescript
// SIGN_OUT 不需要任何 payload
sendEvent('SIGN_OUT', {});
// userId 类型不正确
sendEvent('LOG_IN', {
    userId: 123,
});
// payload 缺少 userId
sendEvent('LOG_IN', {});
// 缺少 payload
sendEvent('LOG_IN');
```

可以优化 `sendEvent` 成这样：

```typescript
const sendEvent = <Type extends Event['type']>
    (...args: Extract<Event, { type: Type }> extends { payload: infer TPayload }
        ? [Type, TPayload]
        : [Type]
    ) => { };
```

上述错误的使用将会第一时间被 `tsc` 发现并被告知。

`Extract<U, T>` 意为从 `U` 中抽取符合 `T` 的类，比如：

```typescript
type A = 'a' | 'b' | 'c';
type B = 'b';
Extract<A, B> // 'b'
// 只有 'b' 符合条件
```

类似的还有一个 `Exclude<U, T>`，它是从 `U` 中排除符合 `T` 的类，所以：

```typescript
type A = 'a' | 'b' | 'c';
type B = 'b';
Exclude<A, B> // 'a' | 'c'
// 排除了 'b'
```

在上述例子中，会发现 `sendEvent` 的参数名提示为 `arg_0` `arg_1`，如果要更优雅的提示参数名，可以作如下修改：

```typescript
const sendEvent = <Type extends Event['type']>
    (...args: Extract<Event, { type: Type }> extends { payload: infer TPayload }
        ? [type: Type, payload: TPayload]
        : [type: Type]
    ) => { };
```

# 16. noUncheckedIndexedAccess

有如下一个对象：

```typescript
export const myObj: Record<string, string[]> = {};
```

我们可以直接这样使用：

```typescript
myObj.foo.push('bar');
```

显然，`foo` 可能是未定义的，这样写会得到一个运行时错误。但其实更合理的是在我们写代码的阶段就提示错误，这就需要我们通过修改 `tsconfig.json` 来实现：

```json
{
  // ...
  "noUncheckedIndexedAccess": true
}
```

此时，我们会在代码阶段就得到错误提示，这要求我们更安全合理的编码：

```typescript

myObj.foo.push('bar'); // 提示 'myObj.foo' is possibly 'undefined'

myObj.foo?.push('bar'); // 通过 foo? 来安全的访问

if (myObj.foo) { // 先判断是否存在
    myObj.foo.push('bar');
}

if (!myObj.foo) { // 或者为空时先初始化
    myObj.foo = []
}
```

# 17. 按需删除联合类型

要得到一个去掉某个属性的类，可以使用 `Omit` 来实现：

```typescript
type Test = {
    a: number;
    b: string;
    c: Date;
}

type WithoutC = Omit<Test, 'b'> // { a: number, c: Date }
```

但如果有一个联合类型，要去掉指定项的话，用 `Omit` 就不行了：

```typescript
type Letters = 'a' | 'b' | 'c'

type WithoutC = Omit<Letters, 'b'> // 会得到一个枚举了字符串所有方法的类
```

此时可以这样来实现效果：

```typescript
type RemoveC<TType> = TType extends 'c' ? never : TType

type WithoutC = RemoveC<Letters> // 得到一个正确的联合类型："a" | "b"
```

更进一步，像 `Omit<T, K>` 一样实现一个去掉指定项的类：

```typescript
type RemoveAny<TType, RType> = TType extends RType ? never : TType

type WithoutB = RemoveAny<Letters, 'b'> // "a" | "c"
```

# 18. asserts

```typescript
declare global {
    function postFn(userId: string, title: string): void
}

export class SDK {
    constructor(public loggedInUserId?: string) { }

    createPost(title: string) {
        this.assertUserIsLoggedIn();

        postFn(this.loggedInUserId, title); // 错误提示 SDK.loggedInUserId?: string | undefined 
    }

    assertUserIsLoggedIn() {
        if (!this.loggedInUserId) {
            throw new Error('User is not logged in');
        }
    }
}
```

在上面的代码中，`postFn(this.loggedInUserId, title)` 会有一处错误，告诉你 `loggedInUserId` 可能未定义，但其实我们在 `assertUserIsLoggedIn()` 中有作过判断，并且如果将 `assertUserIsLoggedIn` 方法中的内容移到 `postFn()` 前面时，错误就会消失。这种情况下，可以使用 `asserts` 优化这个行为。

```typescript
assertUserIsLoggedIn(): asserts this is this & { loggedInUserId: string } {
    if (!this.loggedInUserId) {
        throw new Error('User is not logged in');
    }
}
```

此时：

```typescript
createPost(title: string) {
  // 执行前，this.loggedInUserId? 还是string | undefined
  this.assertUserIsLoggedIn();
  // 执行后，因为有了 asserts 断言了 this.loggedInUserId 是 string 类型
  postFn(this.loggedInUserId, title);
}
// 注意 loggedInUserId 必须是 public / protected, private 不行
```

# 19. 合理的返回

# 20. Extract 巧用

有这样一个类：

```typescript
export type Obj = {
    a: 'a',
    a2: 'a2',
    a3: 'hello',
    b: 'b',
    b1: 'b1',
    b2: 'b2',
}
```

如果想要一个以 `a` 开头的联合类型，可以这样写：

```typescript
type ValueOfKeysStartingWithA<T> = {
    [K in Extract<keyof T, `a${string}`>]: T[K];
}[Extract<keyof T, `a${string}`>]

type NewUnion = ValueOfKeysStartingWithA<Obj>  // "a" | "a2" | "hello"
```

对它进行进一步优化，我们可以得到一个自定义规则的 `ValueOfKeysStartingWith` 类型：

```typescript
type ValueOfKeysStartingWith<
    T,
    _ExtractedKeys extends keyof T = Extract<keyof T, `a${string}`>
> = {
    [K in _ExtractedKeys]: T[K]
}[_ExtractedKeys]

type AUnion = ValueOfKeysStartingWith<Obj> // "a" | "a2" | "hello"
type BUnion = ValueOfKeysStartingWith<Obj, Extract<keyof Obj, `b${string}`>> // "b" | "b1" | "b2"
```

# 21. @preconstruct/cli

```shell
安装：
npm i -D @preconstruct/cli

修复：
npx preconstruct fix

编译：
npx preconstruct build
```

修复功能，会根据 `package.json` 中的配置，指向到对应的生成好的 js 文件，如果想要 ESModule 文件，也只需要在 `package.json` 中添加一个 `"module": true` 字段，`fix` 功能会自动指向对应的 js 文件。

需要在 `package.json` 中添加 `file` 属性并将 `dist` 目录添加进去。

Typescript 项目还需要安装 `@babel/preset-typescript`，并在 `.babelrc` 中配置。

还可以安装 `@babel/preset-env`，并在 `.babelrc` 中配置，让生成的 js 使用 ES5 之前的语法。

# 22. const

如果有一个变量

```typescript
export let age = 31;

age = 32;
```

当我们不希望修改它的值是，可以使用 `const`:

```typescript
export const name = 'Matt';

// name = 'lala'; 不可以修改
```

但如果现在有一个数组:

```typescript
export const tsPeople = [
    'Andarist',
    'Titian',
    'Devansh',
    'Anurag',
];

tsPeople[0] = 'Hello';
```

如果我们也希望数组中的每一项也不可修改时，可以这样写:

```typescript
export const tsPeople = [
    'Andarist',
    'Titian',
    'Devansh',
    'Anurag',
] as const;

// tsPeople[0] = 'Hello'; 会提示你该属性为 read-only
```

同样的也可以用在 `object` 上：

```typescript
export const moreTsPeople = {
    'Andarist': 'Andarist',
    'Titian': 'Titian',
    'Devansh': 'Devansh',
    'Anurag': 'Anurag',
    arr: [1],
    obj: {
        a: 'a',
        b: 'b',
    }
} as const;

// moreTsPeople.Andarist = 'Whatever'; 该属性为 read-only
// moreTsPeople.arr[0] = 13;
// moreTsPeople.obj.b = 'str';
```

特别要注意的是，`arr` 和 `obj` 也是只读的。

# 23. undefined 注意事项

```typescript
interface UserInfo1 {
    name: string;
    role?: "admin";
}

interface UserInfo2 {
    name: string;
    role: "admin" | undefined;
}

export const createUser1 = (userInfo: UserInfo1) => { };

createUser1({
    name: 'Matt'
});

createUser1({
    name: 'David',
    role: 'admin',
});

export const createUser2 = (userInfo: UserInfo2) => { };

createUser1({
    name: 'Matt',
    role: undefined,
});

createUser1({
    name: 'David',
    role: 'admin',
});
```

虽然 `UserInfo1` 和 `UserInfo2` 从概念上来讲是相同的，但是 `UserInfo2` 一般会被用在需要明确告知使用者这里是需要一个 `role` 属性的，即使它是 `undefined`。

# 24.

# 25. 练习

```typescript
export interface ColorVariants {
    primary: 'blue';
    secondary: 'red';
    tertiary: 'green';
}

type PrimaryColor = ColorVariants['primary']; // blue

type NonPrimaryColor = ColorVariants['secondary' | 'tertiary']; // red | green

type EveryColor = ColorVariants[keyof ColorVariants]; // blue | red | green

type Letters = ['a', 'b', 'c'];

type AOrB = Letters[0 | 1]; // a | b

type Letter = Letters[number]; // a | b | c

interface UserRoleConfig {
    user: ['view', 'create', 'update'];
    superAdmin: ['view', 'create', 'update', 'delete'];
}

type Role = UserRoleConfig[keyof UserRoleConfig][number]; // view | create | update | delete
```