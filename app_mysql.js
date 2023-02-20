const express = require("express");
const path = require('path');
const static = require('serve-static');
const mysql = require("./mysql");//mysql 폴더의 index.js를 갖고오기 위해

const app = express();

app.use(express.urlencoded({extended:true})); // url : Uniform Resource 
app.use(express.json());

app.listen(3000, () => {
    //3000번 포트로 웹서버 실행하기
    console.log("Server started. port 3000.");
});

//고객정보 조회 라우터
app.get("/api/members", async (req, res) => {

    console.log('/api/members 호출됨 ' + req)

    //localhost:3000/users 접속 시 실행
    const members = await mysql.query('memberList');   //sql.js 파일에 작성된 userList 쿼리 실행
    console.log(members);
    res.send(members);
});

app.use(express.static('style'))
app.use(express.static('images'))
app.use(express.static('icons'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/yebin1.html');
})

app.get('/api/signUpPage', (req, res) => {
    res.sendFile(__dirname + '/html/yebin2.html');
})

//고객 정보 추가 라우터
app.post('/api/signUp', async (req, res) => {

    console.log('/api/signUp executed...');
    console.log(req.body.nickName);
    console.log(req.body.phone);
    console.log(req.body.id);
    console.log(req.body.password);
    console.log(req.body.check);

    const param = {
        nick_name: req.body.nickName,
        id: req.body.id,
        password: req.body.password,
        phone: req.body.phone,
    };

    console.log(param);

    try {
        const result = await mysql.query('memberInsert', param);
        console.log('result is : ', result);
        // .catch((err) => {
        //     console.log('err occurred on /api/insert, error : ', err);
        // });
    } catch (error) {
        console.log('error.');
    }

    //res.send(result);
    //res.sendFile( __dirname + '/html/yebin2.html');
    res.send("<script>alert('회원가입을 완료하였습니다!'); window.location.replace('/')</script>")
})


//로그인 라우터
app.post('/api/login', async (req, res) => {

    const paramId = req.body.id;
    const paramPassword = req.body.password;

    console.log('/api/login executed...');
    console.log(req.body.id);
    console.log(req.body.password);

    const logIn = await mysql.query('memberLogIn',
        [paramId, paramPassword]    
    );   //sql.js 파일에 작성된 userList 쿼리 실행

    console.log(logIn.length>0);

    if(logIn.length>0){
        res.sendFile( __dirname + '/html/haeun.html');
    }    
    else{
        res.send("<script>alert('아이디 또는 비밀번호가 일치하지 않습니다.'); window.location.replace('/')</script>")
    }

    //res.send(logIn);

})