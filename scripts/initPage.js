import { ORIGIN, TOKEN, ACCOUNT_NAME } from "./constants.js";
import { checkEmailValid, checkUserIdValid, join, getFeed, login, getAccount, getProfile, getFollowing, getFollower, loadUserData, updateProfile, profileImage, GetComment, editComment } from "./api.js";

let loc = [];
// 현재 페이지 읽기
if (document.location.href.includes("/pages")) {
	loc = document.location.href.split("/pages/")[1];
	if (loc.includes("?")) {
		loc = loc.split("?")[0];
	}
}
console.log(loc);

// 페이지별 init 함수 실행
switch (loc) {
	case "login_email.html":
		loginPage();
		break;
	case "login.html":
		loginPage();
		break;
	case "join_email.html":
		joinPage();
		break;
	case "home.html":
		checkToken();
		homePage();
		break;
	case "commentPage.html":
		checkToken();
		commentPage();
		break;
	case "chat_list.html":
		checkToken();
		break;
	case "chat_room.html":
		checkToken();
		break;
	case "search.html":
		checkToken();
		searchPage();
		break;
	case "profile.html":
		checkToken();
		profilePage();
		break;
	case "followers.html":
		checkToken();
		followPage();
		break;
	case "profile_modification.html":
		checkToken();
		profileModifyPage();
		break;
	default:
		splashPage();
		break;
}

// 로그인 상태가 아니면 메인 페이지로 이동
function checkToken() {
	if (!TOKEN) {
		location.href = `${ORIGIN}`;
	}
}

// 메인 페이지
function splashPage() {
	// index.html 화면이 로드되고 2초 뒤 로그인 화면으로 이동
	window.onload = setTimeout(() => {
		if (!!TOKEN) {
			// 토큰이 있는 경우 홈피드로 이동
			location.href = `${ORIGIN}/pages/home.html`;
		} else {
			// 토큰이 없는 경우 로그인 페이지로 이동
			location.href = `${ORIGIN}/pages/login.html`;
		}
	}, 1000);
}

// 로그인 페이지
function loginPage() {
	const loginEmailInput = document.querySelector("#login-cont-email");
	const loginPwdInput = document.querySelector("#login-cont-pwd");
	const loginSubmit = document.querySelector(".login-submit");

	// 입력을 완료한 경우 버튼 활성화
	// 아이디 입력
	if (loginEmailInput)
		loginEmailInput.addEventListener("input", function () {
			if (loginEmailInput.value === "" && loginPwdInput === "") {
				loginSubmit.disabled = true;
			} else if (loginEmailInput.value === "" || loginPwdInput.value === "") {
				loginSubmit.disabled = true;
			} else {
				loginSubmit.disabled = false;
				loginSubmit.classList.remove("disabled");
			}
		});

	// 비밀번호 입력
	if (loginPwdInput)
		loginPwdInput.addEventListener("input", function () {
			if (loginEmailInput.value === "" && loginPwdInput === "") {
				loginSubmit.disabled = true;
			} else if (loginEmailInput.value === "" || loginPwdInput.value === "") {
				loginSubmit.disabled = true;
			} else {
				loginSubmit.disabled = false;
				loginSubmit.classList.remove("disabled");
			}
		});

	const $loginBtn = document.querySelector(".login-submit");
	if ($loginBtn) {
		$loginBtn.addEventListener("click", login);
	}
}

