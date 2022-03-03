import { API_URL, TOKEN, PRODUCT_ID, ORIGIN } from "./constants.js";

window.addEventListener("DOMContentLoaded", () => {
  isEditPost(PRODUCT_ID);
  postProductImg();
  inputEvent();
  clickUploadBtn();
});

// 상품수정이면  상품정보 불러오기
function isEditPost(productId) {
  if(productId) {
    setProductData(productId);
  }
}

let productImgName = "";
// 첨부된 이미지 나타나기
async function postProductImg() {
  const imgInput = document.querySelector("#productImgInput");
  const productImgBox = document.querySelector("#product-img-box"); 
  let productImgElement = document.querySelector("#product-img-box img");

  imgInput.addEventListener("change", (e) => {
    if (!productImgElement) {
      productImgElement = document.createElement("img");
      productImgBox.append(productImgElement);
    }

    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        productImgElement.src = e.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
    }

    apiProductImgName(imgInput).then((data)=>{
      productImgName = `${API_URL}/${data["filename"]}`;
      console.log(productImgName)
      imgInput.setAttribute("data-state", 1);
      btnActive();
    })
  })
}

//서버에서 이미지파일이름 변환받기 
async function apiProductImgName(imgInput) {
  const formData = new FormData();
  formData.append("image", imgInput.files[0]);

  const response = await fetch(`${API_URL}/image/uploadfile`, {
      method: "POST",
      body: formData
    })
  
  return await response.json(); 
}

//상품 상세 정보 api 
async function apiProductData(productId) {
  const response = await fetch(`${API_URL}/product/detail/${productId}`, {
    headers: { "Authorization": "Bearer " + TOKEN }
  });
  return await response.json();
}

// 현재 상품 정보 세팅
async function setProductData(productId) {
  const productName = document.querySelector("#productNameInput");
  const productPrice = document.querySelector("#priceInput");
  const storeLink = document.querySelector("#storeLinkInput");
  const productImgInput = document.querySelector("#productImgInput");
  const productImgBox = document.querySelector("#product-img-box")
  const productImgElement = document.createElement("img");
  productImgBox.append(productImgElement);

  apiProductData(productId).then((data) => {
    productImgElement.src = data.product.itemImage;
    productName.value = data.product.itemName;
    productPrice.value = data.product.price;
    storeLink.value = data.product.link;

    productImgName = data.product.itemImage;
  
    productImgInput.setAttribute("data-state", 1);
    productName.setAttribute("data-state", 1);
    productPrice.setAttribute("data-state", 1);
    storeLink.setAttribute("data-state", 1);
  
    btnActive();
  });
}

// 상품정보수정 api 
async function apiEditProduct(productName,storeLink,price) {
  const response = await fetch(`${API_URL}/product/${PRODUCT_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + TOKEN
    },
    body: JSON.stringify({
      "product": {
        "itemName": productName.value,
        "price": price,
        "link": storeLink.value,
        "itemImage": `${productImgName}`
      }
    })
  });
  return await response.json();
}

// 새 상품 업로드 api 
async function apiUploadProduct(productName,storeLink,price) {
  const response = await fetch(`${API_URL}/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + TOKEN
    },
    body: JSON.stringify({
      "product": {
        "itemName": productName.value,
        "price": price,
        "link": storeLink.value,
        "itemImage": `${productImgName}`
      }
    })
  });
  return await response.json();
}

// 업로드 버튼 클릭시 
function clickUploadBtn() {
  const saveBtn = document.querySelector("#save-btn");
  saveBtn.addEventListener("click",() => {
    if (!saveBtn.classList.contains("disabled")) {
      postProductData()
    }
  })
}

// 상품 정보 서버로 전송 - 업로드
async function postProductData() {
  const productPrice = document.querySelector("#priceInput");
  const productName = document.querySelector("#productNameInput");
  const storeLink = document.querySelector("#storeLinkInput");
  const price = parseInt(productPrice.value.replaceAll(",", ""), 10);

  if (PRODUCT_ID) {
    apiEditProduct(productName,storeLink,price).then((res) => {
      resetAndMove();
    });
  } else {
    apiUploadProduct(productName,storeLink,price).then((res) => {
      resetAndMove();
    });
  }
}

function resetAndMove() {
  dataReset();
  location.href = `${ORIGIN}/pages/profile.html`;
}

// 상품 정보 전송 후 데이터 리셋
function dataReset() {
  localStorage.setItem("productId",'');
  const inputs = document.querySelectorAll("INPUT");

  inputs.forEach((item) => {
    item.value = "";
    if (item.getAttribute("type") == "file") {
      const imgTag = document.querySelector("#product-img-box img");
      imgTag.remove();
      productImgName = "";
    }
  });
}

// input 입력 또는 포커스 잃을 때 이벤트 발생
function inputEvent() {
  const inputs = document.querySelectorAll(".input-container input");
  
  checkPriceValue();

  inputs.forEach((item) => {
    item.addEventListener("blur", () => {
      checkValidation(item);
      btnActive();
    });
  });

  inputs.forEach((item) => {
    item.addEventListener("input", () => {
      checkValidation(item);
      btnActive();
    });
  });
}

// 저장 버튼 활성화
function btnActive() {
  let state = inputValueCheck();
  const saveBtn = document.querySelector("#save-btn")
  let btnState = saveBtn.classList.contains("disabled");

  if (state) { //인풋 오케이
    if (btnState) { saveBtn.classList.remove("disabled"); } // 버튼안켜졌어
  } else { // 인풋 낫오케이
    if (!btnState) { //버튼까지 켜져있어
      saveBtn.classList.add("disabled");
    }
  }
}

// input 값 입력유무 체크  
function checkValidation(element) {
  let value = element.value;
  let inputId = element.getAttribute("id");

  if (value.length != 0) {
    if (inputId == "productNameInput") {
        element.setAttribute("data-state", 1);
    }

    if (inputId == "priceInput") {
      element.setAttribute("data-state", 1);
    }

    if (inputId == "storeLinkInput") {
        element.setAttribute("data-state", 1);
    }
  } else {
    element.setAttribute("data-state", 0);
  }
}

// 상품가격값 유효성 체크 & 원단위로 변환
function checkPriceValue() {
  const priceInput = document.querySelector("#priceInput");

  // 입력될 때 숫자 이외에 다른 문자(특수문자 포함) 입력되지 않도록 합니다.
  priceInput.addEventListener("input", () => {
    priceInput.value = priceInput.value.replace(/[^\0-9]/g, '');
    priceInput.value = priceInput.value.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '');
  });
  // 입력 후 포커스를 잃으면 입력된 가격이 원단위로 표시됩니다.
  priceInput.addEventListener("blur", () => {
    priceInput.value = priceInput.value.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  });
}

// input value 입력 전부 됐는지 체크 
function inputValueCheck() {
  const inputs = document.querySelectorAll("form input");
  let valueState = true;
  let addState = 0;

  inputs.forEach((item) => {
    let dataState = parseInt(item.getAttribute("data-state"), 10);

    addState += dataState;
  });

  if (inputs.length == addState) {
    valueState = true;
  } else {
    valueState = false;
  }

  return valueState;
}


