# Aurgy Backend - Testing

`/test/` contains all our tests. We currently use `jest` to perform all of our
unit tests.

Writing tests are annoying, but finding bugs in production is embarrassing. Whenever
you are done writing a utility function or any core feature that can be mocked, it
is always a good idea to write a few tests.

## Testing 101

1. Create a file in `/test/` that matches the file you are trying to test.
2. Create tests within that file using the keywords `describe` and `test`.
    * `describe` is a function that is used to aggregate tests together
    * `test` is a function that is the actual test

An example test suite:

```ts
describe('Test Feature', () => {
  test('works in condition a', () => {
    // test code here
  });

  test('works in condition b', () => {
    // test code here
  });
});
```

Notice how the tests are organized in a sentence. Jest will append your descriptors
together when displaying your tests, i.e. `Test Features works in condition a`.

When writing your test, try to follow a clear model to show what you are testing.
A good model for that is the `GIVEN/WHEN/THEN` model.

```ts
test('testing condition a', () => {
  // GIVEN
  // Some intial condition

  // WHEN
  // Actions that are applied on the condition

  // THEN
  // The expectation or assertion to verify the logic
});
```

