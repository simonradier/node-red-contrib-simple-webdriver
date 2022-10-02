import * as chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { expect } from 'chai'
import { replaceMustache } from '../../../src/utils/mustache'
chai.should

describe('mustache', function () {
  it('should be possible to remplace a mustache with a msg property', function () {
    const str = 'this is a {{msg.test}}'
    const msg = { test: 'msgtest' }
    const test = replaceMustache(str, msg)
    expect(test).to.be.equal('this is a msgtest')
  })

  it('should be possible to remplace a mustache with an env property', function () {
    process.env.test = 'envtest'
    const str = 'this is a {{env.test}}'
    const msg = { test: 'test' }
    const test = replaceMustache(str, msg)
    expect(test).to.be.equal('this is a envtest')
  })

  it('should be possible to remplace a mustache with two similar msg properties', function () {
    const str = 'this is a {{msg.test}} and {{msg.test}}'
    const msg = { test: 'msgtest' }
    const flow = { test: 'flowtest' }
    const test = replaceMustache(str, msg)
    expect(test).to.be.equal('this is a msgtest and msgtest')
  })

  it('should be possible to remplace a mustache with two different msg properties', function () {
    const str = 'this is a {{msg.test1}} and {{msg.test2}}'
    const msg = { test1: 'msgtest1', test2: 'msgtest2' }
    const test = replaceMustache(str, msg)
    expect(test).to.be.equal('this is a msgtest1 and msgtest2')
  })

  it('should be possible to remplace a mustache with a nested msg property', function () {
    const str = 'this is a {{msg.test1.test2.test3}}'
    const msg = { test1: { test2: { test3: 'nestedmsgtest' } } }
    const test = replaceMustache(str, msg)
    expect(test).to.be.equal('this is a nestedmsgtest')
  })

  it('should be possible to remplace a mustache with a nested and array msg property', function () {
    const str = 'this is a {{msg.test1.test2[0]test3}}'
    const msg = { test1: { test2: [{ test3: 'nestedarraymsgtest' }] } }
    const test = replaceMustache(str, msg)
    expect(test).to.be.equal('this is a nestedarraymsgtest')
  })

  it('should return undefined if the path does not exists', function () {
    const str = 'this is a {{msg.test1.test2.test3.test4}}'
    const msg = { test1: { test2: { test3: 'nestedmsgtest' } } }
    const test = replaceMustache(str, msg)
    expect(test).to.be.equal('this is a undefined')
  })
})
