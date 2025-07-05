import wordStemmingService from './wordStemming'

describe('WordStemmingService', () => {
  describe('getRootWord', () => {
    test('handles irregular plurals correctly', () => {
      expect(wordStemmingService.getRootWord('children')).toBe('child')
      expect(wordStemmingService.getRootWord('people')).toBe('person')
      expect(wordStemmingService.getRootWord('men')).toBe('man')
      expect(wordStemmingService.getRootWord('women')).toBe('woman')
      expect(wordStemmingService.getRootWord('feet')).toBe('foot')
      expect(wordStemmingService.getRootWord('teeth')).toBe('tooth')
    })

    test('handles irregular verbs correctly', () => {
      expect(wordStemmingService.getRootWord('went')).toBe('go')
      expect(wordStemmingService.getRootWord('going')).toBe('go')
      expect(wordStemmingService.getRootWord('goes')).toBe('go')
      expect(wordStemmingService.getRootWord('ran')).toBe('run')
      expect(wordStemmingService.getRootWord('running')).toBe('run')
      expect(wordStemmingService.getRootWord('runs')).toBe('run')
      expect(wordStemmingService.getRootWord('was')).toBe('be')
      expect(wordStemmingService.getRootWord('were')).toBe('be')
      expect(wordStemmingService.getRootWord('being')).toBe('be')
    })

    test('handles comparative and superlative forms', () => {
      expect(wordStemmingService.getRootWord('better')).toBe('good')
      expect(wordStemmingService.getRootWord('best')).toBe('good')
      expect(wordStemmingService.getRootWord('worse')).toBe('bad')
      expect(wordStemmingService.getRootWord('worst')).toBe('bad')
      expect(wordStemmingService.getRootWord('older')).toBe('old')
      expect(wordStemmingService.getRootWord('oldest')).toBe('old')
    })

    test('handles regular -ing endings', () => {
      expect(wordStemmingService.getRootWord('walking')).toBe('walk')
      expect(wordStemmingService.getRootWord('talking')).toBe('talk')
      expect(wordStemmingService.getRootWord('making')).toBe('make')
      expect(wordStemmingService.getRootWord('writing')).toBe('write')
      expect(wordStemmingService.getRootWord('running')).toBe('run') // doubled consonant
      expect(wordStemmingService.getRootWord('swimming')).toBe('swim') // doubled consonant
    })

    test('handles regular -ed endings', () => {
      expect(wordStemmingService.getRootWord('walked')).toBe('walk')
      expect(wordStemmingService.getRootWord('talked')).toBe('talk')
      expect(wordStemmingService.getRootWord('moved')).toBe('move')
      expect(wordStemmingService.getRootWord('used')).toBe('use')
      expect(wordStemmingService.getRootWord('stopped')).toBe('stop') // doubled consonant
      expect(wordStemmingService.getRootWord('planned')).toBe('plan') // doubled consonant
    })

    test('handles -ies and -ied endings', () => {
      expect(wordStemmingService.getRootWord('studies')).toBe('study')
      expect(wordStemmingService.getRootWord('flies')).toBe('fly')
      expect(wordStemmingService.getRootWord('studied')).toBe('study')
      expect(wordStemmingService.getRootWord('tried')).toBe('try')
    })

    test('handles -er and -est endings', () => {
      expect(wordStemmingService.getRootWord('bigger')).toBe('big')
      expect(wordStemmingService.getRootWord('biggest')).toBe('big')
      expect(wordStemmingService.getRootWord('hotter')).toBe('hot')
      expect(wordStemmingService.getRootWord('hottest')).toBe('hot')
      expect(wordStemmingService.getRootWord('faster')).toBe('fast')
      expect(wordStemmingService.getRootWord('fastest')).toBe('fast')
    })

    test('handles -ly endings', () => {
      expect(wordStemmingService.getRootWord('quickly')).toBe('quick')
      expect(wordStemmingService.getRootWord('slowly')).toBe('slow')
      expect(wordStemmingService.getRootWord('happily')).toBe('happy')
      expect(wordStemmingService.getRootWord('easily')).toBe('easy')
    })

    test('handles regular plural -s endings', () => {
      expect(wordStemmingService.getRootWord('cats')).toBe('cat')
      expect(wordStemmingService.getRootWord('dogs')).toBe('dog')
      expect(wordStemmingService.getRootWord('books')).toBe('book')
      expect(wordStemmingService.getRootWord('houses')).toBe('house')
      expect(wordStemmingService.getRootWord('boxes')).toBe('box')
    })

    test('preserves words that should not be stemmed', () => {
      expect(wordStemmingService.getRootWord('business')).toBe('business')
      expect(wordStemmingService.getRootWord('glass')).toBe('glass')
      expect(wordStemmingService.getRootWord('focus')).toBe('focus')
      expect(wordStemmingService.getRootWord('analysis')).toBe('analysis')
    })

    test('handles case insensitivity', () => {
      expect(wordStemmingService.getRootWord('RUNNING')).toBe('run')
      expect(wordStemmingService.getRootWord('Walking')).toBe('walk')
      expect(wordStemmingService.getRootWord('BETTER')).toBe('good')
    })

    test('handles short words correctly', () => {
      expect(wordStemmingService.getRootWord('is')).toBe('be')
      expect(wordStemmingService.getRootWord('am')).toBe('be')
      expect(wordStemmingService.getRootWord('go')).toBe('go')
      expect(wordStemmingService.getRootWord('do')).toBe('do')
    })
  })

  describe('groupWordsByRoot', () => {
    test('groups words by their root forms correctly', () => {
      const wordFrequency = {
        'run': 5,
        'running': 3,
        'runs': 2,
        'ran': 1,
        'walk': 4,
        'walking': 2,
        'walked': 1,
        'good': 3,
        'better': 2,
        'best': 1
      }

      const groups = wordStemmingService.groupWordsByRoot(wordFrequency)

      expect(groups['run']).toEqual({
        rootWord: 'run',
        variants: { 'run': 5, 'running': 3, 'runs': 2, 'ran': 1 },
        totalFrequency: 11,
        mostFrequent: 'run',
        mostFrequentCount: 5
      })

      expect(groups['walk']).toEqual({
        rootWord: 'walk',
        variants: { 'walk': 4, 'walking': 2, 'walked': 1 },
        totalFrequency: 7,
        mostFrequent: 'walk',
        mostFrequentCount: 4
      })

      expect(groups['good']).toEqual({
        rootWord: 'good',
        variants: { 'good': 3, 'better': 2, 'best': 1 },
        totalFrequency: 6,
        mostFrequent: 'good',
        mostFrequentCount: 3
      })
    })

    test('identifies most frequent variant correctly', () => {
      const wordFrequency = {
        'run': 2,
        'running': 5, // This should be the most frequent
        'runs': 1
      }

      const groups = wordStemmingService.groupWordsByRoot(wordFrequency)

      expect(groups['run'].mostFrequent).toBe('running')
      expect(groups['run'].mostFrequentCount).toBe(5)
    })

    test('handles empty word frequency object', () => {
      const groups = wordStemmingService.groupWordsByRoot({})
      expect(groups).toEqual({})
    })
  })

  describe('getWordVariants', () => {
    test('returns all variants of a word sorted by frequency', () => {
      const wordFrequency = {
        'run': 5,
        'running': 3,
        'runs': 2,
        'ran': 1,
        'walk': 4, // Different root, should not be included
        'walking': 2
      }

      const variants = wordStemmingService.getWordVariants('running', wordFrequency)

      expect(variants).toEqual([
        { word: 'run', frequency: 5 },
        { word: 'running', frequency: 3 },
        { word: 'runs', frequency: 2 },
        { word: 'ran', frequency: 1 }
      ])
    })

    test('returns single variant when no other variants exist', () => {
      const wordFrequency = {
        'unique': 3,
        'different': 2
      }

      const variants = wordStemmingService.getWordVariants('unique', wordFrequency)

      expect(variants).toEqual([
        { word: 'unique', frequency: 3 }
      ])
    })

    test('handles word not in frequency object', () => {
      const wordFrequency = {
        'run': 5,
        'running': 3
      }

      const variants = wordStemmingService.getWordVariants('nonexistent', wordFrequency)

      expect(variants).toEqual([])
    })
  })

  describe('edge cases', () => {
    test('handles empty strings', () => {
      expect(wordStemmingService.getRootWord('')).toBe('')
    })

    test('handles single character words', () => {
      expect(wordStemmingService.getRootWord('a')).toBe('a')
      expect(wordStemmingService.getRootWord('I')).toBe('i')
    })

    test('handles words with numbers', () => {
      expect(wordStemmingService.getRootWord('test123')).toBe('test123')
    })

    test('handles words with special characters', () => {
      expect(wordStemmingService.getRootWord("don't")).toBe("don't")
      expect(wordStemmingService.getRootWord('co-worker')).toBe('co-worker')
    })
  })
})