// 회원가입 페이지
function joinPage() {
	const joinEmailInput = document.querySelector("#join-cont-email");
	const joinPwdInput = document.querySelector("#join-cont-pwd");
	const joinBtnNext = document.querySelector(".join-next");
	const emailWarnTxt = document.querySelector(".login-email-warn");
	const pwdWarnTxt = document.querySelector(".login-pwd-warn");
	const joinBtnSubmit = document.querySelector(".submit-btn");

	// 포커스를 잃었을 때 유효성 검사
	// 이메일 형식 유효성 검사
	joinEmailInput.addEventListener("focusout", async () => {
		const email = joinEmailInput.value;
		const regExp = new RegExp("^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\\.[A-Za-z0-9-]+");

		const validEmail = await checkEmailValid(email);
		if (validEmail && email != "" && regExp.test(email) == true) {
			emailWarnTxt.classList.remove("txt-hide", "login-warn");
			emailWarnTxt.innerText = "* 사용 가능한 이메일 입니다.";
		} else if (!regExp.test(email)) {
			emailWarnTxt.classList.remove("txt-hide");
			emailWarnTxt.classList.add("on");
			emailWarnTxt.innerText = "* 이메일 형식이 아닙니다.";
		} else {
			emailWarnTxt.innerText = "* 이미 가입된 이메일 주소입니다.";
			emailWarnTxt.classList.remove("txt-hide");
			emailWarnTxt.classList.add("on");
		}
	});

	joinPwdInput.addEventListener("focusout", async () => {
		const pw = joinPwdInput.value;
		if (pw === "") {
			pwdWarnTxt.classList.remove("txt-hide");
			pwdWarnTxt.classList.add("on");
		} else if (pw.length > 5) {
			joinBtnNext.classList.remove("disabled");
			joinBtnNext.disabled = false;
			pwdWarnTxt.classList.add("txt-hide");
		} else {
			pwdWarnTxt.innerText = "* 비밀번호는 6자 이상이어야 합니다.";
			pwdWarnTxt.classList.remove("txt-hide");
			pwdWarnTxt.classList.add("on");
		}
	});

	// 다음 버튼 클릭시 프로필 설정
	joinBtnNext.addEventListener("click", () => {
		document.querySelector("#setProfile").style.display = "block";
		document.querySelector("#emailJoinin").style.display = "none";
	});

	// join_membership
	const joinUserIdInput = document.querySelector("#user-id");
	const profileWarn = document.querySelector(".profile-warn");

	document.querySelector("#upload-profile").addEventListener("change", profileImage);

	// 계정 ID 포커스 잃었을때 유효성 검사
	joinUserIdInput.addEventListener("focusout", async () => {
		const userId = joinUserIdInput.value;
		const regExp = new RegExp("^[a-zA-Z0-9_.]+$");

		const validUserId = await checkUserIdValid(userId);
		// console.log(validUserId);
		if (!validUserId && userId != "" && regExp.test(userId) == true) {
			profileWarn.classList.remove("txt-hide");
			profileWarn.classList.remove("on");
			profileWarn.innerText = "* 사용 가능한 아이디 입니다.";
		} else if (!regExp.test(userId)) {
			profileWarn.classList.remove("txt-hide");
			profileWarn.classList.add("on");
			profileWarn.innerText = "* 영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.";
		} else {
			profileWarn.classList.remove("txt-hide");
			profileWarn.classList.add("on");
			profileWarn.innerText = "* 이미 사용중인 아이디 입니다.";
		}
	});

	joinBtnSubmit.addEventListener("click", join);
}

function homePage() {
	getFeed();
}

// 유저 검색
function searchPage() {
	const input = document.querySelector("#search-id");

	if (input)
		input.addEventListener("keyup", (e) => {
			getAccount(e.currentTarget);
		});
}

// 프로필 페이지
function profilePage() {
	let targetAccount = ACCOUNT_NAME;
	let isMyprofile = false;

	if (location.search != "") {
		targetAccount = location.search.replace("?", "");
		// 로그인 정보와 프로필이 일치
		if (ACCOUNT_NAME == targetAccount) {
			isMyprofile = true;
		}

		document.querySelector(".cont-followers").href = `followers.html?${targetAccount}?follower`;
		document.querySelector(".cont-followings").href = `followers.html?${targetAccount}?following`;
	} else {
		isMyprofile = true;
		document.querySelector(".cont-followers").href = `followers.html?${ACCOUNT_NAME}?follower`;
		document.querySelector(".cont-followings").href = `followers.html?${ACCOUNT_NAME}?following`;
	}
	getProfile(targetAccount);

	const btnViewList = document.querySelector("#toggle-list"); // 목록형 버튼
	const btnViewAlbum = document.querySelector("#toggle-album"); // 앨범형 버튼
	const viewList = document.querySelector(".list-post"); // 목록형 보기
	const viewAlbum = document.querySelector(".grid-post"); // 앨범형 보기

	// 목록형, 앨범형 토글
	function toggleView(show, hide) {
		show.firstElementChild.classList.toggle("off-view");
		show.firstElementChild.classList.toggle("on-view");
		show.lastElementChild.classList.toggle("on-view");
		show.lastElementChild.classList.toggle("off-view");

		hide.firstElementChild.classList.toggle("on-view");
		hide.firstElementChild.classList.toggle("off-view");
		hide.lastElementChild.classList.toggle("off-view");
		hide.lastElementChild.classList.toggle("on-view");
	}

	btnViewList.addEventListener("click", () => {
		if (btnViewList.firstElementChild.classList.contains("off-view")) {
			toggleView(btnViewList, btnViewAlbum);
			viewList.style.display = "block";
			viewAlbum.style.display = "none";
		}
	});

	btnViewAlbum.addEventListener("click", () => {
		if (btnViewAlbum.firstElementChild.classList.contains("off-view")) {
			toggleView(btnViewAlbum, btnViewList);
			viewAlbum.style.display = "grid";
			viewList.style.display = "none";
		}
	});
	// 게시물작성 버튼 누르면 로컬스토리지의 postId 초기화
	const addPostBtn = document.querySelector("#btn-add-post");

	addPostBtn.addEventListener("click", () => {
		if (localStorage.getItem("postId")) {
			localStorage.setItem("postId", "");
		}
	});
}

