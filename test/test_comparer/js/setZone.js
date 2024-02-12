const myURIsource="mongodb://gpi:gpi@ip-10-0-0-116.ec2.internal:27017,ip-10-0-0-30.ec2.internal:27017,ip-10-0-0-86.ec2.internal:27017/admin"
const myURIdestination="mongodb+srv://gpi:gpi@shdest-pl-0-lb.baelt.mongodb.net/"
const myURImeta="mongodb+srv://gpi:gpi@mo8.yl7sdzk.mongodb.net"

const collName="sharded_2"
const dbName="simrunnerOptim"

var destination = connect(myURIdestination)
var source = connect(myURIsource)

let colSrc=source.getSiblingDB(dbName).getCollection(collName)
let colDest=destination.getSiblingDB(dbName).getCollection(collName)

// Arbitrary
// const idTest=ObjectId("65c201747e2da2563e5ab67a")

// console.log(`Get one doc at the src: ${JSON.stringify(colSrc.findOne({_id:idTest},{first:1,last:1,zone:1,location:1}))}`)
// console.log(`Get one doc at the dest: ${JSON.stringify(colDest.findOne({_id:idTest},{first:1,last:1,zone:1,location:1}))}`)


let resSrc = colSrc.updateMany({},[{$set:{zone:"$last"}}])
let resDest = colDest.updateMany({},[{$set:{"location":"$last"}}])

console.log(`Resulting update at source: ${JSON.stringify(resSrc)}`)
console.log(`Resulting update at dest: ${JSON.stringify(resDest)}`)
console.log(`Get one doc at the src: ${JSON.stringify(colSrc.findOne({},{first:1,last:1,zone:1,location:1}))}`)
console.log(`Get one doc at the dest: ${JSON.stringify(colDest.findOne({},{first:1,last:1,zone:1,location:1}))}`)
