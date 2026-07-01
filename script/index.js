//Manage Spinner Function START
const spinnerId = document.getElementById("spinner");
const loadWordsId = document.getElementById("load-words");
const manageSpinner = (status) =>{
    if(status === true){
        spinnerId.classList.remove("hidden");
        loadWordsId.classList.add("hidden");
    }else{
        loadWordsId.classList.remove("hidden");
        spinnerId.classList.add("hidden");
    }
}
//Manage Spinner Function END

//Function For Pronunciation Word Loudly START
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
//Function For Pronunciation Word Loudly END


//Function For Load All The Level From API START
const loadLevel = () => {
    const url = "https://openapi.programming-hero.com/api/levels/all";
    fetch(url) // return promise of response
        .then((res) => res.json())  // return promise of json Data
        .then(json => {
            displayLevel(json.data);
        })
}
//Function For Load All The Level From API END



//function for display lessons START
const displayLevel = (lessons) => {

    //1. Get the parent container && Empty
    const loadLevelContainer = document.getElementById("load-level");
    loadLevelContainer.innerHTML = "";

    //2. get into every lessons
    for (let lesson of lessons) {
        // console.log(lesson);

        //3. create Element
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
             <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})"
             class="btn btn-outline btn-primary lesson-btn">
             <i class="fa-solid fa-book-open"></i>
             Lesson-${lesson.level_no}
             </button>
        `;

        //4. Append Child
        loadLevelContainer.append(btnDiv);
    }
}
//function for display lessons END

//function for removing active all the class initially START

const removeActiveClass = () => {
    const removeBtn = document.querySelectorAll(".lesson-btn");
    // console.log(removeBtn);
    removeBtn.forEach((btn) => {
        btn.classList.remove("active")
    })
}
//function for removing active all the class init ially END


//Function For Load All The Word START
const loadLevelWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
             removeActiveClass();
            const clickBtn = document.getElementById(`lesson-btn-${id}`);
            // console.log(clickBtn)
            clickBtn.classList.add("active");
            displayLoadLevelWord(data.data)
        })
}
//Function For Load All The Word END

//Function For Display All The Word START
const displayLoadLevelWord = (words) => {
    // console.log(words)
    //1. get the Parent Container && Empty
    const loadWordsContainer = document.getElementById("load-words");
    loadWordsContainer.innerHTML = "";

    //condition for Empty lessons START
    if(words.length === 0){
        loadWordsContainer.innerHTML = `
                 <!-- make card for selection EMPTY lesson START -->
      <div class="col-span-full space-y-4 text-center font-bangla p-10">
          <img class="mx-auto" src="./assets/alert-error.png" alt="alertshowimg">
        <h5 class="text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</h5>
        <h1 class="font-medium text-4xl text-[#292524]">নেক্সট Lesson এ যান</h1>
      </div>
       <!-- make card for selection EMPTY lesson END --> 
        `;
        manageSpinner(false);
        return;
    }
    //condition for Empty lessons END

    // get into every words
    words.forEach((word) =>{

            //2. Create Element
    const card = document.createElement("div");
    card.innerHTML = `
        <div class="bg-white rounded-xl shadow-md text-center py-15 space-y-2 px-5">
        <h2 class="font-extrabold text-4xl">${word.word ? word.word : "শব্দ পাওয়া যায় নি"}</h2>
        <p class="text-xl">Meaning / Pronounciation</p>
        <p class="font-semibold text-[25px] text-[#18181B] font-bangla">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায় নি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায় নি"}"</p>

        <div class="flex justify-between items-center">
    <button onclick="loadWordDetails(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
    <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
   </div>

      </div>
   
    `;
 
    //Append Child
    loadWordsContainer.append(card);
    })
    manageSpinner(false)
}
//Function For Display All The Word END

//F For Load More Modal Word Details START
 const loadWordDetails = async(id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    // console.log(url);
    const res = await fetch(url);
    const wordDetails = await res.json();
    displayModalWordDetails(wordDetails.data);
 }

//F For Load More Modal Word Details END


// {
//     "word": "Cautious",
//     "meaning": "সতর্ক",
//     "pronunciation": "কশাস",
//     "level": 2,
//     "sentence": "Be cautious while crossing the road.",
//     "points": 2,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//         "careful",
//         "alert",
//         "watchful"
//     ],
//     "id": 3
// }


const displaySynonyms = (synArray) => {
    const mapSyn = synArray.map((el) => `<span class="btn bg-blue-100">${el}</span>`);
    const btnSyn = mapSyn.join("");
    return btnSyn;
}

//display word details Function START
const displayModalWordDetails = (details) => {
    console.log(details);

    //get the parent
    const modalWordDetailsContainer = document.getElementById("modal_details_container");

    //change modal inner text
    modalWordDetailsContainer.innerHTML = `

        <h2 class="text-3xl font-bold">${details.word} ( <i class="fa-solid fa-microphone-lines"></i> : <span class="font-bangla">কশাস</span> )</h2>
    <div>
      <p class="text-2xl font-bold">Meaning</p>
    <p class=" font-bangla">${details.meaning}</p>
    </div>
   <div>
     <p class="text-2xl font-bold">Example</p>
    <p class="text-semibold">${details.sentence}</p>
   </div>
<div>
      <p class="text-xl font-bold font-bangla">সমার্থক শব্দ গুলো</p>
    <div class="space-x-4">
        ${displaySynonyms(details.synonyms)}
    </div>
</div>
    <button class="btn btn-primary">Complete Learning</button>

    `;



    //code for showModal START
    document.getElementById(modal_details.showModal())
    //code for showModal END
}
//display word details Function END

loadLevel();

//Function For Filter Search Vocabulary START
document.getElementById("search-btn")
.addEventListener("click", () =>{
    const inputSearch = document.getElementById("search-input");
    // console.log(inputSearchValue);
    const inputValue = inputSearch.value.trim().toLowerCase();
    console.log(inputValue)
    const allWordsUrl = "https://openapi.programming-hero.com/api/words/all";
    fetch(allWordsUrl)
    .then((res) => res.json())
    .then((data) => {
        // console.log(data.data)
        const allWordsContainer = data.data;
        const filterWords = allWordsContainer.filter((word) =>{
           return word.word.toLowerCase().includes(inputValue)})
          displayLoadLevelWord(filterWords)
    })
})
//Function For Filter Search Vocabulary END
