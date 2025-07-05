/**
 * Comprehensive Word Stemming Service
 * Handles plurals, verb forms, adjectives, and other word variants
 */

class WordStemmingService {
  constructor() {
    // Common irregular plurals
    this.irregularPlurals = new Map([
      ['children', 'child'], ['people', 'person'], ['men', 'man'], ['women', 'woman'],
      ['feet', 'foot'], ['teeth', 'tooth'], ['mice', 'mouse'], ['geese', 'goose'],
      ['oxen', 'ox'], ['sheep', 'sheep'], ['deer', 'deer'], ['fish', 'fish'],
      ['species', 'species'], ['series', 'series'], ['means', 'means']
    ])

    // Common irregular verbs
    this.irregularVerbs = new Map([
      ['went', 'go'], ['gone', 'go'], ['goes', 'go'], ['going', 'go'],
      ['ran', 'run'], ['running', 'run'], ['runs', 'run'],
      ['came', 'come'], ['coming', 'come'], ['comes', 'come'],
      ['saw', 'see'], ['seen', 'see'], ['seeing', 'see'], ['sees', 'see'],
      ['did', 'do'], ['done', 'do'], ['doing', 'do'], ['does', 'do'],
      ['had', 'have'], ['having', 'have'], ['has', 'have'],
      ['was', 'be'], ['were', 'be'], ['been', 'be'], ['being', 'be'], ['am', 'be'], ['is', 'be'], ['are', 'be'],
      ['said', 'say'], ['saying', 'say'], ['says', 'say'],
      ['got', 'get'], ['gotten', 'get'], ['getting', 'get'], ['gets', 'get'],
      ['made', 'make'], ['making', 'make'], ['makes', 'make'],
      ['took', 'take'], ['taken', 'take'], ['taking', 'take'], ['takes', 'take'],
      ['gave', 'give'], ['given', 'give'], ['giving', 'give'], ['gives', 'give'],
      ['found', 'find'], ['finding', 'find'], ['finds', 'find'],
      ['knew', 'know'], ['known', 'know'], ['knowing', 'know'], ['knows', 'know'],
      ['thought', 'think'], ['thinking', 'think'], ['thinks', 'think'],
      ['felt', 'feel'], ['feeling', 'feel'], ['feels', 'feel'],
      ['left', 'leave'], ['leaving', 'leave'], ['leaves', 'leave'],
      ['told', 'tell'], ['telling', 'tell'], ['tells', 'tell'],
      ['kept', 'keep'], ['keeping', 'keep'], ['keeps', 'keep'],
      ['brought', 'bring'], ['bringing', 'bring'], ['brings', 'bring'],
      ['built', 'build'], ['building', 'build'], ['builds', 'build'],
      ['bought', 'buy'], ['buying', 'buy'], ['buys', 'buy'],
      ['caught', 'catch'], ['catching', 'catch'], ['catches', 'catch'],
      ['chose', 'choose'], ['chosen', 'choose'], ['choosing', 'choose'], ['chooses', 'choose'],
      ['cut', 'cut'], ['cutting', 'cut'], ['cuts', 'cut'],
      ['drew', 'draw'], ['drawn', 'draw'], ['drawing', 'draw'], ['draws', 'draw'],
      ['drove', 'drive'], ['driven', 'drive'], ['driving', 'drive'], ['drives', 'drive'],
      ['ate', 'eat'], ['eaten', 'eat'], ['eating', 'eat'], ['eats', 'eat'],
      ['fell', 'fall'], ['fallen', 'fall'], ['falling', 'fall'], ['falls', 'fall'],
      ['flew', 'fly'], ['flown', 'fly'], ['flying', 'fly'], ['flies', 'fly'],
      ['forgot', 'forget'], ['forgotten', 'forget'], ['forgetting', 'forget'], ['forgets', 'forget'],
      ['grew', 'grow'], ['grown', 'grow'], ['growing', 'grow'], ['grows', 'grow'],
      ['heard', 'hear'], ['hearing', 'hear'], ['hears', 'hear'],
      ['held', 'hold'], ['holding', 'hold'], ['holds', 'hold'],
      ['led', 'lead'], ['leading', 'lead'], ['leads', 'lead'],
      ['learned', 'learn'], ['learnt', 'learn'], ['learning', 'learn'], ['learns', 'learn'],
      ['lost', 'lose'], ['losing', 'lose'], ['loses', 'lose'],
      ['met', 'meet'], ['meeting', 'meet'], ['meets', 'meet'],
      ['paid', 'pay'], ['paying', 'pay'], ['pays', 'pay'],
      ['put', 'put'], ['putting', 'put'], ['puts', 'put'],
      ['read', 'read'], ['reading', 'read'], ['reads', 'read'],
      ['rode', 'ride'], ['ridden', 'ride'], ['riding', 'ride'], ['rides', 'ride'],
      ['sang', 'sing'], ['sung', 'sing'], ['singing', 'sing'], ['sings', 'sing'],
      ['sat', 'sit'], ['sitting', 'sit'], ['sits', 'sit'],
      ['slept', 'sleep'], ['sleeping', 'sleep'], ['sleeps', 'sleep'],
      ['spoke', 'speak'], ['spoken', 'speak'], ['speaking', 'speak'], ['speaks', 'speak'],
      ['spent', 'spend'], ['spending', 'spend'], ['spends', 'spend'],
      ['stood', 'stand'], ['standing', 'stand'], ['stands', 'stand'],
      ['swam', 'swim'], ['swum', 'swim'], ['swimming', 'swim'], ['swims', 'swim'],
      ['taught', 'teach'], ['teaching', 'teach'], ['teaches', 'teach'],
      ['understood', 'understand'], ['understanding', 'understand'], ['understands', 'understand'],
      ['woke', 'wake'], ['woken', 'wake'], ['waking', 'wake'], ['wakes', 'wake'],
      ['wore', 'wear'], ['worn', 'wear'], ['wearing', 'wear'], ['wears', 'wear'],
      ['won', 'win'], ['winning', 'win'], ['wins', 'win'],
      ['wrote', 'write'], ['written', 'write'], ['writing', 'write'], ['writes', 'write']
    ])

    // Common comparative/superlative forms
    this.comparatives = new Map([
      ['better', 'good'], ['best', 'good'],
      ['worse', 'bad'], ['worst', 'bad'],
      ['more', 'much'], ['most', 'much'],
      ['less', 'little'], ['least', 'little'],
      ['further', 'far'], ['furthest', 'far'], ['farther', 'far'], ['farthest', 'far'],
      ['older', 'old'], ['oldest', 'old'], ['elder', 'old'], ['eldest', 'old']
    ])
  }

