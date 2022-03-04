import { likePost, cancellikePost, reportPost, deletePost, deleteProduct, editPost, editProduct, GetComment, editComment, deleteComment, reportComment } from "./api.js";
import { ORIGIN } from "./constants.js";

// 미니 프로필 반환 함수
export function getMiniProfile(target, key) {
	let name = target.username.replace(key, `<span style="color:orange; font-weight:500;">${key}</span>`);
	let accountname = target.accountname.replace(key, `<span style="color:orange; font-weight:500;">${key}</span>`);
	const goURL = `${ORIGIN}/pages/profile.html?${target.accountname}`; // 프로필 바로가기 링크
	let profile = document.createElement("article");
	profile.classList = "box-profile";
	profile.innerHTML = `<ul class="wrap-profile">
    <li>
      <a href=${goURL}><img src=${target.image} onerror="this.src='${ORIGIN}/images/basic-profile-img.png';" alt="기본프로필 소형" class="basic-profile"></a>
    </li>
    <li>
      <a href=${goURL}>
        <ul class="wrap-right">
          <li class="user-name" style="display: block;">${name}</li>
          <li class="user-id" style="display: block;">@ ${accountname}</li>
        </ul>
      </a>
    </li>
  </ul>`;

	return profile;
}

// 개별 게시물 로드
export function loadPost(idx, post, imageArr, imageLength, isMyprofile, authorName) {
	const goURL = `${ORIGIN}/pages/profile.html?${authorName}`;

	let btnMsg = isMyprofile ? "modal-my-edit" : "modal-other-edit";

	let images = "";
	let list = document.createElement("article");
	list.classList = "home-post";
	list.classList.add(post.id);

	let date = post.createdAt.slice(0, 10).split("-");
	// 이미지가 있을 때
	if (post.image) {
		for (let image of imageArr) {
			images += `<div><img src=${image} alt="피드 이미지" onerror="this.src='${ORIGIN}/images/post-img-example.png';" class="img-feed"></div>`;
		}
		// 다중 이미지 처리
		if (imageLength > 1) {
			let btn = "";
			for (let i = 0; i < imageLength; i++) {
				btn += `<button type="button" class="btn-image btn-image${idx}" id="btn${idx}-${i}"></button>`;
			}
			btn = `<div class="wrap-btn">${btn}</div>`;
			images = `<div class="wrap-images" id="wrap-images${idx}">${images}</div>${btn}`;
		}
	}
	// console.log(post.hearted)
	let heartimage = post.hearted
		? `<img src="${ORIGIN}/images/icon/icon-heart-active.png" alt="좋아요 이미지" class="icon-heart">`
		: `<img src="${ORIGIN}/images/icon/icon-heart.png" alt="좋아요 이미지" class="icon-heart">`;

	list.innerHTML = `<section>
    <h5 class="txt-hide">피드 게시글</h5>
    <ul class="wrap-profile">
      <li>
        <a href=${goURL}><img src=${post.author.image} onerror="this.src='${ORIGIN}/images/basic-profile-img.png';" alt="기본프로필 소형" class="basic-profile"></a>
      </li>
      <a href=${goURL}>
        <li>
          <ul class="wrap-right">
            <li class="user-name">${post.author.username}</li>
            <li class="user-id">@ ${post.author.accountname}</li>
          </ul>
        </li>
      </a>
      <li><button type="button" class="${post.id} btn-more-modal ${btnMsg}"><img src="${ORIGIN}/images/icon/s-icon-more-vertical.png" alt="더보기 버튼" class="s-icon-more-vertical"></button></li>
    </ul>
  </section>
  <section class="main-feed">
    <p class="txt-feed">
    ${post.content}
    </p>
    ${images}
    <ul class="wrap-reaction">
      <li class="wrap-like-btn ${post.id} ${post.heartCount}  ${post.hearted}">
      <button>${heartimage}</button><span class="like-count">${post.heartCount}</span>
      </li>
      <li>
        <button class="${post.id} btn-comment"><img src="${ORIGIN}/images/icon/icon-message-circle.png" alt="댓글 이미지" class="chat-icon-message-circle"></button><span>${post.commentCount}</span>
      </li>
    </ul>
    <small class="txt-date">${date[0]}년 ${date[1]}월 ${date[2]}일</small>
  </section>
  <section class="comment hidden">
    
  </section>`;
	return list;
}

