import { API_URL, ACCOUNT_NAME, TOKEN, ID, ORIGIN } from "./constants.js";
import { getMiniProfile, loadPost, handleImageScroll, BtnLike, getBtn, BtnComment } from "./script.js";

// login API
export async function login() {
	const email = document.querySelector("#login-cont-email").value;
	const pw = document.querySelector("#login-cont-pwd").value;
	const loginData = {
		user: {
			email: email,
			password: pw,
		},
	};
	try {
		const url = API_URL + "/user/login";
		const res = await fetch(url, {
			//메소드 구분
			method: "POST",
			//헤더
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(loginData),
		});
		const json = await res.json();
		const token = json.user.token;
		console.log(json.user);
		localStorage.setItem("Token", token);
		localStorage.setItem("AccountName", json.user.accountname);
		localStorage.setItem("Id", json.user._id);
		location.href = "./home.html";
	} catch (err) {
		// console.log('로그인 실패. input을 초기화합니다.')
		document.querySelector(".login-warn").classList.add("on");
		document.querySelector("#login-cont-email").value = null;
		document.querySelector("#login-cont-pwd").value = null;
	}
}

// 이메일 중복체크
export async function checkEmailValid(email) {
	const url = API_URL + `/user/emailvalid`;
	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			user: {
				email: email,
			},
		}),
	});
	const json = await res.json();
	return json.message == "사용 가능한 이메일 입니다." ? true : false;
}

// 계정 ID 중복검사
export async function checkUserIdValid(accountname) {
	const url = API_URL + `/user`;
	const res = await fetch(url, {
		method: "GET",
	});
	const json = await res.json();
	for (let item of json) {
		if (accountname == item["accountname"]) {
			return true;
		}
	}
}

// 서버로 데이터 전송
export async function join() {
	const email = document.querySelector("#join-cont-email").value;
	const pw = document.querySelector("#join-cont-pwd").value;
	const userName = document.querySelector("#user-name").value;
	const userId = document.querySelector("#user-id").value;
	const intro = document.querySelector("#user-intro").value;
	const imgSrc = document.querySelector(".profile-img").src;

	if (imgSrc === "") {
		this.imgSrc = API_URL + "/images/Ellipse.png";
	}
	try {
		const url = API_URL + "/user";
		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user: {
					email: email,
					password: pw,
					username: userName,
					accountname: userId,
					intro: intro,
					image: imgSrc,
				},
			}),
		});
		location.href = `${ORIGIN}/pages/login.html`;
	} catch (err) {
		alert(err);
	}
}

// 프로필 이미지 업로드
export async function imageUpload(files) {
	const url = API_URL + "/image/uploadfile";
	const formData = new FormData();
	formData.append("image", files[0]);
	const res = await fetch(url, {
		method: "POST",
		body: formData,
	});
	const data = await res.json();
	// console.log(data);
	const productImgName = data["filename"];
	return productImgName;
}

// 기존 데이터 불러오기
export async function loadUserData() {
	const uName = document.querySelector("#user-name");
	const uIntro = document.querySelector("#user-intro");
	const uImg = document.querySelector(".profile-img");

	const url = API_URL + "/user";
	const res = await fetch(url, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
		body: JSON.stringify({
			user: {
				username: uName,
				accountname: ACCOUNT_NAME,
				intro: uIntro,
				image: uImg,
			},
		}),
	});
	const json = await res.json();
	console.log(json);
	document.querySelector(".profile-img").src = json["user"]["image"];
	document.querySelector("#user-name").value = json["user"]["username"];
	document.querySelector("#user-id").value = json["user"]["accountname"];
	document.querySelector("#user-intro").value = json["user"]["intro"];
}

export async function profileImage(e) {
	const files = e.target.files;
	const result = await imageUpload(files);
	const url = API_URL + "/" + result;
	document.querySelector(".profile-img").src = url;
}