  /**
   * Get the root word for any given word
   * @param {string} word - The word to find the root for
   * @returns {string} - The root word
   */
  getRootWord(word) {
    const lowerWord = word.toLowerCase()
    
    // Check irregular plurals first
    if (this.irregularPlurals.has(lowerWord)) {
      return this.irregularPlurals.get(lowerWord)
    }

    // Check irregular verbs
    if (this.irregularVerbs.has(lowerWord)) {
      return this.irregularVerbs.get(lowerWord)
    }

    // Check comparatives/superlatives
    if (this.comparatives.has(lowerWord)) {
      return this.comparatives.get(lowerWord)
    }

    // Apply regular stemming rules
    return this.applyStemming(lowerWord)
  }

  /**
   * Apply regular stemming rules
   * @param {string} word - The word to stem
   * @returns {string} - The stemmed word
   */
  applyStemming(word) {
    // Handle common suffixes in order of specificity
    
    // -ies -> -y (studies -> study, flies -> fly)
    if (word.endsWith('ies') && word.length > 4) {
      return word.slice(0, -3) + 'y'
    }

    // -ied -> -y (studied -> study, tried -> try)
    if (word.endsWith('ied') && word.length > 4) {
      return word.slice(0, -3) + 'y'
    }

    // -ing endings
    if (word.endsWith('ing') && word.length > 4) {
      let stem = word.slice(0, -3)
      // Handle doubled consonants (running -> run, swimming -> swim)
      if (stem.length >= 3 && stem[stem.length - 1] === stem[stem.length - 2] && 
          this.isConsonant(stem[stem.length - 1])) {
        stem = stem.slice(0, -1)
      }
      // Handle -e dropping (making -> make, writing -> write)
      if (this.needsE(stem)) {
        stem += 'e'
      }
      return stem
    }

    // -ed endings
    if (word.endsWith('ed') && word.length > 3) {
      let stem = word.slice(0, -2)
      // Handle doubled consonants (stopped -> stop, planned -> plan)
      if (stem.length >= 3 && stem[stem.length - 1] === stem[stem.length - 2] && 
          this.isConsonant(stem[stem.length - 1])) {
        stem = stem.slice(0, -1)
      }
      // Handle -e dropping (moved -> move, used -> use)
      if (this.needsE(stem)) {
        stem += 'e'
      }
      return stem
    }

    // -er endings (comparative)
    if (word.endsWith('er') && word.length > 3) {
      let stem = word.slice(0, -2)
      // Handle doubled consonants (bigger -> big, hotter -> hot)
      if (stem.length >= 2 && stem[stem.length - 1] === stem[stem.length - 2] && 
          this.isConsonant(stem[stem.length - 1])) {
        stem = stem.slice(0, -1)
      }
      return stem
    }

    // -est endings (superlative)
    if (word.endsWith('est') && word.length > 4) {
      let stem = word.slice(0, -3)
      // Handle doubled consonants (biggest -> big, hottest -> hot)
      if (stem.length >= 2 && stem[stem.length - 1] === stem[stem.length - 2] && 
          this.isConsonant(stem[stem.length - 1])) {
        stem = stem.slice(0, -1)
      }
      return stem
    }

    // -ly endings (adverbs)
    if (word.endsWith('ly') && word.length > 3) {
      let stem = word.slice(0, -2)
      // Handle -ily -> -y (happily -> happy, easily -> easy)
      if (stem.endsWith('i') && stem.length > 2) {
        stem = stem.slice(0, -1) + 'y'
      }
      return stem
    }

    // -s endings (plurals and third person singular)
    if (word.endsWith('s') && word.length > 2) {
      // Don't stem words ending in -ss, -us, -is
      if (word.endsWith('ss') || word.endsWith('us') || word.endsWith('is')) {
        return word
      }
      
      // Handle -es endings
      if (word.endsWith('es') && word.length > 3) {
        let stem = word.slice(0, -2)
        // Words ending in -ches, -shes, -xes, -zes keep the -e
        if (word.endsWith('ches') || word.endsWith('shes') || 
            word.endsWith('xes') || word.endsWith('zes')) {
          return stem
        }
        // Other -es endings might need -e added back
        if (this.needsE(stem)) {
          stem += 'e'
        }
        return stem
      }
      
      // Simple -s removal
      return word.slice(0, -1)
    }

    // Return original word if no rules apply
    return word
  }

