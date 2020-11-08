const names = require('./names.json')
const fs = require('fs-extra')
const axios = require('axios')

let infinite = 0
let completed = []
let selected = []
let output = {"nodes":[],"links":[]}

async function setupGraph() {
  if (!fs.existsSync('d3.v4.min.js')) {
    let d3 = await axios.get("https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.min.js")
    fs.writeFileSync('d3.v4.min.js', d3.data)
  }
  if (!fs.existsSync('jquery.min.js')) {
    let jquery = await axios.get("https://code.jquery.com/jquery-2.2.4.min.js")
    fs.writeFileSync('jquery.min.js', jquery.data)
  }


  // console.log(names)

  for (let thisPersonIndex in names.people) {
    getRandomPerson(thisPersonIndex)
    if (infinite > 200) {
      break
    }
    output.nodes.push({"id":names.people[thisPersonIndex].firstName + ' ' + names.people[thisPersonIndex].lastName, "group":names.groups.indexOf(names.people[thisPersonIndex].group)})
  }
  // console.log('------------------------------------')
  for (let completedIndex in completed) {
    let from = completed[completedIndex].from
    let to = completed[completedIndex].to
    console.log(`[${from}]${names.people[from].firstName} -> [${to}]${names.people[to].firstName}`)

    output.links.push({
      "source":names.people[from].firstName + ' ' + names.people[from].lastName,
      "target": names.people[to].firstName + ' ' + names.people[to].lastName,
      "value": 5
    })
  }

  // console.log(JSON.stringify(output, null, 2))
  // console.log(JSON.stringify(output))

  fs.writeFileSync('output.json', JSON.stringify(output))
}

function getRandomPerson(thisPersonIndex) {
  if (infinite > 200) {
    console.log("There was a problem...")
    return
  }
  let name = names.people[thisPersonIndex]
  let randomPerson = Math.floor(Math.random() * Math.floor(names.people.length))
  // console.log(name.lastName + ', ' + name.firstName)
  // console.log(thisPersonIndex + ' -> ' + randomPerson)
  if (name.group == names.people[randomPerson].group) {
    // console.log('Do not pick people in the same group')
    // console.log(`${name.firstName} cannot pick ${names.people[randomPerson].firstName}`)
    return getRandomPerson(thisPersonIndex)
  } else if (selected.indexOf(randomPerson) > -1) {
    // console.log('Do not pick a person who has already been selected.')
    // console.log(`${name.firstName} cannot pick ${names.people[randomPerson].firstName}`)
    return getRandomPerson(thisPersonIndex)
  } else {
    completed.push({"from":thisPersonIndex,"to":randomPerson})
    selected.push(randomPerson)
    return
  }
}

setupGraph()