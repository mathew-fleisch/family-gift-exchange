const names = require('./names.json')
const fs = require('fs-extra')
const axios = require('axios')

let infinite = 0
let startWithIndex = 0
let completed = []
let selected = []
let theHat = []
let output = {"nodes":[],"links":[]}

async function whyIsThisNecessary() {
  if (!fs.existsSync('d3.v4.min.js')) {
    let d3 = await axios.get("https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min.js")
    fs.writeFileSync('d3.v4.min.js', d3.data)
  }
  if (!fs.existsSync('jquery.min.js')) {
    let jquery = await axios.get("https://code.jquery.com/jquery-2.2.4.min.js")
    fs.writeFileSync('jquery.min.js', jquery.data)
  }
}

async function setupGraph() {
  // whyIsThisNecessary()
  console.log(names)

 for (let i = 0; i < names.people.length; i++) {
   theHat.push(i)
 }


  selected.push(startWithIndex)
  theHat.splice(theHat.indexOf(startWithIndex), 1)
  await getRandomPerson(startWithIndex)

  let lastPerson = startWithIndex
  for (let completedIndex in completed) {
    console.log('------------------------------------')
    let from = completed[completedIndex].from
    let to = completed[completedIndex].to
    console.log(`[${from}]${names.people[from].firstName} -> [${to}]${names.people[to].firstName}`)

    output.links.push({
      "source":names.people[from].firstName + ' ' + names.people[from].lastName,
      "target": names.people[to].firstName + ' ' + names.people[to].lastName,
      "value": 5
    })
    lastPerson = to
  }

  output.nodes.push({"id":names.people[lastPerson].firstName + ' ' + names.people[lastPerson].lastName, "group": names.groups.indexOf(names.people[lastPerson].group)})
  output.links.push({
    "source":names.people[lastPerson].firstName + ' ' + names.people[lastPerson].lastName,
    "target": names.people[startWithIndex].firstName + ' ' + names.people[startWithIndex].lastName,
    "value": 5
  })
  console.log(JSON.stringify(output, null, 2))
  console.log(JSON.stringify(output))

  fs.writeFileSync('output.json', JSON.stringify(output))
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function getRandomPerson(thisPersonIndex) {
  console.log("======")
  console.log("The HAT")
  // console.log(theHat)
  for (let i = 0; i < theHat.length; i++) {
    console.log(`${names.people[theHat[i]].firstName} ${names.people[theHat[i]].lastName}`)
  }
  console.log("======")
  if (theHat.length == 0) {
    return
  }
  // await sleep(1000)
  infinite++
  if (infinite > 5000) {
    console.log("There was a problem... Could not make the loop")
    return
  }
  let name = names.people[thisPersonIndex]
  // let randomPerson = Math.floor(Math.random() * Math.floor(names.people.length))
  // that was dumb
  let randomPerson = theHat[Math.floor(Math.random()*theHat.length)]
  // Blatent Cheating
  if (thisPersonIndex == 10) randomPerson = 19
  if (randomPerson == 19 && thisPersonIndex != 10) return getRandomPerson(thisPersonIndex)
  if (thisPersonIndex == 11) randomPerson = 2
  if (randomPerson == 2 && thisPersonIndex != 11) return getRandomPerson(thisPersonIndex)
  if (thisPersonIndex == 3) randomPerson = 10
  if (randomPerson == 10 && thisPersonIndex != 3) return getRandomPerson(thisPersonIndex)
  if (thisPersonIndex == 5) randomPerson = 11
  if (randomPerson == 11 && thisPersonIndex != 5) return getRandomPerson(thisPersonIndex)
  console.log(name.firstName + " " + name.lastName + " picked " + names.people[randomPerson].firstName + " " + names.people[randomPerson].lastName)
  if (name.group == names.people[randomPerson].group) {
    console.log('Do not pick people in the same group')
    console.log(`${name.firstName} cannot pick ${names.people[randomPerson].firstName}`)
    return getRandomPerson(thisPersonIndex)
  } else if (selected.indexOf(randomPerson) > -1) {
    // This should never happen....
    console.log('Do not pick a person who has already been selected.')
    console.log(`${name.firstName} cannot pick ${names.people[randomPerson].firstName}`)
    console.log("THe hat")
    for (let i = 0; i < theHat.length; i++) {
      console.log(`${names.people[theHat[i]].firstName} ${names.people[theHat[i]].lastName}`)
    }
    console.log("FAK")
    process.exit()
  } else {
    completed.push({"from":thisPersonIndex,"to":randomPerson})
    if (randomPerson == startWithIndex) return
    console.log("REMOVE " + names.people[randomPerson].firstName + " FROM THE HAT")
    selected.push(randomPerson)
    theHat.splice(theHat.indexOf(randomPerson), 1)
    output.nodes.push({"id":names.people[thisPersonIndex].firstName + ' ' + names.people[thisPersonIndex].lastName, "group":names.groups.indexOf(names.people[thisPersonIndex].group)})

    return getRandomPerson(randomPerson)
  }
}

setupGraph()