  /**
   * Check if a character is a consonant
   * @param {string} char - The character to check
   * @returns {boolean} - True if consonant
   */
  isConsonant(char) {
    return char && !'aeiou'.includes(char.toLowerCase())
  }

  /**
   * Check if a stem needs an 'e' added back
   * @param {string} stem - The stem to check
   * @returns {boolean} - True if 'e' should be added
   */
  needsE(stem) {
    if (stem.length < 2) return false
    
    // Words ending in -c, -g, -v usually need -e
    const lastChar = stem[stem.length - 1]
    if ('cgv'.includes(lastChar)) return true
    
    // Words ending in consonant clusters might need -e
    if (stem.length >= 2) {
      const lastTwo = stem.slice(-2)
      if (['bl', 'cl', 'dl', 'fl', 'gl', 'pl', 'sl', 'tl'].includes(lastTwo)) {
        return true
      }
    }
    
    return false
  }

  /**
   * Group words by their root form
   * @param {Object} wordFrequency - Object with word frequencies
   * @returns {Object} - Grouped words by root
   */
  groupWordsByRoot(wordFrequency) {
    const groups = {}
    
    Object.entries(wordFrequency).forEach(([word, frequency]) => {
      const root = this.getRootWord(word)
      
      if (!groups[root]) {
        groups[root] = {
          rootWord: root,
          variants: {},
          totalFrequency: 0,
          mostFrequent: word,
          mostFrequentCount: frequency
        }
      }
      
      groups[root].variants[word] = frequency
      groups[root].totalFrequency += frequency
      
      // Update most frequent variant
      if (frequency > groups[root].mostFrequentCount) {
        groups[root].mostFrequent = word
        groups[root].mostFrequentCount = frequency
      }
    })
    
    return groups
  }

  /**
   * Get all variants of a word
   * @param {string} word - The word to find variants for
   * @param {Object} wordFrequency - Object with word frequencies
   * @returns {Array} - Array of variants with frequencies
   */
  getWordVariants(word, wordFrequency) {
    const root = this.getRootWord(word)
    const variants = []
    
    Object.entries(wordFrequency).forEach(([w, freq]) => {
      if (this.getRootWord(w) === root) {
        variants.push({ word: w, frequency: freq })
      }
    })
    
    return variants.sort((a, b) => b.frequency - a.frequency)
  }
}

// Create singleton instance
const wordStemmingService = new WordStemmingService()

export default wordStemmingService
