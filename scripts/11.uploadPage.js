import { API_URL, ACCOUNT_NAME, TOKEN, POST_ID, ORIGIN } from "./constants.js";

let currentImgStorage = []; // 현재 총 이미지 스토리지
let submitState = false;
let uploadBtn;

window.addEventListener("DOMContentLoaded", () => {
	// textarea 높이 자동 조절.
	const textarea = document.querySelector(".textarea-input");
	textarea.addEventListener("input", textareaResize, false);
	uploadBtn = document.querySelector("#save-btn");
	isEditPost(POST_ID);
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

// 수정글이면 
function isEditPost(postId) {
  if(postId) {
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

async function setPostData(postId) {	
	apiPostData(postId).then((postData) => {
		const oldImgNames = postData.post.image;

		if (postData.post.content) {
			const textareaElement = document.querySelector(".textarea-input");
			textareaElement.value = postData.post.content;
		}
		// 기존 이미지 가져와서 달아주기.
		if (oldImgNames) {
			const oldImgStorage = oldImgNames.split(',', 3); // 이미지 최대 3장 까지 : 현재 이미지 10장까지 올리는 사람이 있음
			const postImgList = document.querySelector(".upload-img-list");
			for (let imgName of oldImgStorage) {
				currentImgStorage.push(imgName);
				let imgItem = `
              <li class="imgItem">
                <button type="button" class="btn-close">
                  <img src="../images/x.png" alt="" class="x">
                </button>
                <img src="${imgName}" alt="" />
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
			currentImgStorage.push(`${API_URL}/${changedFilename}`);
		} 
	})
	.catch((err) => {
		console.log(err);
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
async function apiEditPost() {
	const textareaElement = document.querySelector(".textarea-input");
	const filenames = currentImgStorage.join(',');
	const response = await fetch(`${API_URL}/post/${POST_ID}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + TOKEN,
		},
		body: JSON.stringify({
			post: {
				content: textareaElement.value,
				image: filenames
			},
		})	
	});
	const data = await response.json();
	return data;
}
// 새 게시물 업로드 api
async function apiUploadPost() {
	const textareaElement = document.querySelector(".textarea-input");
	const filenames = currentImgStorage.join(',');
	const response = await fetch(`${API_URL}/post`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + TOKEN,
		},
		body: JSON.stringify({
			post: {
				content: textareaElement.value,
				image: filenames
			}
		})	
	});
	const data = await response.json();
	return data;
}

// 업로드 버튼 클릭시
function clickUploadBtn() {
	const saveBtn = document.querySelector("#save-btn");
	saveBtn.addEventListener("click", () => {
		if (!saveBtn.classList.contains("disabled") && submitState) {
			handlePost();
		}
	});
}

// 업로드 버튼 기능
async function handlePost() {
	// 기존 게시물 수정이면
	if (POST_ID) {
		apiEditPost()
			.then((data) => {
				if (data) {
					resetAndMove();
				}})
			.catch((err) => console.log(err));
	} else {
		// 새 게시물 업로드이면
		apiUploadPost()
			.then((data) => {
				if (data) {
					dataReset();
					loacation.href = `${ORIGIN}/pages${pageName}`;
				}})
			.catch((err) => console.log(err));
	}
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
