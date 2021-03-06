import plisp from '../src/plisp.js'


var lsp = new plisp()
lsp._out = ''
lsp.logger = (val) => lsp._out += val
lsp.maxStack = 1000

test('lisp 1 + 1 to equal 2', () => {
  let res = lsp.run('(+ 1 1)')
  return res.then((res) => {
    expect(res).toBe(2)
  })
});

test('nested unformated lisp to correct value', () => {
  let res = lsp.run('(  - 20 (+ 1 (* 3 3 ) 2))')
  return res.then((res) => {
    //expect(res).toBe(2)
    expect(res).toBe(8)
  })
});

test('async functions', () => {
  // set a async lisp function
  lsp.op.get = (...x) => {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        resolve(10)
      }, 10)
    })
  }

  let res = lsp.run('(+ 1 (get))')
  return res.then((res) => {
    expect(res).toBe(11)
  })
});

test('NotFoundException when try to create unknow element', () => {
  let res = lsp.run('(xxx)')
  return res.then((res) => {
    // cant get here
    expect(false).toBe(true)
  }).catch((res) => {
    expect(res.name).toBe('NotFoundException')
  })
});

test('to be neste lists', () => {
  let res = lsp.run('(list 1 2 3 (list a b c))')
  return res.then((res) => {
    expect(res).toEqual([ '1', '2', '3', [ 'a', 'b', 'c' ] ])    
  })
});

test('to float list', () => {
  let res = lsp.run('(float 3 4 5)')
  return res.then((res) => {
    expect(res).toEqual([3, 4, 5])
  })
});

test('if letter character to be true', () => {
  let res = lsp.run('(if a 1 2)')
  return res.then((res) => {
    expect(res).toEqual('1')
  })
});

test('if zero character to be false', () => {
  let res = lsp.run('(if 0 1 2)')
  return res.then((res) => {
    expect(res).toEqual('2')
  })
});

test('if non zero character to be true', () => {
  let res = lsp.run('(if 1 1 2)')
  return res.then((res) => {
    expect(res).toEqual('1')
  })
});

test('if false without else to be null', () => {
  let res = lsp.run('(if 0 1)')
  return res.then((res) => {
    expect(res).toBe(null)
  })
});

test('if true without else to be the value', () => {
  let res = lsp.run('(if 1 1)')
  return res.then((res) => {
    expect(res).toBe('1')
  })
});

test('if true without else to be the value', () => {
  let res = lsp.run('(if 1 1)')
  return res.then((res) => {
    expect(res).toBe('1')
  })
});

test('to evaluate the true condition', () => {
  let res = lsp.run('((if (+ 0 1) (setvar a 1) (setvar b 2))(ctx))')
  return res.then((res) => {
    expect(res).toEqual({a: '1'})
  })
});

test('to evaluate the else', () => {
  let res = lsp.run('((if (- 1 1) (setvar a 1) (setvar b 2))(ctx))')
  return res.then((res) => {
    expect(res).toEqual({b: '2'})
  })
});

