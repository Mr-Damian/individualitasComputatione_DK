const seedNature = 100079454328425 //my facebook ID: 100079454328425
let seedNurture = ''; //IP adress retrieved by ipfy api
let ruleX = '';
const apiIp = 'http://ip-api.com/json/' //gets longitude and latitude from IP address
let len;
let ang;
let angDeviation;
let lenDeviation;

let rules = {
  'F': 'FF'
}

//this function waits gets the ip address of user
async function getIp() {
  const response = await fetch(apiIp);
  const data = await response.json();
  let ip = str(data['lat']) + str(data['lon']) //str(data['query'])//beware minus coordinates!!
  seedNurture = ip
}

//setup function
async function setup() {
  await getIp()
  createCanvas(800, 1000)
  angleMode(DEGREES)
  colorMode(HSB)
  noLoop();
  background(235, 50, 70, 100)
  pixelDensity(1)
  //background(235, 50, 70, 100)
  strokeCap(PROJECT)
  for (i = 0; i < seedNurture.length; i++) {
    seedNurture = seedNurture.replaceAll('.', '')
  }
  print('seed', seedNurture)
  ruleX = generateRandomRuleX(seedNature)
  print('Rule X:', ruleX)
  randomSeed(seedNurture)
  len = 5
  ang = random(12, 25)
  angf = random(15, 89)
  // randomSeed(seedNurture)
  // angDeviation = random(-ang * 0.3, ang * 0.3);
  // lenDeviation = random(-0.1 * len, 0.1 * len);
}

//generates a L-System rule based on facebook id
function generateRandomRuleX(seedNature) {
  let generatedNewRule = 'F[+]F[-]'; //insert random sentence at pos 3,7,9
  let inserts = ['', '', ''];
  randomSeed(seedNature);
  let c;
  let bracketCount = 0;
  let r = floor(random(5, 10))
  for (f = 0; f < 3; f++) {
    for (i = 0; i < r; i++) {
      c = grammar[floor(random(1, 11))]
      if (c == '[') {
        bracketCount += 1
      } else {
        inserts[f] += c
      }
    }
    for (j = 0; j < bracketCount; j++) {
      rp = random(inserts[f].length)
      pd = random(inserts[f].length - rp)
      inserts[f] = inserts[f].slice(0, rp) + '[' + inserts[f].slice(rp);
      inserts[f] = inserts[f].slice(0, rp + pd + 1) + ']' + inserts[f].slice(rp + pd + 1);
    }
  }
  generatedNewRule = generatedNewRule.slice(0, 3) + 'X' + inserts[0] + generatedNewRule.slice(3, 7) + 'X' + inserts[1] + generatedNewRule.slice(7, 10) + inserts[2]
  rules['X'] = generatedNewRule
  if (rules['X'].includes('[]')) {
    rules['X'].replaceAll('[]', '')
    print('removed')
  }
  return (generatedNewRule)
}

let grammar = { //the grammar from which the rule can be composed from, added some letters more for higher chances to be picked
  1: 'F',
  2: 'X',
  3: 'X',
  4: '+',
  5: '-',
  6: '[',
  7: 'F',
  8: 'A',
  9: 'X',
  10: '['
}

let sentence = 'X'

function generateSentence() { //generates a new sentence based on the rules
  let nextSentence = ''
  for (i = 0; i < sentence.length; i++) {
    let current = sentence.charAt(i)
    if (current in rules) {
      nextSentence += rules[current]
    } else {
      nextSentence += current
    }
    sentence[i] = current
  }
  return (nextSentence)
}

let drawRules = {
  'F': () => {
    noiseSeed(seedNurture)
    stroke(0, 0, 0, 1)
    weightOfStroke = weightOfStroke * (1 - 0.3 / amountF)
    amountF--
    rotate(noise(amountF) * 5 * floor(random(-2, 2)))
    brush(-len)
    translate(0, -len)
  },
  '+': () => {
    noiseSeed(seedNurture)
    rotate(ang)
    rotate((noise(amountF) - 0.5) * 40)
  },
  '-': () => {
    noiseSeed(seedNurture)
    rotate(-ang)
    rotate((noise(amountF + 100000) - 0.5) * 40)
  },
  '[': () => {
    push()
    weightOfStroke = weightOfStroke * 0.5
    len = len * 0.91
  },
  ']': () => {
    pop()
    weightOfStroke = weightOfStroke / 0.5
    len = len / 0.91
  },
  'A': () => {
    push()
    fill(255 + random(-50, 50), 64 + random(-50, 50), 155 + random(-50, 50), random(100, 200))
    rotate(random(TAU))
    flower(random(9, 13))
    pop()
  }
}

let weightOfStroke = 30;

function brush(lenb) {
  // noFill()
  // for (i = 0; i > lenb; i -= 3) {
  //   arc(0, i, weightOfStroke, weightOfStroke / 3.5, 12, 192)
  // }
  strokeWeight(weightOfStroke)
  // quad(0, 0, weightOfStroke, 0, weightOfStroke * 1.2, lenb, 0, lenb)
  line(0, 0, 0, lenb)
  // pointShadow(lenb)
}

let amountF = 0;

function scanSentence() {
  for (i = 0; i < sentence.length; i++) {
    if (sentence.charAt(i) == 'F') {
      amountF++
    }
  }
}

function drawBranches() {
  push()
  translate(600, 1000)
  //rotate(random(70, 90))
  scanSentence()
  for (i = 0; i < sentence.length; i++) {
    if (sentence.charAt(i) in drawRules) {
      drawRules[sentence.charAt(i)]()
    }
  }
  pop()
}

function mouseReleased() {
  sentence = generateSentence();
  console.log(sentence)
}

function keyPressed() {
  if (key == 'd') {
    drawBranches()
  }
}