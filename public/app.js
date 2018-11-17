
// Initialize Firebase
var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
};
firebase.initializeApp(config);

var dbRef = firebase.database().ref("SurveyElements");

dbRef.on("value", snap => {
    let myData = snap.val();

    const questionListUI = document.getElementById("questionList");

    questionListUI.innerHTML = "";

    for (let i = 0; i < myData.length; ++i) {
        if (myData[i].Element == "SQ") {
            let $li = document.createElement("li");
            $li.innerHTML = myData[i].SecondaryAttribute;
            questionListUI.append($li);
        }
    }
});


const searchBar = document.getElementById("search-bar");
searchBar.addEventListener('keypress', getMatchedQuestions);

function getMatchedQuestions(e) {
    // console.log(e);
    if (e.key == "Enter") {
        e.preventDefault();
        let queryString = searchBar.value;

        const questionListUI = document.getElementById("questionList");

        questionListUI.innerHTML = "";

        dbRef.orderByChild("Element").equalTo("SQ").on("child_added", function (snap) {
            let questionList = snap.val();
            questionText = questionList.SecondaryAttribute;
            if (questionText.indexOf(queryString) != -1) {
                // console.log(questionText);
                let $li = document.createElement("li");
                $li.innerHTML = questionText;
                questionListUI.append($li);
            }
        });

        // Clear the search bar after process the query
        e.target.value = "";
    }
}


const inputFile = document.getElementById('input-file');
inputFile.addEventListener("change", handleFiles);

function handleFiles(e) {
    let inputFile = this.files[0];
    if (inputFile) {
        let reader = new FileReader();
        reader.readAsText(inputFile, "UTF-8");
        reader.onload = function (evt) {
            //console.log(evt.target.result);
            updateFirebase(evt.target.result);
        }
        reader.onerror = function (evt) {
            console.log("error reading file");
        }
    }
}

function updateFirebase(fileAsString) {
    // let userRef = dbRef.child('SurveyElements');
    // console.log(typeof fileAsString);
    let fileAsJson = JSON.parse(fileAsString);
    // console.log(typeof fileAsJson);
    // console.log(fileAsJson.SurveyElements);

    let newElements = { SurveyElements: [] };

    dbRef.orderByChild("Element").equalTo("SQ").on("child_added", function (snap) {
        let questionList = snap.val();
        newElements.SurveyElements.push(questionList);
    });

    // console.log(newElements);

    for (let i = 0; i < fileAsJson.SurveyElements.length; ++i) {
        newElements.SurveyElements.push(fileAsJson.SurveyElements[i]);
    }

    // console.log(newElements);

    dbRef.update(newElements.SurveyElements, function () {
        console.log("I hope it worked!!!");
    });
}
