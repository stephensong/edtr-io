import hast from 'hastscript'
import {
  serializePlugin,
  convertPluginToHast,
  convertValueToHast
} from '../src'

describe('Conversion of editor plugins to XML and back', () => {
  /*
   * ## Basics
   *
   * The function `pluginToXML()` converts an edtor plugin into a XML string
   * which represents this plugin. With `xmlToPlugin()` this XML string can be
   * converted back into an editor plugin representation.
   *
   * For the serialization the function `pluginStateToXml` is used to
   * convert an editor plugin state recursively into an XML tree.
   *
   * ## Conversion of plugin states and plugins
   *
   * The serialization and deserialization of a plugin or plugin state is
   * recursively defined by the rules which are defined in this test suite.
   *
   * ## Conversion for values of primitive data types
   *
   * A value `value` whose type `type` is one of the primitive data types
   * `number`, `boolean` or `string` is represented by the markup
   * `<type>value</type>`. For example the number 42 is represnted by
   * `<number>42</number>.
   */
  describe.each([
    [42, '<number>42</number>'],
    [-2.5, '<number>-2.5</number>'],
    [1000, '<number>1000</number>'],
    [true, '<boolean>true</boolean>'],
    [false, '<boolean>false</boolean>'],
    ['hello world', '<string>hello world</string>'],
    ['a&b', '<string>a&amp;b</string>'],
    ['', '<string></string>']
  ])('Primitive data %p is represented by %p', (value, markup) => {
    test.todo(`Serialization of ${value} is ${markup}`)
    test.todo(`Deserialization of ${markup} is ${value}`)
  })

  /*
   * ## Conversion of strings with whitespaces
   *
   * Trailing an preceeding whitespaces of an XML text node is ignored.
   * For example the following element is the same as `<number>42</number>`:
   *
   * ```
   * <number>
   *   42
   * </number>
   * ```
   *
   * An exception is the `<string>...</sting>` element which uses all characters
   * of the string.
   */
  describe.each([
    [' ', '<string> </string>'],
    ['\t \t', '<string>\t \t</string>'],
    ['\nhello world\n\t', '<string>\nhello world\n\t']
  ])('%# Conversion string with whitespaces', (value, markup) => {
    test.todo(`Serialization`)
    test.todo(`Deserialization`)
  })

  /*
   * ## Conversion of lists
   *
   * A list is converted to an element `<list>...</list>`. The elements of the
   * list are the children of the xml element. For example `[1,true,'hello']`
   * is converted to
   *
   * ```
   * <list>
   *   <number>1</number>
   *   <boolean>true</boolean>
   *   <string>hello</string>
   * </list>
   * ```
   */
  describe.each([
    [
      [1, true, 'hello'],
      `<list>
         <number>1</number>
         <boolean>true</boolean>
         <string>hello</string>
       </list>`
    ],
    [[-2.3], '<list><number>-2.3</number></list>'],
    [[], '<list></list>'],
    [
      [[true,''], []],
      `<list>
         <list>
           <boolean>true</boolean>
           <string></string>
         </list>
         <list></list>
       </list>`
    ]
  ])('%# list conversion', (value, markup) => {
    test.todo('serialization')
    test.todo('deserialization')
  })

  /*
   * ## Conversion of dictionaries / objects
   *
   * A object is converted to an XML element `<object>...</object>`. The
   * properties of the object become children of this element. The name of these
   * children are of the form `propertyName.type`. For example the dictionary
   * `{ foo: 42, bar: 'hello' }` is represented by
   *
   * ```
   * <object>
   *   <foo.int>42</foo.int>
   *   <bar.string>hello</bar.string>
   * </object>
   * ```
   */
  describe.each([
    [
      { foo: 42, bar: 'hello' },
      `<object>
         <foo.int>42</foo.int>
         <bar.string>hello</bar.string>
       </object>`
    ],
    [{}, '<object></object>']
    [
      { a: { b: 'hello' }, c: [ ' ', {} ], d: true },
      `<object>
         <a.object>
           <b.string>hello</b.string>
         </a.object>
         <c.list>
           <string> </string>
           <object></object>
         <d.boolean>true</d.boolean>
       </object>`
    ]
  ])('%# object conversion', (value, markup) => {
    test.todo('serialization')
    test.todo('deserialization')
  })

  /*
   * ## Conversion of list properties
   *
   * By listing a property more than once in an `<object>`-element the property
   * is converted into a list. For example `{ foo: ['hello', -23] }` becomes
   *
   * ```
   * <object>
   *   <foo.string>hello</foo.string>
   *   <foo.number>-23</foo.number>
   * </object>
   * ```
   *
   * Note that this rule can only be applied to lists at least two elements.
   */
  describe.each([
    [
      { foo: ['hello', -23] },
      `<object>
         <foo.string>hello</foo.string>
         <foo.number>-23</foo.number>
       </object>`
    ],
    [
      { foo: false, bar: [ { a: 42 }, 42, 'hello' ], baz: [ 23 ] },
      `<object>
         <foo.boolean>false</foo.boolean>
         <bar.object>
          <a.number>42</a.number>
         </bar.object>
         <bar.number>42</bar.number>
         <bar.string>hello</bar.string>
         <baz.list>
          <number>23</number>
        </baz.list>
      </object>`
    ]
  ])('%# object conversion with list properties', (value, markup) => {
    test.todo('serialization')
    test.todo('deserialization')
  })

  /*
   * ## Conversion of stateless plugin
   *
   * A stateless plugin `{ plugin: '<name>' }` is represented by
   * `<plugin:name.undefined></plugin:name.undefined>` or by
   * `<plugin:name></plugin:name>`. In case the name of the plugin is
   * not another type (`number`, `boolean`, `string`, `list` or `object`) the
   * prefix `plugin:` can be omited. Thus `<foo></foo>` represents
   * `{ plugin: 'foo' }`.
   */
  describe('conversion of stateless plugins', () => {
    test.todo('conversion of <plugin:foo.undefined></plugin:foo.undefined>')
    test.todo('conversion of <plugin:foo></plugin:foo>')
    test.todo('conversion of <plugin:string></plugin:string>')
    test.todo('conversion of <foo></foo>')
  })

  /*
   * ## Conversion of stateful plugins
   *
   * A stateful plugin `{ plugin: '<name>', state: <stateValue> }` whose state
   * property is of type `stateType` is represented by the XML element
   * `<plugin:name.stateType>...</plugin:name.stateType>` whereby this element
   * represents `stateValue` as in the above rules. Thus it is the same
   * XML element as the conversion of `stateValue` whereby the tag name
   * has the prefix `plugin:name.`. The prefix `plugin:` can be omited when
   * `name` is not the name of another plugin.
   */



   // Complex examples
   // * list with objects, plugins
   // * einfache Objects testen, with stateless plugins
})

