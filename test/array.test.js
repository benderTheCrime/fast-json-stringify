'use strict'

const test = require('tap').test
const validator = require('is-my-json-valid')
const build = require('..')

function buildTest (schema, toStringify) {
  test(`render a ${schema.title} as JSON`, (t) => {
    t.plan(5)

    const validate = validator(schema)
    const stringify = build(schema)
    const stringifyUgly = build(schema, {uglify: true})
    const output = stringify(toStringify)
    const outputUglify = stringifyUgly(toStringify)

    t.deepEqual(JSON.parse(output), toStringify)
    t.deepEqual(JSON.parse(outputUglify), toStringify)
    t.equal(output, JSON.stringify(toStringify))
    t.equal(outputUglify, JSON.stringify(toStringify))
    t.ok(validate(JSON.parse(output)), 'valid schema')
  })
}

buildTest({
  'title': 'string array',
  'type': 'object',
  'properties': {
    'ids': {
      'type': 'array',
      'items': {
        'type': 'string'
      }
    }
  }
}, {
  ids: ['test']
})

buildTest({
  'title': 'number array',
  'type': 'object',
  'properties': {
    'ids': {
      'type': 'array',
      'items': {
        'type': 'number'
      }
    }
  }
}, {
  ids: [1]
})

buildTest({
  'title': 'mixed array',
  'type': 'object',
  'properties': {
    'ids': {
      'type': 'array',
      'items': [
        {
          'type': 'null'
        },
        {
          'type': 'string'
        },
        {
          'type': 'integer'
        },
        {
          'type': 'number'
        },
        {
          'type': 'boolean'
        },
        {
          'type': 'object',
          'properties': {
            'a': {
              'type': 'string'
            }
          }
        },
        {
          'type': 'array',
          'items': {
            'type': 'string'
          }
        }
      ]
    }
  }
}, {
  ids: [null, 'test', 1, 1.1, true, {a: 'test'}, ['test']]
})
