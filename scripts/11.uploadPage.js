import { API_URL, ACCOUNT_NAME, TOKEN, POST_ID } from "./constants.js";

let oldImgStorage = []; // 기존 이미지 src 저장소
let currentImgStorage = []; // 현재 총 이미지 스토리지
let newImgNames = ""; // 변환된 이미지이름(들) 저장소
let oldImgNames = ""; // 받아온 변환된 이미지이름 문자열.
let submitState = false;
let uploadBtn;

window.addEventListener("DOMContentLoaded", () => {
	// textarea 높이 자동 조절.
	const textarea = document.querySelector(".textarea-input");
	textarea.addEventListener("input", textareaResize, false);
	uploadBtn = document.querySelector("#save-btn");
	checkNewOrEdit(POST_ID);
	addPreviewImg();
	deleteImg();
	clickUploadBtn();
	setProfileImg();
});

function textareaResize() {
	this.style.height = "auto";
	this.style.height = this.scrollHeight + "px";
	checkBtnActive();
}

// 수정인지 새글인지 판단
function checkNewOrEdit(postId) {
	if (postId) {
		console.log(`postid 있음 : ${postId}`);
		setPostData(postId);
	}
}

//프로필 사진 가져오기
async function apiProfileImg() {
	const response = await fetch(`${API_URL}/profile/${ACCOUNT_NAME}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		}
	});
	const data = await response.json();
	return data.profile['image']
}

async function setProfileImg() {
	const profileImg = document.querySelector("#feed-profile");
	const  image = await apiProfileImg();
	
	profileImg.src = image;
}

// 기존 게시물 내용 로딩
async function apiPostData(postId) {
	const response = await fetch(`${API_URL}/post/${postId}`, {
		headers: {
			Authorization: "Bearer " + TOKEN,
			"Content-type": "application/json",
		},
	});

	return await response.json();
}

async function setPostData() {
	const textareaElement = document.querySelector(".textarea-input");
	const postImgList = document.querySelector(".upload-img-list");

	apiPostData(POST_ID).then((postData) => {
		textareaElement.value = postData.post.content;
		oldImgNames = postData.post.image;

		// 기존 이미지 가져와서 달아주기.
		if (oldImgNames) {
			oldImgStorage = oldImgNames.split(',', 3); // 이미지 최대 3장 까지 : 현재 이미지 10장까지 올리는 사람이 있음
			for (let image of oldImgStorage) {
				currentImgStorage.push(image);
				let imgItem = `
              <li class="imgItem">
                <button type="button" class="btn-close">
                  <img src="../images/x.png" alt="" class="x">
                </button>
                <img src="${image}" alt="" />
              </li>`;
				postImgList.insertAdjacentHTML("beforeend", imgItem);
			}
		}
		checkBtnActive();
	});
}

// 새로 선택한 이미지 미리보기 처리
function addPreviewImg() {
	const imgInput = document.querySelector("#feedImgInput");
	const postImgList = document.querySelector(".upload-img-list");

	imgInput.addEventListener("change", (e) => {
		if (isFullImgList(postImgList)) {
			handleFile(e.target.files[0]);
		} else {
			alert("이미지는 최대 3개까지 업로드할 수 있습니다.");
		}
	});
}

function isFullImgList(itemList) {
	if (itemList.childElementCount >= 3) {
		return false
	} else {
		return true
	}
}

function handleFile(file) {
	const postImgList = document.querySelector(".upload-img-list");
	const reader = new FileReader();
	reader.onload = (e) => {
		//딥다이브 책에 나와있던거 참고해서 리팩하기.. fragnent 어쩌고
		let imgItem = `
			<li class="imgItem" file="${file}">
				<button type="button" class="btn-close">
					<img src="../images/x.png" alt="" class="x">
				</button>
				<img src="${e.target.result}" alt="" / >
			</li>`;
		postImgList.insertAdjacentHTML("beforeend", imgItem);
		checkBtnActive();
	}
	reader.readAsDataURL(file);
	handleFilename(file);
}

// 이미지 삭제 버튼 동작
function deleteImg() {
	const imgList = document.querySelector(".upload-img-list");

	imgList.addEventListener("click", (e) => {
		const postImgListItem = document.querySelectorAll(".upload-img-list li");

		for (let idx = 0; idx < e.currentTarget.children.length; idx++) {
			if (e.target === imgList.children[idx].firstElementChild.firstElementChild) {
				currentImgStorage.splice(idx, 1);
				postImgListItem[idx].remove();
				checkBtnActive();
				return;
			}
		}
	});
}

async function handleFilename(file) {
	apiGetFilename(file).then((changedFilename) => {
		if (!changedFilename){
			addRetryImgBtn();
		} else {
			console.log("파일이름 가져오기 성공")
			currentImgStorage.push(`${API_URL}/${changedFilename}`);
		} 
	})
	.catch((err) => {
		console.log(err);
		// addRetryImgBtn();
	})
}

// 서버에서 파일이름 변환해오기
async function apiGetFilename(file) {
	const formData = new FormData();
	formData.append('image',file)
	try{
		const response = await fetch(`${API_URL}/image/uploadfile`, {
			method: "POST",
			body : formData
		});
		const data = await response.json();
	
		const changedFilename = data["filename"];
		console.log(changedFilename)
		return changedFilename;

	}catch(err){
		console.log(err)
	}
	
}

// 게시물 수정 api
async function apiEditPost(headers, body) {
	const response = await fetch(`${API_URL}/post/${POST_ID}`, {
		method: "PUT",
		headers,
		body,
	});
	const data = await response.json();
	return data;
}
// 새 게시물 업로드 api
async function apiUploadPost(headers, body) {
	const response = await fetch(`${API_URL}/post`, {
		method: "POST",
		headers,
		body,
	});
	const data = await response.json();
	return data;
}

// 업로드 버튼 클릭시
function clickUploadBtn() {
	const saveBtn = document.querySelector("#save-btn");
	saveBtn.addEventListener("click", () => {
		if (!saveBtn.classList.contains("disabled")) {
			postUpload();
		}
	});
}

// 업로드 버튼 기능
async function postUpload() {
	const textareaElement = document.querySelector(".textarea-input");

	uploadBtn.addEventListener("click", async (event) => {
		if (submitState) {
			let headers;
			let body;
			//storage에서 이미지 한 문자열로 만들기 
			const filenames = currentImgStorage.join(',');
			console.log(filenames)
			
			//헤더, 바디 설정
			headers = {
				"Content-Type": "application/json",
				Authorization: "Bearer " + TOKEN,
			};

			body = JSON.stringify({
				post: {
					content: textareaElement.value,
					image: filenames
				},
			});		
			// 기존 게시물 수정이면
			if (POST_ID) {
				apiEditPost(headers, body)
					.then((data) => {
						if (data) {
							resetAndMove();
						}
					})
					.catch((err) => console.log(err));
			} else {
				// 새 게시물 업로드이면
				apiUploadPost(headers, body)
					.then((data) => {
						if (data) {
							resetAndMove();
						}
					})
					.catch((err) => console.log(err));
			}
		}
	});
}

function resetAndMove() {
	dataReset();
	href("/profile.html");
}

function dataReset() {
	const inputs = document.querySelectorAll("INPUT");
	const textarea = document.querySelector("TEXTAREA");

	localStorage.setItem("postId", "");

	// 텍스트, 이미지값 초기화
	inputs.forEach((item) => {
		item.value = "";
		textarea.value = "";
		if (item.getAttribute("type") == "file") {
			const imgList = document.querySelector(".upload-img-list");
			removeAllChildNodes(imgList);
			oldImgStorage = [];
			currentImgStorage = [];
		}
	});
}

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

function href(pageName) {
	const routeTag = document.createElement("a");
	routeTag.id = "routeTag";
	routeTag.href = `/pages${pageName}`;
	document.querySelector(".container").appendChild(routeTag);
	document.querySelector("#routeTag").click();
}
//업로드 유효 검사
function checkBtnActive() {
	const textareaElement = document.querySelector(".textarea-input");
	const imgList = document.querySelectorAll(".upload-img-list li");
	const uploadBtn = document.querySelector("#save-btn");

	if (textareaElement.value.length != 0 || imgList.length >= 1) {
		uploadBtn.classList.remove("disabled");
		submitState = true;
	} else {
		uploadBtn.classList.add("disabled");
		submitState = false;
	}
}
