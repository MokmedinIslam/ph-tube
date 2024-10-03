// function getTimeString(time){
//     if(time < 86400){
//         const hour = parseInt(time / 3600);
//         let remainingSecond = time % 3600;
//         const minute = parseInt(remainingSecond / 60);
//         remainingSecond = remainingSecond % 60;
//         return `${hour} hour ${minute} minute ${remainingSecond} second ago`
//     }
//     else if(time < 31536000){
//         const month = parseInt(time / 86400);
//         remainingSecond = remainingSecond % 86400;
//         return `${month} month ago`
//     }
//     else(time >= 31536000){
//         const year = parseInt(time / 31536000);
//         return `${year} year ago`
//     }
// };
function getTimeString(time){
    // const year = parseInt(time / 31536000);
    // let remainingSecond = time % 31536000;
    // const month = parseInt(time / 86400);
    // remainingSecond = remainingSecond % 86400;
    const hour = parseInt(time / 3600);
    remainingSecond = time % 3600;
    const minute = parseInt(remainingSecond / 60);
    remainingSecond = remainingSecond % 60;
    return `${hour} hour ${minute} minute ${remainingSecond} second ago`
};

const removeActiveClass = () => {
    const buttons = document.getElementsByClassName("category-btn");
    console.log(buttons)
    for(let btn of buttons){
        btn.classList.remove("active");
    }
};

// 1. fetch, load and show Categories on html

// create loadCategories
const loadCategories = () => {
    // fetch the data 
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.error(error)
    )
};

const loadVideos = (searchText ="") => {
    // fetch the data 
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.error(error)
    )
};

const loadCategoryVideos = (id) => {
    // alert(id);
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
        // sobaike active class remove koro
        removeActiveClass();
        // id er class ke active koro
        const activeBtn = document.getElementById(`btn-${id}`);
        activeBtn.classList.add("active")
        displayVideos(data.category);
    })
    .catch((error) => console.error(error)
    )
};

const loadDetails = async(videoId) => {
    // console.log(videoId);
    const url =`https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(url);
    const data = await res.json();
    displayDetails(data.video);
};
const displayDetails = (video) => {
    console.log(video);
    const detailContainer = document.getElementById('modal-content');

    detailContainer.innerHTML=`
    <img src=${video.thumbnail} />
    <p>${video.description}</p>
    `;

    // way-1
    // document.getElementById("showModalData").click();
    // way-2
    document.getElementById('customModal').showModal();
};

// const cardDemo = {
//     "category_id": "1001",
//     "video_id": "aaag",
//     "thumbnail": "https://i.ibb.co/DRxB1Wm/sunris.jpg",
//     "title": "Sunrise Reverie",
//     "authors": [
//         {
//             "profile_picture": "https://i.ibb.co/yQFJ42h/ava.jpg",
//             "profile_name": "Ava Johnson",
//             "verified": false
//         }
//     ],
//     "others": {
//         "views": "1.1K",
//         "posted_date": "16950"
//     },
//     "description": "'Sunrise Reverie' by Ava Johnson takes listeners on a serene journey through tranquil melodies and soft harmonies. With 1.1K views, this track is perfect for morning relaxation or an evening wind-down. Ava's heartfelt lyrics and soothing voice create a sense of peace, making it a go-to for fans seeking calm and inspiration in their musical choices."
// };

const displayVideos = (videos) =>{
    const videoContainer = document.getElementById('videos');
    videoContainer.innerHTML="";
    if(videos.length == 0){
        videoContainer.classList.remove("grid");
        videoContainer.innerHTML =`
        <div class="min-h-[300] w-full flex flex-col gap-5 justify-center items-center">
        <img src="./assets/Icon.png" />
        <h2 class="text-center text-xl font-bold">No Content Here in this Category</h2>
        </div>
        `;
        return;
    }
    else{
        videoContainer.classList.add("grid");
    }

    videos.forEach(video => {
        // console.log(video)
        const card = document.createElement('div');
        card.classList = "card card-compact"
        card.innerHTML=`
         <figure class="h-[200px] relative">
    <img
      src=${video.thumbnail} class= "w-full h-full object-cover"
      alt="Shoes" />
      ${video.others.posted_date?.length == 0? "": `<span class="absolute right-3 bottom-3 bg-black text-white text-xs rounded p-1">${getTimeString(video.others.posted_date)}</span>`}  
    </figure>
    <div class="px-0 py-3 flex gap-3">    
        <div>
            <img class="w-10 h-10 rounded-full object-cover" src=${video.authors[0].profile_picture} />
        </div>
        <div>
            <h2 class="font-bold">${video.title}</h2>
            <div class="flex items-center gap-3">
                <p class="text-gray-400">${video.authors[0].profile_name}</p>
                ${video.authors[0].verified == true ? `<img class="w-5" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png"` : ""}
            </div>
            <p> <button onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error"> details</button> </p>
        </div>
    </div>
        `
        videoContainer.append(card);
    });
};

// {category_id: '1001', category: 'Music'}

// create displayCategories
const displayCategories = (categories) => {
    const categoryContainer = document.getElementById('categories');

    categories.forEach((item) => {
        console.log(item)
        // create a button

        const buttonContainer = document.createElement('div');
        buttonContainer.innerHTML=`
        <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn category-btn">
        ${item.category}
        </button>
        `
        
        // add button to category container
        categoryContainer.append(buttonContainer)
    });
};

document.getElementById('search-input').addEventListener("keyup", (e) =>{
    loadVideos(e.target.value);
});

loadCategories();
loadVideos();