function followPage() {
	const tit_txt = document.querySelector(".tit-follow");
	let option = "";
	if (location.search != "") {
		option = location.search.replace("?", "");
		option = option.split("?");
	}
	if (option[1] === "follower") {
		getFollower(option[0]);
	} else if (option[1] === "following") {
		getFollowing(option[0]);
		tit_txt.textContent = "Following";
	} else {
		history.back();
	}
}

function profileModifyPage() {
	// profile_modification.html
	const uAccount = document.querySelector("#user-id");
	const btnSave = document.querySelector(".profile-save");
	const profileWarn = document.querySelector(".profile-warn");

	loadUserData();
	document.querySelector("#upload-profile").addEventListener("change", profileImage);
	btnSave.addEventListener("click", updateProfile);

	// // 계정 ID 포커스 잃었을때 유효성 검사
	uAccount.addEventListener("focusout", async () => {
		const userId = uAccount.value;
		// console.log(userId);
		const regExp = new RegExp("^[a-zA-Z0-9_.]+$");

		const validUserId = await checkUserIdValid(userId);
		// console.log(validUserId);
		if (!validUserId && userId != "" && regExp.test(userId) == true) {
			profileWarn.classList.remove("txt-hide");
			profileWarn.classList.remove("on");
			profileWarn.innerText = "* 사용 가능한 아이디 입니다.";
			btnSave.disabled = false;
			btnSave.classList.remove("disabled");
		} else if (!regExp.test(userId)) {
			profileWarn.classList.remove("txt-hide");
			profileWarn.classList.add("on");
			profileWarn.innerText = "* 영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.";
			btnSave.disabled = true;
			btnSave.classList.add("disabled");
		} else {
			profileWarn.classList.remove("txt-hide");
			profileWarn.classList.add("on");
			profileWarn.innerText = "* 이미 사용중인 아이디 입니다.";
			btnSave.disabled = true;
			btnSave.classList.add("disabled");
		}
	});
}

function commentPage() {
	const container = document.querySelector(".feed-container");
	const wrapComment = document.querySelector('.wrap-comment');
	let postId = localStorage.getItem('postId');
	GetComment(postId).then((value) => {
		for (let comment of value) {
			let commentAuthorImage = comment.author.image;
            let commentAuthorUsername = comment.author.username;
            let commentAuthorAccountname = comment.author.accountname;
            let commentCreatedAt = comment.createdAt;
            let commentContent = comment.content;
            let commentId = comment.id;
			let isMyprofile;

            if (ACCOUNT_NAME == commentAuthorAccountname) {
              isMyprofile = true;
            } 
			else {
              isMyprofile = false;
            }
            let btnCommentMsg = isMyprofile ? "modal-my-comment" : "modal-other-comment";
            const goURL = `6.profile.html?${commentAuthorAccountname}`;

			let list = document.createElement("article");
            list.innerHTML = `
              <ul class="wrap-profile comment">
                <li>
                  <a href=${goURL}><img src=${commentAuthorImage} alt="기본프로필 소형" class="basic-profile"></a>
                </li>
                <a href=>
                  <li>
                    <ul class="wrap-right">
                      <li class="user-name">${commentAuthorUsername}</li>
                      <small class="txt-date">&#183; ${commentCreatedAt}</small>
                    </ul>
                  </li>
                </a>
                <li><button type="button" class="${commentId} btn-more-modal ${btnCommentMsg}"><img src="../images/icon/s-icon-more-vertical.png" alt="더보기 버튼" class="s-icon-more-vertical"></button></li>
              </ul>
              <p>${commentContent}</p>
              `
			container.appendChild(list);
			wrapComment.innerHTML = `
			  <input type="file" name="" id="upload-profile" class="txt-hide">
			  <a href=${goURL}><img src=${commentAuthorImage} alt="기본프로필 소형" class="basic-profile"></a>
			  <form class="form-comment">
				<input class="input-comment" type="text" placeholder="댓글 입력하기..." cols="40" rows="5">
				<button class="btn-send">게시</button>
			  </form>
			`
		}
        const btnSend = document.querySelector('.btn-send');
        const inputComment = document.querySelector('.input-comment');

        wrapComment.addEventListener('input', () => {
          btnSend.classList.add('active');
          if (inputComment.value == "") {
            btnSend.classList.remove('active');
          }
          else {
            btnSend.classList.add('active');
			console.log(inputComment.value)
          }
        })
		btnSend.addEventListener('click', () => {
			editComment(postId, inputComment.value);
		  })
	})
}