// 다중 이미지 슬라이드(스크롤) 유틸 함수
export function handleImageScroll(idx, imageLength) {
	let btnImage = document.querySelectorAll(`.btn-image${idx - 1}`);
	let wrapImages = document.querySelector(`#wrap-images${idx - 1}`);
	if (!wrapImages) {
		return;
	}
	// let imageSize = wrapImages.getBoundingClientRect().width;
	let imageSize = wrapImages.clientWidth;
	let pos = 0; // 현재 보고 있는 이미지

	btnImage.forEach((btn) => {
		btn.addEventListener("click", () => {
			pos = btn.id[btn.id.length - 1];
			wrapImages.scroll({
				left: imageSize * pos,
				behavior: "smooth",
			});
		});
	});
	let scrollLeft;
	// 스크롤 동작
	wrapImages.addEventListener("scroll", () => {
		scrollLeft = wrapImages.scrollLeft;
		pos = scrollLeft / imageSize;
		pos = Math.round(pos);
		for (let i = 0; i < imageLength; i++) {
			if (i == pos) {
				btnImage[i].style.background = "orange";
			} else {
				btnImage[i].style.background = "lightgray";
			}
		}
	});
}

// 좋아요 버튼
export function BtnLike() {
	let btn_like = document.getElementsByClassName("wrap-like-btn");
	let icon_heart = document.getElementsByClassName("icon-heart");
	let like_count = document.getElementsByClassName("like-count");

	for (let i = 0; i < btn_like.length; i++) {
		btn_like[i].addEventListener("click", () => {
			let postId = btn_like[i].classList[1];
			let HeartCount = btn_like[i].classList[2];
			let isHearted = btn_like[i].classList[3];
			console.log(isHearted);
			console.log(HeartCount);
			if (isHearted == "false") {
				likePost(postId);
				isHearted = "true";
				HeartCount = parseInt(HeartCount) + 1;
				btn_like[i].classList.remove(btn_like[i].classList[3]);
				btn_like[i].classList.remove(btn_like[i].classList[2]);
				btn_like[i].classList.add(HeartCount);
				btn_like[i].classList.add(isHearted);
				icon_heart[i].src = `${ORIGIN}/images/icon/icon-heart-active.png`;
			} else {
				cancellikePost(postId);
				isHearted = "false";
				HeartCount = parseInt(HeartCount) - 1;
				btn_like[i].classList.remove(btn_like[i].classList[3]);
				btn_like[i].classList.remove(btn_like[i].classList[2]);
				btn_like[i].classList.add(HeartCount);
				btn_like[i].classList.add(isHearted);
				icon_heart[i].src = `${ORIGIN}/images/icon/icon-heart.png`;
			}
			console.log(isHearted);
			console.log(HeartCount);
			like_count[i].innerHTML = HeartCount;
		});
	}
}

