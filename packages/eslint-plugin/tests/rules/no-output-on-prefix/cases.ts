import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import type {
  MessageIds,
  Options,
} from '../../../src/rules/no-output-on-prefix';

const messageId: MessageIds = 'noOutputOnPrefix';

export const valid: readonly (string | ValidTestCase<Options>)[] = [
  `class Test {}`,
  `
    @Page({
      outputs: ['on', onChange, \`onLine\`, 'on: on2', 'offline: on', ...onCheck, onOutput()],
    })
    class Test {}
    `,
  `
    @Component()
    class Test {
      on = new EventEmitter();
    }
    `,
  `
    @Directive()
    class Test {
      @Output() buttonChange = new EventEmitter<'on'>();
    }
    `,
  `
    @Directive()
    class Test {
      buttonChange = output<'on'>();
    }
    `,
  `
    @Component()
    class Test {
      @Output() On = new EventEmitter<{ on: onType }>();
    }
    `,
  `
    @Component()
    class Test {
      On = output<{ on: onType }>();
    }
    `,
  `
    @Directive()
    class Test {
      @Output(\`one\`) ontype = new EventEmitter<{ bar: string, on: boolean }>();
    }
    `,
  `
    @Directive()
    class Test {
      ontype = output<{ bar: string, on: boolean }>({ alias: \`one\` });
    }
    `,
  `
    @Component()
    class Test {
      @Output('oneProp') common = new EventEmitter<ComplextOn>();
    }
    `,
  `
    @Component()
    class Test {
      common = output<ComplextOn>({ alias: 'oneProp' });
    }
    `,
  `
    @Directive()
    class Test<On> {
      @Output() ON = new EventEmitter<On>();
    }
    `,
  `
    @Directive()
    class Test<On> {
      ON = output<On>();
    }
    `,
  `
    const on = 'on';
    @Component()
    class Test {
      @Output(on) touchMove: EventEmitter<{ action: 'on' | 'off' }> = new EventEmitter<{ action: 'on' | 'off' }>();
    }
    `,
  `
    const on = 'on';
    @Component()
    class Test {
      touchMove = output<{ action: 'on' | 'off' }>({ alias: on });
    }
    `,
  `
    const test = 'on';
    const on = 'on';
    @Directive()
    class Test {
      @Output(test) [on]: EventEmitter<OnTest>;
    }
    `,
  `
    const test = 'on';
    const on = 'on';
    @Directive()
    class Test {
      [on] = output<OnTest>({ alias: test });
    }
    `,
  `
    @Component({
      selector: 'foo',
      'outputs': [\`test: foo\`]
    })
    class Test {}
    `,
  `
    @Directive({
      selector: 'foo',
      ['outputs']: [\`test: foo\`]
    })
    class Test {}
    `,
  `
    @Component({
      'selector': 'foo',
      [\`outputs\`]: [\`test: foo\`]
    })
    class Test {}
    `,
  `
    @Directive({
      selector: 'foo',
    })
    class Test {
      @Output() get 'getter'() {}
    }
    `,
];

export const invalid: readonly InvalidTestCase<MessageIds, Options>[] = [
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if `outputs` metadata property is named "on" in `@Component`',
    annotatedSource: `
        @Component({
          outputs: ['on']
                    ~~~~
        })
        class Test {}
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if `outputs` metadata property is `Literal` and aliased as "on" in `@Directive`',
    annotatedSource: `
        @Directive({
          inputs: [onCredit],
          'outputs': [onLevel, \`test: on\`, onFunction()],
                               ~~~~~~~~~~
        })
        class Test {}
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if `outputs` metadata property is computed `Literal` and named "onTest" in `@Component`',
    annotatedSource: `
        @Component({
          ['outputs']: ['onTest: test', ...onArray],
                        ~~~~~~~~~~~~~~
        })
        class Test {}
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if `outputs` metadata property is computed `TemplateLiteral` and named "onTest" in `@Directive`',
    annotatedSource: `
        @Directive({
          [\`outputs\`]: ['onTest: test', ...onArray],
                        ~~~~~~~~~~~~~~
        })
        class Test {}
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if output decorator property is named "on" in `@Component`',
    annotatedSource: `
        @Component()
        class Test {
          @Output() on: EventEmitter<any> = new EventEmitter<{}>();
                    ~~
        }
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if output function property is named "on" in `@Component`',
    annotatedSource: `
        @Component()
        class Test {
          on = output();
          ~~
        }
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if output decorator property is named with "\'on\'" prefix in `@Directive`',
    annotatedSource: `
        @Directive()
        class Test {
          @Output() @Custom('on') 'onPrefix' = new EventEmitter<void>();
                                  ~~~~~~~~~~
        }
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if output function property is named with "\'on\'" prefix in `@Directive`',
    annotatedSource: `
        @Directive()
        class Test {
          'onPrefix' = output();
          ~~~~~~~~~~
        }
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if output decorator property is aliased as "`on`" in `@Component`',
    annotatedSource: `
        @Component()
        class Test {
          @Custom() @Output(\`on\`) _on = getOutput();
                            ~~~~
        }
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if output function property is aliased as "`on`" in `@Component`',
    annotatedSource: `
        @Component()
        class Test {
          _on = output({ alias: \`on\` });
                                ~~~~
        }
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if output decorator property is aliased with "on" prefix in `@Directive`',
    annotatedSource: `
        @Directive()
        class Test {
          @Output('onPrefix') _on = (this.subject$ as Subject<{on: boolean}>).pipe();
                  ~~~~~~~~~~
        }
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if output function property is aliased with "on" prefix in `@Directive`',
    annotatedSource: `
        @Directive()
        class Test {
          _on = output({ alias: 'onPrefix' });
                                ~~~~~~~~~~
        }
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if output decorator getter is named with "on" prefix in `@Component`',
    annotatedSource: `
        @Component()
        class Test {
          @Output('getter') get 'on-getter'() {}
                                ~~~~~~~~~~~
        }
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if output decorator getter is aliased with "on" prefix in `@Directive`',
    annotatedSource: `
        @Directive()
        class Test {
          @Output(\`onGetter\`) get getter() {}
                  ~~~~~~~~~~
        }
      `,
    messageId,
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if output decorator property is named with prefix "on" and aliased as "on" without `@Component` or `@Directive`',
    annotatedSource: `
        @Injectable()
        class Test {
          @Output('on') onPrefix = this.getOutput();
                  ~~~~  ^^^^^^^^
        }
      `,
    messages: [
      { char: '~', messageId },
      { char: '^', messageId },
    ],
  }),
  convertAnnotatedSourceToFailureCase({
    description:
      'should fail if output function property is named with prefix "on" and aliased as "on" without `@Component` or `@Directive`',
    annotatedSource: `
        @Injectable()
        class Test {
          onPrefix = output({ alias: 'on' });
          ~~~~~~~~                   ^^^^
        }
      `,
    messages: [
      { char: '~', messageId },
      { char: '^', messageId },
    ],
  }),
];
