
var assert = require('assert')
  , ref = require('ref')
  , Struct = require('ref-struct')
  , Union = require('../')
  , bindings = require('bindings')({ module_root: __dirname, bindings: 'native_tests' })

describe('Union', function () {

  afterEach(gc)

  it('should be a function', function () {
    assert.equal('function', typeof Union)
  })

  it('should return a union constuctor function', function () {
    var U = Union()
    assert.equal('function', typeof U)
  })

  it('should throw when the same field name is speicified more than once', function () {
    var U = Union({ a: ref.types.int })
    assert.throws(function () {
      U.defineProperty('a', ref.types.int)
    })
  })

  it('should work in a simple case', function () {
    var SimpleUnion = Union({
        'ival': ref.types.int
      , 'fval': ref.types.float
    })
    assert.equal(4, SimpleUnion.size)
    assert.equal(4, SimpleUnion.alignment)

    var su1 = new SimpleUnion({ ival: 10, fval: 1.5 })
    assert.equal(1.5, su1.fval)

    var su2 = new SimpleUnion({ fval: 1.5, ival: 10 })
    assert.equal(10, su2.ival)
  })

  // TODO: Complex example and Struct within Union / Union within Struct

  describe('string type identifiers', function () {

    it('should work with string type identifiers', function () {
      var U = Union({
          'ival': 'int'
        , 'lval': 'long'
        , 'sval': 'string'
      })

      assert.strictEqual(ref.types.int, U.fields.ival.type)
      assert.strictEqual(ref.types.long, U.fields.lval.type)
      assert.strictEqual(ref.coerceType('string'), U.fields.sval.type)
    })

  })

  describe('ref(), deref()', function () {

    it('should work to ref() and then deref() 1 level deep', function () {
      var U = Union({ d: 'double' })
      var u = new U({ d: Math.PI })
      var uref = u.ref()
      assert(Buffer.isBuffer(uref))
      var _u = uref.deref()
      assert(_u instanceof U)
      assert.equal(Math.PI, _u.d)
    })

  })

  describe('offsets and sizeofs', function () {

    function test (unionType, testNumber) {
      describe('Union test' + testNumber, function () {
        var expectedSize = bindings['test' + testNumber + ' sizeof']
        var expectedAlignment = bindings['test' + testNumber + ' alignof']
        it('should have its `size` matching sizeof(): ' + expectedSize, function () {
          assert.equal(expectedSize, unionType.size, 'test' + testNumber +
            ': sizeof(): expected ' + unionType.size + ' to equal ' + expectedSize)
        })
        it('should have its `alignment` matching __alignof__(): ' + expectedAlignment, function () {
          assert.equal(expectedAlignment, unionType.alignment, 'test' + testNumber +
            ': __alignof__(): expected ' + unionType.alignment + ' to equal ' + expectedAlignment)
        })
        Object.keys(unionType.fields).forEach(function (name) {
          if ('skip' == name) return;
          // these tests just verify the assumption that the
          // offset of every field is always 0
          it('should have a offsetof() of 0 for "' + name + '"', function () {
            var offset = 0
            var expectedOffset = bindings['test' + testNumber + ' offsetof ' + name]
            assert.strictEqual(expectedOffset, offset, 'test' + testNumber + ': offsetof('
                + name + '): expected ' + offset + ' to equal ' + expectedOffset)
          })
        })
      })
    }

    var test1 = Union({
        'a': ref.types.char
      , 'b': ref.types.short
    })
    test(test1, 1)

    var test2 = Union({
        'a': ref.types.char
      , 'b': ref.types.int
    })
    test(test2, 2)

    var test3 = Union({
        'a': ref.types.char
      , 'b': ref.types.short
      , 'c': ref.types.int
    })
    test(test3, 3)

    var test4 = Union({
        'a': Struct({
            'a': ref.types.char
          , 'b': ref.types.short
          , 'c': ref.types.int
          })
      , 'b': ref.types.int
    })
    test(test4, 4)

    var test5 = Union({
        'a': ref.types.double
      , 'b': ref.types.char
    })
    test(test5, 5)

    var test6 = Union({
        'a': test1
      , 'b': ref.types.char
    })
    test(test6, 6)

    var test7 = Union({
        'a': ref.types.char
      , 'b': ref.types.char
      , 'skip': ref.types.char
      , 'c': ref.types.short
      , 'd': ref.types.char
    })
    test(test7, 7)

    var test8 = Union({
        'a': ref.types.int
      , 'b': ref.types.double
      , 'c': ref.types.int
    })
    test(test8, 8)

  })

})