// 모달창 구현
function close_alert() {
	const Alert_btnOne = document.querySelector(".alert-btn-one");
	const Modal = document.querySelector(".modal");
	const ModalAlert = document.querySelector(".modal-alert");
	Alert_btnOne.addEventListener("click", () => {
		ModalAlert.style.display = "none";
		Modal.classList.remove("open");
		document.querySelector(".top-modal").classList.remove("open");
	});
}
function alert_message(option) {
	const Alert_msg = document.querySelector(".alert-message");
	const Alert_btnOne = document.querySelector(".alert-btn-one");
	const Alert_btnTwo = document.querySelector(".alert-btn-two");
	const Modal = document.querySelector(".modal");
	const ModalAlert = document.querySelector(".modal-alert");
	if (option == "logout") {
		Alert_msg.innerHTML = "로그아웃하시겠어요?";
		Alert_btnOne.innerHTML = "취소";
		Alert_btnTwo.innerHTML = "로그아웃";
	} else if (option == "report_comment") {
		Alert_msg.innerHTML = "댓글을 신고할까요?";
		Alert_btnOne.innerHTML = "취소";
		Alert_btnTwo.innerHTML = "신고";
	} else if (option == "delete_comment") {
		Alert_msg.innerHTML = "댓글을 삭제할까요?";
		Alert_btnOne.innerHTML = "취소";
		Alert_btnTwo.innerHTML = "삭제";
	} else if (option == "report_edit") {
		Alert_msg.innerHTML = "게시글을 신고할까요?";
		Alert_btnOne.innerHTML = "취소";
		Alert_btnTwo.innerHTML = "신고";
	} else if (option == "delete_edit") {
		Alert_msg.innerHTML = "게시글을 삭제할까요?";
		Alert_btnOne.innerHTML = "취소";
		Alert_btnTwo.innerHTML = "삭제";
	} else if (option == "delete_product") {
		Alert_msg.innerHTML = "상품을 삭제할까요?";
		Alert_btnOne.innerHTML = "취소";
		Alert_btnTwo.innerHTML = "삭제";
	}
	Modal.style.bottom = "-240px";
	ModalAlert.style.display = "block";
}

// function close_modal(Modal) {
// 	window.addEventListener("click", () => {
// 		window.addEventListener(
// 			"click",
// 			(e) => {
// 				if (e.target != Modal) {
// 					console.log(e.target)
// 					Modal.style.bottom = "-240px";
// 					Modal.classList.remove("open");
// 				}
// 				// if (e.target.tagName == "IMG") {
// 				// 	console.log("1")
// 				// 	console.log(e.target)
// 				// 	Modal.style.bottom = "-240px";
// 				// 	Modal.classList.remove("open");
// 				// }
// 			},
// 			true
// 		);
// 	});
// }

function close_modal(Modal) {
	window.addEventListener("click", () => {
		window.addEventListener(
			"click",
			() => {
					Modal.style.bottom = "-240px";
			},
			true
		);
	});
}