test('to bool true', () => {
  let res = lsp.run('(bool 1)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('to bool false', () => {
  let res = lsp.run('(bool 0)')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('to bool bool type true', () => {
  let res = lsp.run('(bool (= 1 1))')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('to bool bool type false', () => {
  let res = lsp.run('(bool (= 1 2))')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('print return null and out text', () => {
  let res = lsp.run('(print lala)')
  return res.then((res) => {
    expect(res).toBe(null)
    expect(lsp._out).toBe('lala')
  })
});

test('setvar be the value to x and return ctx', () => {
  let res = lsp.run('((setvar x val)(ctx))')
  return res.then((res) => {
    //console.log(res)
    expect(res).toEqual({x: 'val'})
  })
});

test('dont polute ctx', () => {
  let p1 = lsp.run('((setvar x val)(ctx))')
  return p1.then((res) => {
    expect(res).toEqual({x: 'val'})
    return lsp.run('((setvar y otherval)(ctx))')
  }).then((res) => {
    expect(res).toEqual({y: 'otherval'})
  })
});

test('set array', () => {
  let res = lsp.run('((setvar x (list 1 2 3))(ctx))')
  return res.then((res) => {
    //console.log(res)
    expect(res).toEqual({x: ['1', '2', '3']})
  })
});

test('get the var', () => {
  let res = lsp.run('(getvar x (setvar x 123))')
  return res.then((res) => {
    //console.log(res)
    expect(res).toBe('123')
  })
});

test('get undefined var return null', () => {
  let res = lsp.run('(getvar y (setvar x 123))')
  return res.then((res) => {
    //console.log(res)
    expect(res).toBe(null)
  })
});

test('get the var with sintax sugar', () => {
  let res = lsp.run('((setvar x 123)(&x))')
  return res.then((res) => {
    //console.log(res)
    expect(res).toBe('123')
  })
});

test('true to be equal', () => {
  let res = lsp.run('(= 1 1)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('true to be equal multiple', () => {
  let res = lsp.run('(= 1 1 1)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('false to be equal multiple', () => {
  let res = lsp.run('(= 1 1 2)')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('true to be >', () => {
  let res = lsp.run('(> 2 1 0)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('false to be <', () => {
  let res = lsp.run('(< 1 1 2)')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('true to be <=', () => {
  let res = lsp.run('(<= 1 1 1)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('false to be <=', () => {
  let res = lsp.run('(<= 2 1 2)')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('true to be >=', () => {
  let res = lsp.run('(>= 3 2 1)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('true to be >= two itens', () => {
  let res = lsp.run('(>= 3 2)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('false to be >=', () => {
  let res = lsp.run('(>= 1 2 1)')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('true to be /=', () => {
  let res = lsp.run('(/= 1 2)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('false to be /=', () => {
  let res = lsp.run('(/= 2 2)')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('false to be all different', () => {
  let res = lsp.run('(/= 2 1 2)')
  return res.then((res) => {
    expect(res).toBe(false)
  })
});

test('true to be all different', () => {
  let res = lsp.run('(/= 1 2 3)')
  return res.then((res) => {
    expect(res).toBe(true)
  })
});

test('true to be all combinations', () => {
  let res = lsp.run('(combine 1 2 3)')
  return res.then((res) => {
    expect(res).toEqual([ [ '1', '2' ], [ '1', '3' ], [ '2', '3' ] ])
  })
});

test('true to be the combination', () => {
  let res = lsp.run('(combine 1 2)')
  return res.then((res) => {
    expect(res).toEqual([ [ '1', '2' ] ])
  })
});

test('to run multiple', () => {
  let res = lsp.run(`(((setvar x a)(setvar y b))(ctx))`)
  return res.then((res) => {
    expect(res).toEqual({'x': 'a', 'y': 'b'})
  })
});

test('to run multiple without run', () => {
  let res = lsp.run(`(( (setvar x a) (setvar y b) ) (ctx))`)
  return res.then((res) => {
    expect(res).toEqual({'x': 'a', 'y': 'b'})
  })
});


test('to incf', () => {
  let res = lsp.run(`(((setvar x 1) (incf x 2))(ctx))`)
  return res.then((res) => {
    expect(res).toEqual({'x': 3})
  })
});

test('to incf multiple', () => {
  let res = lsp.run(`(((setvar x 1) (incf x 2 2))(ctx))`)
  return res.then((res) => {
    expect(res).toEqual({'x': 5})
  })
});


test('to incf non existing var returning NaN', () => {
  let res = lsp.run(`(((incf x 2))(ctx))`)
  return res.then((res) => {
    expect(res).toEqual({'x': NaN})
  })
});

test('to incf return its before value', () => {
  let res = lsp.run(`(((setvar x 0) (setvar y (incf x 1)) )(ctx))`)
  return res.then((res) => {
    expect(res).toEqual({ x: 1, y: 0 })
  })
});

test('to decf', () => {
  let res = lsp.run(`(((setvar x 1) (decf x 2))(ctx))`)
  return res.then((res) => {
    expect(res).toEqual({'x': -1})
  })
});

test('to set r false', () => {
  let res = lsp.run(`(((setvar x 0) (setvar r (< (getvar x (incf x 5)) 5)))(ctx))`)
  return res.then((res) => {
    expect(res).toEqual({ x: 5, r: false })
  })
});

test('sleep the specified time', () => {
  let ini = Date.now()
  let res = lsp.run(`((sleep 50) (setvar x ok))`)
  return res.then((res) => {
    expect(Date.now() - ini).toBeGreaterThanOrEqual(50)
  })
});


test('ctx unexpected arg', () => {
  let res = lsp.run(`((setvar x a)(ctx unexpected))`)
  return res.then((res) => {
    // cant get here
    expect(false).toBe(true)
  }).catch((err) => {
    expect(err).toBeInstanceOf(lsp.UnexpectedArgument)
  })
});

test('to get nth of list', () => {
  let res = lsp.run(`(nth 1 (list 1 2 3))`)
  return res.then((res) => {
    expect(res).toEqual('2')
  })
});

test('to get length of list', () => {
  let res = lsp.run(`(len (list 1 2 3))`)
  return res.then((res) => {
    expect(res).toEqual(3)
  })
});

test('to get length of lists', () => {
  let res = lsp.run(`(len (list 1 2 3) (float 4 5 6))`)
  return res.then((res) => {
    expect(res).toEqual(6)
  })
});

test('to get nth of list from codition', () => {
  let res = lsp.run(`(nth 1 (if (> 1 2) (float 1 2 3) (float 4 5 6)))`)
  return res.then((res) => {
    expect(res).toEqual(5)
  })
});

test('to invert array', () => {
  let res = lsp.run(`(invert (float 1 2 3))`)
  return res.then((res) => {
    expect(res).toEqual([3,2,1])
  })
});

test('to throw erro when try convert list to float', () => {
  let res = lsp.run(`(float (list 1 (list 2) 3))`)
  return res.then((res) => {
    // cant get here
    expect(true).toBe(false)
  }).catch((err) => {
    expect(err).toBeInstanceOf(lsp.InvalidType)
  })
});

test('to invert array', () => {
  let res = lsp.run(`(invert (list (float 1 1) (float 2 2) (float 3 3)))`)
  return res.then((res) => {
    expect(res).toEqual([ [ 3, 3 ], [ 2, 2 ], [ 1, 1 ] ])
  })
});

test('to float scalar', () => {
  let res = lsp.run(`(f 123)`)
  return res.then((res) => {
    expect(res).toBe(123)
  })
});

test('get the 0', () => {
  let res = lsp.run(`(&a)`, {a: 0})
  return res.then((res) => {
    expect(res).toBe(0)
  })
});

test('accept callback', () => {
  let ctx2 = {}
  let cb = (p, i) => p.then((res) => ctx2[i] = res)

  let res = lsp.run(`((setvar a 3)(setvar b 4)(setvar c 5))`, {}, cb)
  return res.then((res) => {
    expect(res).toBe('5')
    expect(ctx2).toEqual({ '0': '3', '1': '4', '2': '5' })
  })
});
