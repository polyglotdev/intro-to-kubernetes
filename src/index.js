let largeData = [
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d1',
    name: 'Elijah Hallan'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d2',
    name: 'John Doe'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d3',
    name: 'Jane Doe'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d4',
    name: 'James Smith'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d5',
    name: 'Robert Johnson'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d6',
    name: 'Michael Brown'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d7',
    name: 'William Jones'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d8',
    name: 'David Garcia'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d9',
    name: 'Richard Martinez'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d10',
    name: 'Joseph Hernandez'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d11',
    name: 'Charles Young'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d12',
    name: 'Daniel Lee'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d13',
    name: 'Matthew Walker'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d14',
    name: 'Anthony Perez'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d15',
    name: 'Donald Sanchez'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d16',
    name: 'Mark Wilson'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d17',
    name: 'Paul Taylor'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d18',
    name: 'Steven Anderson'
  },
  {
    id: 'd4f0f9d6-845e-4328-aace-14312ea732d19',
    name: 'Andrew Thomas'
  }
]
let chunkSize = 10000

function storeChunkedData(data) {
  const chunks = []
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize))
  }

  chunks.forEach((chunk, index) => {
    localStorage.setItem(`myDataChunk_${index}`, JSON.stringify(chunk))
  })
}

function retrieveChunkedData() {
  let allData = ''
  let index = 0
  while (localStorage.getItem(`myDataChunk_${index}`)) {
    allData += localStorage.getItem(`myDataChunk_${index}`)
    index++
  }
  return JSON.parse(`[${allData.replace(/}{/g, '},{')}]`)
}

// Store the data
storeChunkedData(largeData)

// Retrieve the data
const retrievedData = retrieveChunkedData()
console.log(retrievedData)
console.log(`🏁 completed!`)