if (document.querySelector(".top-btn-more-modal")) {
	const topbtnMoreModal = document.querySelector(".top-btn-more-modal");
	const topModal = document.querySelector(".top-modal");
	const topbtnOne = document.querySelector(".top-btn-one");
	const topbtnTwo = document.querySelector(".top-btn-two");
	const Alert_btnTwo = document.querySelector(".alert-btn-two");

	topbtnMoreModal.addEventListener("click", () => {
		topModal.classList.toggle("open");
		if (topModal.classList.contains("open")) {
			close_modal(topModal);
			if (topbtnMoreModal.classList.contains("modal-profile")) {
				topModal.style.bottom = "-90px";
				topbtnTwo.addEventListener("click", () => {
					alert_message("logout");
					close_alert();
					Alert_btnTwo.addEventListener("click", () => {
						localStorage.clear();
						window.location.href = `${ORIGIN}/pages/login.html`;
					});
				});
			} else if (topbtnMoreModal.classList.contains("modal-chat-room")) {
				topbtnOne.innerHTML = "채팅방 나가기";
				topbtnOne.href = `${ORIGIN}/pages/chat_list.html`;
				topModal.style.bottom = "-140px";
			}
		} else {
			topModal.style.bottom = "-240px";
		}
	});
}
// 버튼이 동적으로 생성되고 나서 호출됩니다.
export async function getBtn() {
	const btnOne = document.querySelector(".btn-one");
	const btnTwo = document.querySelector(".btn-two");
	const btnMoreModal = document.querySelectorAll(".btn-more-modal");
	const Modal = document.querySelector(".modal");
	const ModalAlert = document.querySelector(".modal-alert");
	const Alert_btnOne = document.querySelector(".alert-btn-one");
	const Alert_btnTwo = document.querySelector(".alert-btn-two");
	btnMoreModal.forEach((btn) => {
		btn.addEventListener("click", () => {
			let postId;
			let commentId;
			let productId;
			if (btn.classList.contains("modal-my-comment") || (btn.classList.contains("modal-other-comment"))) {
				commentId = btn.classList.item(0);
				localStorage.setItem("commentId", commentId);
				postId = localStorage.getItem("postId");
			}
			else {
				postId = btn.classList.item(0);
				productId = btn.classList.item(0);
				localStorage.setItem("productId", productId);
				localStorage.setItem("postId", postId);
			}
			Modal.classList.toggle("open");
			if (Modal.classList.contains("open")) {
				close_modal(Modal);
				if (btn.classList.contains("modal-my-edit")) {
					Modal.style.bottom = "-90px";
					btnOne.addEventListener("click", () => {
						alert_message("delete_edit");
						close_alert();
						Alert_btnTwo.addEventListener("click", async () => {
							deletePost(postId);
							ModalAlert.style.display = "none";
							window.location.href = `${ORIGIN}/pages/profile.html`;
						});
					});
					btnTwo.addEventListener("click", () => {
						window.location.href = `${ORIGIN}/pages/uploadPage.html`;
						editPost(postId);
					});
				} else if (btn.classList.contains("modal-other-edit")) {
					Modal.style.bottom = "-140px";
					btnOne.textContent = "신고하기";
					btnOne.addEventListener("click", () => {
						alert_message("report_edit");
						close_alert();
						Alert_btnTwo.addEventListener("click", async () => {
							reportPost(postId);
							ModalAlert.style.display = "none";
							Modal.classList.remove("open");
						});
					});
				} else if (btn.classList.contains("modal-product")) {
					Modal.style.bottom = "-40px";
					btnOne.addEventListener("click", () => {
						alert_message("delete_product");
						close_alert();
						Alert_btnTwo.addEventListener("click", async () => {
							deleteProduct(productId);
							ModalAlert.style.display = "none";
							document.location.reload(true);
						});
					});
					btnTwo.addEventListener("click", () => {
						window.location.href = `${ORIGIN}/pages/addProduct.html`;
						editProduct(productId);
					});
				} else if (btn.classList.contains("modal-my-comment")) {
					Modal.style.bottom = "-140px";
					btnOne.textContent = "삭제";
					btnOne.addEventListener("click", () => {
						alert_message("delete_comment");
						close_alert();
						Alert_btnTwo.addEventListener("click", async () => {
							deleteComment(postId, commentId);
							ModalAlert.style.display = "none";
							window.location.reload()
						});
					});
				} else if (btn.classList.contains("modal-other-comment")) {
					Modal.style.bottom = "-140px";
					btnOne.textContent = "신고하기";
					btnOne.addEventListener("click", () => {
						alert_message("report_comment");
						close_alert();
						Alert_btnTwo.addEventListener("click", async () => {
							reportComment(postId, commentId);
							ModalAlert.style.display = "none";
							Modal.classList.remove("open");
						});
					});
				}
			} else {
				Modal.style.bottom = "-240px";
			}
		});
	});
}

export async function BtnComment() {
	const btn_comment = document.getElementsByClassName("btn-comment");
	const home_post = document.getElementsByClassName("home-post");
	for (let i = 0; i < home_post.length; i++) {
		btn_comment[i].addEventListener("click", () => {
			let postId = btn_comment[i].classList[0];
			localStorage.setItem('postId', postId);
			let list = home_post[i].outerHTML
			console.log(list)
			localStorage.setItem('selectPost', list);
			location.href = `${ORIGIN}/pages/commentPage.html?${postId}`;
		});
	}
}