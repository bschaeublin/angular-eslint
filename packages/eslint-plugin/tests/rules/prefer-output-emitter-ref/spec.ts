import { RuleTester } from '@angular-eslint/test-utils';
import rule, { RULE_NAME } from '../../../src/rules/prefer-output-emitter-ref';
import { invalid, valid } from './cases';

const ruleTester = new RuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid,
  invalid,
});
