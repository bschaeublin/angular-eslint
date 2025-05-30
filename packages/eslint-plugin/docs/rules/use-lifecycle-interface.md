<!--

  DO NOT EDIT.

  This markdown file was autogenerated using a mixture of the following files as the source of truth for its data:
  - ../../src/rules/use-lifecycle-interface.ts
  - ../../tests/rules/use-lifecycle-interface/cases.ts

  In order to update this file, it is therefore those files which need to be updated, as well as potentially the generator script:
  - ../../../../tools/scripts/generate-rule-docs.ts

-->

<br>

# `@angular-eslint/use-lifecycle-interface`

Ensures that classes implement lifecycle interfaces corresponding to the declared lifecycle methods. See more at https://angular.dev/style-guide#style-09-01

- Type: suggestion
- 🔧 Supports autofix (`--fix`)

<br>

## Rule Options

The rule does not have any configuration options.

<br>

## Usage Examples

> The following examples are generated automatically from the actual unit tests within the plugin, so you can be assured that their behavior is accurate based on the current commit.

<br>

<details>
<summary>❌ - Toggle examples of <strong>incorrect</strong> code for this rule</summary>

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/use-lifecycle-interface": [
      "error"
    ]
  }
}
```

<br>

#### ❌ Invalid Code

```ts
@Component()
class Test {
  ngOnInit() {
  ~~~~~~~~
  }
}
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/use-lifecycle-interface": [
      "error"
    ]
  }
}
```

<br>

#### ❌ Invalid Code

```ts
import { OnInit } from '@angular/core';

        @Directive()
        class Test extends Component implements OnInit {
          ngOnInit() {}

          ngOnDestroy() {
          ~~~~~~~~~~~
          }
        }
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/use-lifecycle-interface": [
      "error"
    ]
  }
}
```

<br>

#### ❌ Invalid Code

```ts
@Injectable()
class Test {
  ngDoBootstrap() {}
  ~~~~~~~~~~~~~

  ngOnInit() {}
  ~~~~~~~~

  ngOnDestroy() {}
  ~~~~~~~~~~~
}
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/use-lifecycle-interface": [
      "error"
    ]
  }
}
```

<br>

#### ❌ Invalid Code

```ts
@NgModule()
class Test extends Component implements ng.OnInit {
  ngOnInit() {}

  ngOnDestroy() {
  ~~~~~~~~~~~
  }
}
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/use-lifecycle-interface": [
      "error"
    ]
  }
}
```

<br>

#### ❌ Invalid Code

```ts
@NgModule()
class Test extends Component {
  ngOnInit() {
  ~~~~~~~~
  }
}
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/use-lifecycle-interface": [
      "error"
    ]
  }
}
```

<br>

#### ❌ Invalid Code

```ts
@Directive()
class FoobarBase implements OnDestroy {
  ngOnDestroy(): void {
    /* some base logic here */
  }
}

@Component()
class FoobarComponent extends FoobarBase {
  ngOnDestroy(): void {
  ~~~~~~~~~~~
    super.ngOnDestroy();
    /* some concrete logic here */
  }
}
```

</details>

<br>

---

<br>

<details>
<summary>✅ - Toggle examples of <strong>correct</strong> code for this rule</summary>

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/use-lifecycle-interface": [
      "error"
    ]
  }
}
```

<br>

#### ✅ Valid Code

```ts
class Test implements OnInit {
  ngOnInit() {}
}
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/use-lifecycle-interface": [
      "error"
    ]
  }
}
```

<br>

#### ✅ Valid Code

```ts
class Test implements DoBootstrap {
      ngDoBootstrap() {}
    }
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/use-lifecycle-interface": [
      "error"
    ]
  }
}
```

<br>

#### ✅ Valid Code

```ts
class Test extends Component implements OnInit, OnDestroy  {
  ngOnInit() {}

  private ngOnChanges = '';

  ngOnDestroy() {}

  ngOnSmth() {}
}
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/use-lifecycle-interface": [
      "error"
    ]
  }
}
```

<br>

#### ✅ Valid Code

```ts
class Test extends Component implements ng.OnInit, ng.OnDestroy  {
  ngOnInit() {}

  private ngOnChanges = '';

  ngOnDestroy() {}

  ngOnSmth() {}
}
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/use-lifecycle-interface": [
      "error"
    ]
  }
}
```

<br>

#### ✅ Valid Code

```ts
class Test {}
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/use-lifecycle-interface": [
      "error"
    ]
  }
}
```

<br>

#### ✅ Valid Code

```ts
@Directive()
class FoobarBase implements OnDestroy {
  ngOnDestroy(): void {
    /* some base logic here */
  }
}

@Component()
class FoobarComponent extends FoobarBase {
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    /* some concrete logic here */
  }
}
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/use-lifecycle-interface": [
      "error"
    ]
  }
}
```

<br>

#### ✅ Valid Code

```ts
class BaseClass {
  ngOnInit(): void {
    /* base initialization */
  }
}

@Component()
class DerivedComponent extends BaseClass {
  override ngOnInit(): void {
    super.ngOnInit();
    /* derived initialization */
  }
}
```

<br>

---

<br>

#### Default Config

```json
{
  "rules": {
    "@angular-eslint/use-lifecycle-interface": [
      "error"
    ]
  }
}
```

<br>

#### ✅ Valid Code

```ts
@Directive()
class BaseDirective implements OnInit {
  ngOnInit(): void {
    /* base initialization */
  }
}

@Component()
class DerivedComponent extends BaseDirective {
  override ngOnInit(): void {
    super.ngOnInit();
    /* derived initialization */
  }
}
```

</details>

<br>