// 서버로 전달
export async function updateProfile() {
	const name = document.querySelector("#user-name").value;
	const id = document.querySelector("#user-id").value;
	const intro = document.querySelector("#user-intro").value;
	const imgUrl = document.querySelector(".profile-img").src;

	const url = API_URL + "/user";

	try {
		const res = await fetch(url, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${TOKEN}`,
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				user: {
					username: name,
					accountname: id,
					intro: intro,
					image: imgUrl,
				},
			}),
		});
		// 로컬스토리지에 있는 accountName 업데이트
		localStorage.setItem("AccountName", id);

		// 버튼 누르면 프로필로 이동
		location.href = `${ORIGIN}/pages/profile.html`;
	} catch (err) {
		console.log(err);
	}
}

// 홈 피드 불러오기
export async function getFeed() {
	const url = API_URL + `/post/feed`;
	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
	});
	const json = await res.json();

	// 게시물 없음
	if (json.posts.length == 0) {
		const feed = document.querySelector(".feed-cont");
		if (feed) {
			feed.style.display = "block";
		}
		return;
	}
	let idx = 0;
	let isMyprofile = false;
	for (let post of json.posts) {
		const authorAccount = post.author.accountname;
		if (ACCOUNT_NAME == post.author.accountname) {
			isMyprofile = true;
		} else {
			isMyprofile = false;
		}
		const container = document.querySelector(".container");
		let imageArr = [];
		try {
			imageArr = post.image.split(",");
		} catch {
			imageArr.push(post.image);
		}
		let imageLength = imageArr.length;
		let list = loadPost(idx, post, imageArr, imageLength, isMyprofile, authorAccount);
		if (container) container.appendChild(list);
		if (imageLength > 1) {
			handleImageScroll(++idx, imageLength);
		}
	}
	BtnLike();
	BtnComment();
	getBtn();
}

// 계정 프로필
export async function getAccount(searching) {
	const wrapProfile = document.querySelector(".res-search");

	while (wrapProfile.firstElementChild) {
		wrapProfile.removeChild(wrapProfile.firstElementChild);
	}
	const key = searching.value;
	console.log(key);

	const url = API_URL + `/user/searchuser/?keyword=${key}`;
	// 계정 정보가 없을 때
	if (!ACCOUNT_NAME) {
		return;
	}
	try {
		const res = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${TOKEN}`,
				"Content-type": "application/json",
			},
		});
		const json = await res.json();
		json.forEach((person) => {
			let profile = getMiniProfile(person, key);
			wrapProfile.appendChild(profile);
			if (json.length > 10) {
				wrapProfile.style.height = "100%";
			} else {
				wrapProfile.style.height = "100vh";
			}
		});
	} catch (err) {
		console.log(err);
	}
}