// Examples for serialization of plugin states
const serializePluginExamples = [
  // Stateful plugins with state of primitive data type
  [
    { plugin: 'NumberStatePlugin', state: 42 },
    '<NumberStatePlugin>42</NumberStatePlugin>'
  ],
  [{ plugin: 'boolean', state: false }, '<boolean>false</boolean>'],
  [
    { plugin: 'string-plugin', state: 'Hello World' },
    '<string-plugin>Hello World</string-plugin>'
  ]
]

describe('serializePlugin()', () => {
  test.each(serializePluginExamples)('Serialize plugin %j', (plugin, markup) =>
    expect(serializePlugin(plugin)).toEqual(markup)
  )
})

describe('convertPluginToHast()', () => {
  test.each([
    [{ plugin: 'hello', state: 42 }, hast('hello', '42')],
    [{ plugin: 'my-plugin', state: false }, hast('my-plugin', 'false')],
    [
      { plugin: 'string', state: 'string state' },
      hast('string', 'string state')
    ]
  ])('Convert plugin %j to hast', (plugin, result) =>
    expect(convertPluginToHast(plugin)).toEqual(result)
  )
})

describe('convertValueToHast()', () => {
  test.each`
    tagName         | value            | result
    ${'foo'}        | ${42}            | ${hast('foo', '42')}
    ${'boolean'}    | ${true}          | ${hast('boolean', 'true')}
    ${'str-plugin'} | ${'hello world'} | ${hast('str-plugin', 'hello world')}
  `(
    'Convert value "$value" with tag name "$tagName"',
    ({ tagName, value, result }) =>
      expect(convertValueToHast(tagName, value)).toEqual(result)
  )
})