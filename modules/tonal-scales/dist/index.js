'use strict';

var tnl = require('tonal');
var raw = require('./scales.json');

var data = Object.keys(raw).reduce(function (d, k) {
  // add intervals
  d[k] = raw[k][0].split(' ').map(tnl.parseIvl);
  // add alias
  if (raw[k][1]) raw[k][1].forEach(function (a) {
    d[a] = k;
  });
  return d;
}, {});

var harmonizer = function harmonizer(ivls) {
  return function (tonic) {
    return tnl.harmonize(ivls, tonic || 'P1');
  };
};

/**
 * Create a scale from a name or intervals and tonic
 *
 * @name scale
 * @function
 * @param {Array} source - the scale name, scale intervals or scale notes
 * @param {String} tonic - the tonic of the scale
 * @return {Array} the list of notes
 *
 * @example
 * var scale = require('tonal-scales')
 * // get scale from type and tonic
 * scale('major', 'A4') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
 * // get scale from intervals and tonic
 * scale('1 2 3 4 5 6 7', 'A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
 * // partially applied
 * var major = scale('major')
 * major('A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
 * major('A4') // => ['A4', 'B4', 'C#4', 'D4', 'E4', 'F#4', 'G#4']
 * // part of tonal
 * tonal.scale('major', 'A')
 */
function scale(source, tonic) {
  if (arguments.length > 1) return scale(source)(tonic);
  var intervals = data[source];
  // is an alias?
  if (typeof intervals === 'string') intervals = data[intervals];
  return harmonizer(intervals || source);
}

/**
 * Get scale notes by scale name
 *
 * @name scale.get
 * @function
 * @param {String} name - the complete scale name (with tonic)
 * @return {Array} scale notes
 *
 * @example
 * // get scale from name
 * scale.get('A major') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
 * // part of tonal
 * tonal.scale.get('C2 bebop')
 */
function fromName(name) {
  var i = name.indexOf(' ');
  if (i === -1) return scale(name, false);else return scale(name.slice(i + 1), name.slice(0, i));
}

/**
 * Return the available scale names
 *
 * @param {boolean} aliases - true to include aliases
 *
 * @example
 * tonal.scale.names() // => ['maj7', ...]
 */
function names(aliases) {
  if (aliases) return Object.keys(data);
  return Object.keys(data).reduce(function (names, name) {
    if (typeof data[name] !== 'string') names.push(name);
    return names;
  }, []);
}

exports.scale = scale;
exports.fromName = fromName;
exports.names = names;