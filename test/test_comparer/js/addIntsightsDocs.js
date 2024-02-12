const myURIsource="mongodb+srv://gpi:gpi@rssrc.baelt.mongodb.net/"
const myURIdestination="mongodb+srv://gpi:gpi@rsdest.baelt.mongodb.net/"

const collName="samples"
const dbName="intsights"

var source = connect(myURIsource)
var destination = connect(myURIdestination)

let colSrc=source.getSiblingDB(dbName).getCollection(collName)
let colDest=destination.getSiblingDB(dbName).getCollection(collName)

const docsSrc=[
    {
        "_id" : ObjectId("65c5c5c5e7a3bf888575a330"),
        "AccountId" : ObjectId("60ebb208aebc450007365eba"),
        "Initiator" : ObjectId("633e40972ef5f10034f06df4"),
        "ThreatId" : ObjectId("65c5a423e7a3bf8885458bca"),
        "ThreatType" : "BotDataForSale",
        "Type" : "Read",
        "Zone" : "asia",
        "AdditionalInformation" : {},
        "ReportDate" : ISODate("2024-02-09T06:27:17.014Z")
    },
    {
        "_id" : ObjectId("65c5c3baea51a705ada0aae1"),
        "AccountId" : ObjectId("641e03d1c8e8346cab74adb9"),
        "Initiator" : ObjectId("64a5788ef1c606c801b32152"),
        "ThreatId" : ObjectId("654d1a3bfd868fa1e6f0eb18"),
        "ThreatType" : "SslCertificates",
        "Type" : "Read",
        "Zone" : "us",
        "AdditionalInformation" : {},
        "ReportDate" : ISODate("2024-02-09T06:18:34.285Z")
    },
    {
        "_id" : ObjectId("65c5c2a5e7a3bf88856fe9b4"),
        "AccountId" : ObjectId("62a2d70f14267ef348a9bcec"),
        "Initiator" : ObjectId("64a63dda12c013012f435303"),
        "ThreatId" : ObjectId("65c400c0e7a3bf88858930e7"),
        "ThreatType" : "SslCertificates",
        "Type" : "Read",
        "Zone" : "asia",
        "AdditionalInformation" : {},
        "ReportDate" : ISODate("2024-02-09T06:13:57.137Z")
    }
]

const docsDest=[
    {
        "_id" : ObjectId("65c5c5c5e7a3bf888575a330"),
        "AccountId" : ObjectId("60ebb208aebc450007365eba"),
        "Initiator" : ObjectId("633e40972ef5f10034f06df4"),
        "ThreatId" : ObjectId("65c5a423e7a3bf8885458bca"),
        "ThreatType" : "BotDataForSale",
        "Type" : "Read",
        "location" : "JP",
        "AdditionalInformation" : {},
        "ReportDate" : ISODate("2024-02-09T06:27:17.014Z")
    },
    {
        "_id" : ObjectId("65c5c3baea51a705ada0aae1"),
        "AccountId" : ObjectId("641e03d1c8e8346cab74adb9"),
        "Initiator" : ObjectId("64a5788ef1c606c801b32152"),
        "ThreatId" : ObjectId("654d1a3bfd868fa1e6f0eb18"),
        "ThreatType" : "SslCertificates",
        "Type" : "Read",
        "location" : "US",
        "AdditionalInformation" : {},
        "ReportDate" : ISODate("2024-02-09T06:18:34.285Z")
    },
    {
        "_id" : ObjectId("65c5c2a5e7a3bf88856fe9b4"),
        "AccountId" : ObjectId("62a2d70f14267ef348a9bcec"),
        "Initiator" : ObjectId("64a63dda12c013012f435303"),
        "ThreatId" : ObjectId("65c400c0e7a3bf88858930e7"),
        "ThreatType" : "SslCertificates",
        "Type" : "Read",
        "location" : "JP",
        "AdditionalInformation" : {},
        "ReportDate" : ISODate("2024-02-09T06:13:57.137Z")
    }
]

let resDest = colDest.insertMany(docsDest,   {
    writeConcern: "majority",
    ordered: true
 })

let resSrc = colSrc.insertMany(docsSrc,   {
    writeConcern: "majority",
    ordered: true
 }) 


console.log(`Resulting Insert many at source: ${JSON.stringify(resSrc)}`)
console.log(`Resulting Insert many at dest: ${JSON.stringify(resDest)}`)
// console.log(`Get one doc at the src: ${JSON.stringify(colSrc.findOne({},{first:1,last:1,zone:1,location:1}))}`)
// console.log(`Get one doc at the dest: ${JSON.stringify(colDest.findOne({},{first:1,last:1,zone:1,location:1}))}`)
