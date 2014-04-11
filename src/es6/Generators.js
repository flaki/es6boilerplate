/*
Generators

Generators simplify iterator-authoring using function* and yield. A function declared as function* returns a Generator instance. Generators are subtypes of iterators which include additional next and throw. These enable values to flow back into the generator, so yield is an expression form which returns a value (or throws).

Note: Can also be used to enable ‘await’-like async programming, see also ES7 await proposal.

var fibonacci = {
  [Symbol.iterator]: function*() {
    var pre = 0, cur = 1;
    for (;;) {
      var temp = pre;
      pre = cur;
      cur += temp;
      yield cur;
    }
  }
}

for (var n of fibonacci) {
  // truncate the sequence at 1000
  if (n > 1000)
    break;
  print(n);
}

The generator interface is (using TypeScript type syntax for exposition only):

interface Generator extends Iterator {
    next(value?: any): IteratorResult;
    throw(exception: any);
}
*/