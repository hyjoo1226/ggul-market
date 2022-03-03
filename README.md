# 감귤마켓 : **멋쟁이사자처럼 프론트엔드 1기** 팀 프로젝트

## 감귤S2 : [장효순](https://github.com/sooonlog), [강지승](https://github.com/jiseung-kang), [한진실](https://github.com/truthone), [주현호](https://github.com/hyjoo1226)

**SNS 클론코딩** : [감귤마켓](http://146.56.183.55:3000/)  
**결과물** : [감귤S2](https://jiseung-kang.github.io/ggul-market/)

## 개요

감귤마켓 프로젝트는 **SNS를 직접 구현한 프로젝트**입니다.  
**게시글에 대한 CRUD와 회원가입, 로그인 기능**을 제공합니다.

## 기능, 서버, 디자인 참조 링크

1. 기능 : [요구사항 명세서](https://paullabworkspace.notion.site/SNS-cdd5ed88a24b499593d7081dc28a5cbc#85eb0582eafa45939c0f7d0f67b02fbb)
2. 디자인 : [피그마 링크](https://www.figma.com/file/Gn6gQJdYwImYsEYSzBXhud/%EB%A9%8B%EC%82%AC_%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%EC%8A%A4%EC%BF%A8?node-id=39%3A1814)
3. [서버1](http://146.56.183.55:5050/) , [서버2](https://api.mandarin.cf/)
   // 해당 서버가 닫혀있을 시 프로젝트가 제대로 동작하지 않을 수 있음.

## 개발 환경

**OS** : Mac, Window  
**Frontend**: HTML, CSS, JavaScript  
**Backend** : [API 명세](https://paullabworkspace.notion.site/API-b9c93280e29f4670b324009d4461f4d5)  
**IDE** : VS Code  
**Team Collaboration Tool** : Git, Git Projects, Discord  
**Platform** : Mobile Web  
**Test Browser** : Chrome Version 97.0.4692.71, Safari Version 15.2  
**Test Device** : iPhoneSE/XR/12, Gallaxy S12

## 기능 구현 상세

<table style="width: 100%;">
    <thead>
      <tr>
        <th colspan="3" style="background:black;color:white;text-align:center;">감귤마켓 SNS 팀 프로젝트 진행 현황</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>이름</th>
        <th>주요 기능</th>
        <th>참조 번호</th>
      </tr>
      <tr>
        <td>장효순</td>
        <td>
            로그인, 회원가입, 프로필 수정, 홈 피드 디자인 및 기능 구현
        </td>
        <td>
            1~4, 8
        </td>
      </tr>
      <tr>
        <td>강지승</td>
        <td>
            프로필 피드, 팔로잉/팔로워 디자인 및 기능 구현
        </td>
        <td>
          5~7
        </td>
      </tr>
      <tr>
        <td>한진실</td>
        <td>
          상품,게시글,채팅목록 디자인 구현
        </td>
        <td>
          9~12
        </td>
      </tr>
      <tr>
        <td>주현호</td>
        <td>
          홈 피드 기능 구현, 채팅방, 하단 탭 메뉴, 좋아요 버튼, 댓글 등록/수정/삭제, 모달창 디자인 및 기능 구현
        </td>
        <td>
          4, 13~16
        </td>
      </tr>
    </tbody>
  </table>

**1. splash**

<p align="center">
    <img src="https://user-images.githubusercontent.com/93389773/150171014-966531fc-e192-4f42-a713-ff69a5667e2a.gif">
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://user-images.githubusercontent.com/93389773/150171024-2899a4cf-f04d-45ce-8436-ba2c0f90f8ba.gif">
</p>
      
**2. 로그인**

<p align="center">
    <img src="https://user-images.githubusercontent.com/93389773/150171102-c6adee6c-d3e3-44a6-a1f7-c17bbee5ff09.gif">
</p>

**3. 회원가입**

<p align="center">
    <img src="https://user-images.githubusercontent.com/93389773/150171129-4e1caba8-c549-4be7-890d-4b1dda2f1d36.gif">
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <img src="https://user-images.githubusercontent.com/93389773/150171178-0756967a-14b9-4090-87a7-68188f0c8eb7.gif">
</p>

**4. 감귤마켓 피드(홈 화면)**

<p align="center">
    <img src="./preview/homefeed.gif">
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <img src="./preview/nofeed.gif">
</p>

**5. 검색**☑️

<p align="center">
    <img src="./preview/search.gif">
</p>

**6. 사용자 프로필 페이지**☑️

<p align="center">
    <img src="./preview/myfeed.gif">
</p>


**7. 팔로워, 팔로잉 목록**

<p align="center">
    <img src="./preview/follow.gif">
</p>

**8. 내 프로필 수정**

<p align="center">
    <img src="https://user-images.githubusercontent.com/93389773/150171305-b5e2de2b-4bb9-4045-839c-a220c21992c3.gif">
</p>

**9. 상품 등록**

<p align="center">
    <img src="./preview/add_product.gif">
</p>

**10. 게시글 댓글 페이지**

<p align="center">
    <img src="./preview/comment.gif">
</p>

**11. 게시글 작성 페이지**☑️

<p align="center">
   <img src="./preview/add_post.gif">
   <img src="./preview/modify_post.gif">
</p>

**12. 채팅 목록**

<p align="center">
    <img src="./preview/chatList.gif">
</p>

**13. 채팅방**

<p align="center">
    <img src="./preview/chat_room.gif">
</p>

**14. 하단 탭 메뉴**

<p align="center">
    <img src="./preview/tab_menu.gif">
</p>

**15. 좋아요 버튼**

<p align="center">
    <img src="./preview/like_btn.gif">
</p>

**16. 모달 버튼**

<p align="center">
    <img src="./preview/modal.gif">
</p>

## 기타 도전 기능

**댓글(구현 진행중)**

- 댓글 삭제 및 신고하기 기능을 구현합니다.
- 댓글 작성이 현재 시간으로 부터 몇 초, 분, 시간 전에 작성되었는지 표시합니다.
- 댓글 개수는 카운트 되어 말풍선 아이콘 우측에 표시됩니다.

**채팅 기능**

## 향후 계획

**Refactorying**

- 중복코드 모듈화
- 파일 통합

**Backend**

- 서버 구축
- 배포

## Directory 구성 (HTML, CSS, JS)

```
.
├── README.md
├── images
│   ├── 중략
│   └── ...
├── pages
│   ├── login.html
│   ├── login_email.html
│   ├── join_email.html
│   ├── home.html
│   ├── search.html
│   ├── profile.html
│   ├── followers.html
│   ├── profile_modification.html
│   ├── addProduct.html
│   ├── uploadPage.html
│   ├── chat_page.html
│   ├── chat_list.html
│   ├── chat_room.html
│   ├── like_button.html
│   ├── modal.html
│   ├── module.html
│   ├── page-404.html
│   └── test_modal.html
├── css
│   ├── common.css
│   ├── login.css
│   ├── signin.css
│   ├── join_membership.css
│   ├── home.css
│   ├── search.css
│   ├── profile.css
│   ├── followers.css
│   ├── profile_modification.css
│   ├── addProduct.css
│   ├── uploadPage.css
│   ├── chat_list.css
│   ├── chat_room.css
│   ├── like_button.css
│   ├── modal.css
│   ├── module.css
│   ├── page-404.css
│   └── reset.css
└── scripts
│   ├── 9.addProduct.js
│   ├── 11.uploadPage.js
│   ├── constants.js
│   ├── initPage.js
│   ├── script.js
│   └── api.js
└── index.html
```

## License

감귤마켓 SNS는 **멋쟁이 사자처럼 프론트엔드 1기 과정에서 진행된 프로젝트**이며 사용된 **이미지, 서버 API**는 **(주)위니브**로부터 제공받았습니다.

페이지별 UI/UX 디자인 레퍼런스는 [피그마](https://www.figma.com/file/Gn6gQJdYwImYsEYSzBXhud/%EB%A9%8B%EC%82%AC_%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C%EC%8A%A4%EC%BF%A8?node-id=39%3A1814)를 활용했으며,  
**일부 서버 API 요청 코드를 제외**한 **모든 HTML/CSS/JavaScript 코드**는 팀원들이 직접 작성하였습니다.
