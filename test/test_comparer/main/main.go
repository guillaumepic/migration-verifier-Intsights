package main

import (
	"bytes"
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"sort"
	"strings"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func getOne(coll *mongo.Collection, filter bson.D) (result bson.M) {

	err := coll.FindOne(context.TODO(), filter).Decode(&result)
	if err == mongo.ErrNoDocuments {
		fmt.Printf("No document was found with the filter %+v\n", filter)
		return
	}
	if err != nil {
		panic(err)
	}

	return
}

func getEnv(varURIsrc string, varURIdest string, varDBname string, varColname string) (uriSrc string, uriDest string, DBname string, Colname string) {

	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	uriSrc = os.Getenv(varURIsrc)
	if uriSrc == "" {
		log.Fatal("You must set your 'myURIsource' environment variable.")
	}

	uriDest = os.Getenv(varURIdest)
	if uriDest == "" {
		log.Fatal("You must set your 'myURIDest' environment variable.")
	}

	DBname = os.Getenv(varDBname)
	if DBname == "" {
		log.Fatal("You must set your 'DBName' environment variable.")
	}
	Colname = os.Getenv(varColname)
	if Colname == "" {
		log.Fatal("You must set your 'ColName' environment variable.")
	}

	fmt.Println("Src:", uriSrc)
	fmt.Println("Dest:", uriDest)
	fmt.Println("DB:", DBname)
	fmt.Println("col:", Colname)
	return
}

func ZoneFieldPermutations() []string {
	return []string{
		"Zone",
		"zone",
		"accountZone",
	}
}

func handleZoneField(
	ParsedDoc bson.M,
) bson.M {
	for _, ZoneFieldPermutation := range ZoneFieldPermutations() {
		if val, ok := ParsedDoc[ZoneFieldPermutation]; ok {
			ZoneStr := strings.ToUpper(val.(string))

			switch ZoneStr {
			case "EU":
				ZoneStr = "ES"
			case "ASIA":
				ZoneStr = "JP"
			default:
			}

			ParsedDoc["location"] = ZoneStr
			delete(ParsedDoc, ZoneFieldPermutation)

			break

		}
	}

	return ParsedDoc
}

func main() {
	// Get .env
	var uriSrc, uriDest, DBname, Colname string
	uriSrc, uriDest, DBname, Colname = getEnv("myURIsource", "myURIdestination", "DBName", "ColName")

	// Get flag ID
	idPtr := flag.String("id", "1", "The objectId string value to search in both direction")
	flag.Parse()
	fmt.Println("id:", *idPtr)

	// Get Src client
	clientSrc, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uriSrc))
	if err != nil {
		panic(err)
	}
	defer func() {
		if err := clientSrc.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	// Get Dest client
	clientDest, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uriDest))
	if err != nil {
		panic(err)
	}
	defer func() {
		if err := clientDest.Disconnect(context.TODO()); err != nil {
			panic(err)
		}
	}()

	collSrc := clientSrc.Database(DBname).Collection(Colname)
	collDest := clientDest.Database(DBname).Collection(Colname)

	var resultSrc, resultDest bson.M

	docID, err := primitive.ObjectIDFromHex(*idPtr)
	filter := bson.D{{"_id", docID}}
	resultSrc = getOne(collSrc, filter)
	resultDest = getOne(collDest, filter)

	// Patching Zone field
	handleZoneField(resultSrc)
	// handleZoneField(resultDest)

	// jsonDataSrc, err := json.MarshalIndent(resultSrc, "", "    ")
	jsonDataSrc, err := json.Marshal(resultSrc)
	if err != nil {
		panic(err)
	}
	log.Print("Document found at source")
	fmt.Printf("%s\n", jsonDataSrc)

	//jsonDataDest, err := json.MarshalIndent(resultDest, "", "    ")
	jsonDataDest, err := json.Marshal(resultDest)
	if err != nil {
		panic(err)
	}
	log.Print("Document found at destination")
	fmt.Printf("%s\n", jsonDataDest)

	// Byte comparison
	var srcDoc, destDoc []byte
	srcDoc, err = bson.Marshal(resultSrc)
	if err != nil {
		log.Fatal("Error Marshalling doc +s", err)
		return
	}
	destDoc, err = bson.Marshal(resultDest)
	if err != nil {
		log.Fatal("Error Marshalling doc +s", err)
		return
	}
	// Byte comparison
	fmt.Printf("Raw resultSrc (before): %08b\n", srcDoc)
	fmt.Printf("Raw resultDest (before): %08b\n", destDoc)
	log.Print("Length of src document after patching:", len(srcDoc))
	log.Print("Length of dest document :", len(destDoc))

	sort.Slice(srcDoc, func(i, j int) bool { // sorted src []byte
		return srcDoc[i] > srcDoc[j]
	})

	sort.Slice(destDoc, func(i, j int) bool { //sorted dest []byte
		return destDoc[i] > destDoc[j]
	})

	// var match bool
	match := bytes.Equal(srcDoc, destDoc)

	log.Print("Match result is ", match)
	if match {
		log.Print("Both documents are equal in byte size")
	} else {
		log.Fatal("/!\\ Both Documents are not equal in byte size")
		return
	}

	log.Print("... The End.")
}