// 프로필 정보 가져오기
export async function getProfile(currentProfile) {
	let isMyprofile = currentProfile == ACCOUNT_NAME ? true : false;
	const url = API_URL + `/profile/${currentProfile}`;
	// 계정 정보가 없을 때
	if (!currentProfile) {
		return;
	}
	try {
		const res = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${TOKEN}`,
				"Content-type": "application/json",
			},
		});
		const json = await res.json();
		const profile = json.profile;

		let followerCount = profile.followerCount ? json.profile.followerCount : 0;
		let isfollow = profile.isfollow;

		// 팔로우/언팔로우 버튼 변화
		const btnFollowUnfollow = document.querySelector("#btn-profile_view_follow");
		const numberFollower = document.querySelector(".number-follower");

		if (isfollow) {
			btnFollowUnfollow.classList.add("activ");
			btnFollowUnfollow.textContent = "언팔로우";
		} else {
			btnFollowUnfollow.classList.remove("activ");
		}

		btnFollowUnfollow.addEventListener("click", (e) => {
			btnFollowUnfollow.classList.toggle("activ");
			if (btnFollowUnfollow.classList.contains("activ")) {
				btnFollowUnfollow.textContent = "언팔로우";
				follow(currentProfile);
				numberFollower.textContent = isfollow ? followerCount : followerCount + 1;
			} else {
				btnFollowUnfollow.textContent = "팔로우";
				unfollow(currentProfile);
				numberFollower.textContent = isfollow ? followerCount - 1 : followerCount;
			}
		});

		const userImage = document.querySelector("#img-profile");
		const followers = document.querySelector(".number-follower");
		const followings = document.querySelector(".number-following");
		const userName = document.querySelector(".name-user");
		const userId = document.querySelector(".id-user");
		const descUser = document.querySelector(".desc-user");

		userImage.src = profile.image;
		followers.textContent = followerCount;
		followings.textContent = profile.followingCount ? profile.followingCount : 0;
		userName.textContent = profile.username;
		userId.textContent = `@ ${profile.accountname}`;
		descUser.textContent = profile.intro;
		await getProductList(currentProfile);
		await getPost(currentProfile);
	} catch (err) {
		console.log(err);
	}
	const myprofile = document.querySelector(".my_profile");
	const otherprofile = document.querySelector(".other_profile");
	if (isMyprofile == true) {
		myprofile.style.display = "none";
		otherprofile.style.display = "block";
	} else {
		myprofile.style.display = "flex";
		otherprofile.style.display = "none";
	}
}

// 판매중인 상품 리스트
async function getProductList(targetName) {
	const url = API_URL + `/product/${targetName}`;
	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
	});
	const json = await res.json();
	if (json.data == 0) {
		document.querySelector(".wrap-items").style.display = "none";
		return;
	}
	let price = json.product[0].price.toLocaleString();
	let isMyprofile = targetName == ACCOUNT_NAME;
	const slider = document.querySelector(".slider");
	for (let product of json.product) {
		let item = document.createElement("button");
		let price = product.price.toLocaleString();
		item.type = "button";
		item.classList.add(product.id);
		item.classList.add("product");
		if (isMyprofile == true) {
			item.classList.add("modal-product");
		} else {
			item.classList.add("modal-other-edit");
		}
		item.classList.add("btn-more-modal");
		item.innerHTML = `<h5 class="txt-hide">상품 썸네일</h5>
    <img src=${product.itemImage} alt="상품 이미지" class="img-product">
    <p class="tit-product">${product.itemName}</p>
    <p class="price-product">${price}원</p>`;
		slider.appendChild(item);
	}
}

// 프로필 게시물 로드
async function getPost(currentProfile) {
	let isMyprofile = currentProfile == ACCOUNT_NAME ? true : false;
	const url = API_URL + `/post/${currentProfile}/userpost`;

	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
	});

	const json = await res.json();
	// 게시물 없음
	if (json.post.length == 0) {
		document.querySelector(".feed").style.display = "none";
		return;
	}

	let idx = 0;
	for (let post of json.post) {
		let imageArr = [];
		if (post.image && post.image.includes(",")) {
			imageArr = post.image.split(",");
		} else if (post.image != "") {
			imageArr.push(post.image);
		}
		let imageLength = imageArr.length;
		let list = loadPost(idx, post, imageArr, imageLength, isMyprofile, currentProfile);
		document.querySelector(".list-post").appendChild(list);
		if (imageLength > 1) {
			handleImageScroll(++idx, imageLength);
		}

		if (post.image) {
			let grid = document.createElement("a");
			grid.classList = "cont-grid";
			grid.innerHTML = `<img src=${imageArr[0]} alt="피드 이미지">`;

			// 앨범형에서 더보기 버튼이 보이지 않음
			if (imageLength == 1) {
				grid.style.setProperty("--single", "hidden");
			}
			document.querySelector(".grid-post").appendChild(grid);
		}
	}
	BtnLike();
	BtnComment();
	getBtn();
}

//게시글 신고
export async function reportPost(postId) {
	const url = API_URL + `/post/${postId}/report`;
	const res = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
	});
	const data = await res.json();
	console.log(data);
}

//게시글 삭제
export async function deletePost(postId) {
	const url = API_URL + `/post/${postId}`;
	const res = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
	});
}

//게시글 수정
export async function editPost(postId) {
	const url = API_URL + `/post/${postId}`;
	const res = await fetch(url, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
		body: JSON.stringify({
			post: {
				content: String,
				image: String,
			},
		}),
	});
}

//상품 삭제
export async function deleteProduct(productId) {
	const url = API_URL + `/product/${productId}`;
	const res = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
	});
}

//상품 수정
export async function editProduct(productId) {
	const url = API_URL + `/product/${productId}`;
	const res = await fetch(url, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
		body: JSON.stringify({
			product: {
				itemName: String,
				price: Number,
				link: String,
				itemImage: String,
			},
		}),
	});
}

// 팔로잉 목록
export async function getFollowing(accountName) {
	const url = API_URL + `/profile/${accountName}/following?limit=Number&skip=Number`;
	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
	});
	const followingList = document.querySelector(".lst-follower");
	const json = await res.json();

	for (let following of json) {
		let follow = getFollowProfile(following);
		followingList.appendChild(follow);
	}
	followingCheck();
}

// 팔로워 목록
export async function getFollower(accountName) {
	const url = API_URL + `/profile/${accountName}/follower`;
	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
	});
	const followerList = document.querySelector(".lst-follower");
	const json = await res.json();

	for (let follower of json) {
		let follow = getFollowProfile(follower);
		followerList.appendChild(follow);
	}
	followingCheck();
}

// 팔로우 프로필
function getFollowProfile(target) {
	const goURL = `${ORIGIN}/pages/profile.html?${target.accountname}`;
	// console.log(getMiniProfile(target.accountname));
	let state = target.follower.includes(ID)
		? `<li><button type="button" class="S-button btn activ btn-follower_view_follow" id=${target.accountname}>취소</button></li>`
		: `<li><button type="button" class="S-button btn btn-follower_view_follow" id=${target.accountname}>팔로우</button></li>`;
	let follow = document.createElement("article");
	follow.classList = "box-profile";
	follow.innerHTML = `<ul class="wrap-profile">
    <li>
      <a href=${goURL}><img src=${target.image} onerror="this.src='${ORIGIN}/images/basic-profile-img.png';" alt="기본프로필 소형" class="basic-profile"></a>
    </li>
    <li>
      <a href=${goURL}>
        <ul class="wrap-right">
          <li class="user-name">${target.username}</li>
          <li class="user-id">@ ${target.accountname}</li>
        </ul>
      </a>
    </li>
    ${state}
  </ul>`;
	return follow;
}

// 팔로우 체크
function followingCheck() {
	const btnFollowCancel = document.querySelectorAll(".btn-follower_view_follow");

	btnFollowCancel.forEach((btn) =>
		btn.addEventListener("click", () => {
			btn.classList.toggle("activ");
			if (btn.classList.contains("activ")) {
				btn.textContent = "취소";
				follow(btn.id);
			} else {
				btn.textContent = "팔로우";
				unfollow(btn.id);
			}
		})
	);
}

export async function follow(target) {
	console.log("follow", target);
	const url = API_URL + `/profile/${target}/follow`;
	const res = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
	});
}

export async function unfollow(target) {
	console.log("unfollow", target);
	const url = API_URL + `/profile/${target}/unfollow`;
	const res = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
	});
}

// 게시글 좋아요 취소
export async function cancellikePost(postId) {
	const url = API_URL + `/post/${postId}/unheart`;
	const res = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
	});
}

// 게시글 좋아요
export async function likePost(postId) {
	const url = API_URL + `/post/${postId}/heart`;
	const res = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
	});
}

// 댓글 리스트
export async function GetComment(postId) {
	const url = API_URL + `/post/${postId}/comments`;
	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
	});
	const data = await res.json();
	const comments = data.comments;
	// console.log(url)
	return comments;
}
// 댓글 작성
export async function editComment(postId, input) {
	const url = API_URL + `/post/${postId}/comments`;
	const res = await fetch(url, {
	  method:"POST",
	  headers:{
		"Authorization" : `Bearer ${TOKEN}`,
		"Content-type" : "application/json"
	  },
	  body: JSON.stringify({
		  comment: {
			  content: input
		  }
	  })
	})
	const data = await res.json();
	console.log(data);
  }
// 댓글 삭제
export async function deleteComment(postId, commentId) {
	const url = API_URL + `/post/${postId}/comments/${commentId}`;
	const res = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
	});
}
// 댓글 신고
export async function reportComment(postId, commentId) {
	const url = API_URL + `/post/${postId}/comments/${commentId}/report`;
	const res = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-type": "application/json",
		},
	});
	const data = await res.json();
	console.log(data);
}
