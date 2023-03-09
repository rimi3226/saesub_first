const express = require("express");
const path = require('path');
const static = require('serve-static');
const mysql = require("./mysql");//mysql 폴더의 index.js를 갖고오기 위해
const multer = require('multer');//이미지 업로드하기
const session = require('express-session');
const ejs = require("ejs");
const fileStore = require('session-file-store')(session);


const app = express();

// 화면 engine을 ejs로 설정
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//---------------
// //app.use(bodyParser.urlencoded({extend:true}));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'ejs');
// app.set('views', __dirname);
// var bodyParser = require('body-parser');
//---------------

app.use(express.urlencoded({extended:true})); // url : Uniform Resource 
app.use(express.json());

app.listen(3000, () => {
    //3000번 포트로 웹서버 실행하기
    console.log("Server started. port 3000.");
});

//----------------------------------------------------------------------

//디스크 저장소에 대한 객체 생성하기
const storage = multer.diskStorage({//디스크 저장소의 정의
    destination: function(req, file, cb){
        cb(null, 'uploads/')    //cd 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function(req, file, cb){
        //cb(null, file.originalname) //cb 콜백함수를 통해 전송된 파일 이름 설정
        cb(null, new Date().valueOf() + path.extname(file.originalname)); //시스템 시간으로 파일 이름 설정
    }
})
const upload = multer({storage: storage}); //multer 객체 생성

// app.post('/profile', upload.single('photo'), function (req, res, next){
//     console.log(req.file)
//     console.log(req.body);
// })


//----------------------------------------------------------------------

app.use(session({
    secret: 'secret key',   //암호화하는 데 쓰일 키
    resave: false,  //세션에 변경 사항 없이도 항상 다시 저장할지 여부
    saveUninitialized: true,    //초기화되지 않은 세션을 스토어(저장소)에 강제로 저장할지 여부
    // cookie: {
    //     httpOnly: true, //true이면 클라이언트 자바스크립트에서 document.cookie로 쿠키정보를 볼 수 없음
    //     secure: true,
    //     maxAge: 60000   //쿠키가 유지되는 시간 (밀리세컨드)
    // },
    store: new fileStore()  //세션 저장소로 fileStore 사용
}));

//----------------------------------------------------------------------

//고객 정보 추가 라우터
app.post('/api/signUp', upload.single('profile'), async (req, res) => {

    console.log('/api/signUp executed...');
    console.log(req.file);

    console.log(req.body.profile);
    console.log(req.body.nickName);
    console.log(req.body.phone);
    console.log(req.body.id);
    console.log(req.body.password);
    console.log(req.body.check);

    const param = {
        profile: req.file.path.replace(/\\/g, "/"),
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


//----------------------------------------------------------------------


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
/* */
//app.use(express.static('uploads'))
app.use('/uploads', static(path.join(__dirname, 'uploads')))

/* */
app.use(express.static('icons'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/yebin1.html');
})

app.get('/myPage', (req, res) => {

    let {user} = req.session;

    if (user !== undefined) {
        //res.render(__dirname + '/html/subin3.html', {user});
    }else{
        //res.sendFile(__dirname + '/html/subin3.html');
    }

    res.render(__dirname + '/html/subin3.ejs', {user});


    //res.sendFile(__dirname + '/html/subin3.html');
    //res.sendFile(__dirname + '/html/subin3.html', {nick_name:nick_name, profile: profile});
    //res.render(__dirname + '/html/subin3.html', {nick_name:nick_name, profile: profile});
})

app.get('/api/signUpPage', (req, res) => {
    res.sendFile(__dirname + '/html/yebin2.html');
})

// //고객 정보 추가 라우터
// app.post('/api/signUp', async (req, res) => {

//     console.log('/api/signUp executed...');
//     console.log(req.body.nickName);
//     console.log(req.body.phone);
//     console.log(req.body.id);
//     console.log(req.body.password);
//     console.log(req.body.check);

//     const param = {
//         nick_name: req.body.nickName,
//         id: req.body.id,
//         password: req.body.password,
//         phone: req.body.phone,
//     };

//     console.log(param);

//     try {
//         const result = await mysql.query('memberInsert', param);
//         console.log('result is : ', result);
//         // .catch((err) => {
//         //     console.log('err occurred on /api/insert, error : ', err);
//         // });
//     } catch (error) {
//         console.log('error.');
//     }

//     //res.send(result);
//     //res.sendFile( __dirname + '/html/yebin2.html');
//     res.send("<script>alert('회원가입을 완료하였습니다!'); window.location.replace('/')</script>")
// })



//로그인 라우터
app.post('/api/login', async (req, res, next) => {

    //const {id, pw} = req.body.param;
    //데이터베이스의 사용자 테이블에서 로그인 인증 처리 코드 작성
    //사용자가 존재하면, 로그인 처리가 성공하면

    const paramId = req.body.id;
    const paramPassword = req.body.password;

    console.log('/api/login executed...');
    console.log(req.body.id);
    console.log(req.body.password);
    console.log('req.session: ' + req.session);

    const logIn = await mysql.query('memberLogIn',
        [paramId, paramPassword]   
    );   //sql.js 파일에 작성된 userList 쿼리 실행
    

    console.log(logIn.length>0);
    console.log(logIn);

    if(logIn.length>0){
        //req.session.id = paramId;   //세션에 id 저장
        //req.session.nick_name = logIn.nickName;   //세션에 id 저장
        req.session.user = logIn;
        req.session.isLogined = true;  //세션에 로그인 여부 저장

        req.session.save(err => {   //세션 저장
            if(err) throw err;
        })

        console.log('req.session.user: ' + req.session.user);

        let result = JSON.parse(JSON.stringify(logIn));
        result.forEach((v) => console.log(v));
        console.log("result[0].nick_name : " + result[0].nick_name);
        console.log("result[0].profile : " + result[0].profile);

        const user_nick = result[0].nick_name
        const file_name = result[0].profile
        //test
        const profile = `/${result[0].profile}`
        console.log("profile: " + profile)
        

        //res.sendFile( __dirname + '/html/subin3.html');
        //이 부분이 문제로다...
        res.render(__dirname + '/html/subin3.ejs', {user_nick: user_nick, profile: profile});
    }    
    else{
        res.send("<script>alert('아이디 또는 비밀번호가 일치하지 않습니다.'); window.location.replace('/')</script>")
    }

    //res.send(logIn);

})