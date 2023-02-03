const express = require('express')
const mysql = require('mysql')
const path = require('path')
const static = require('serve-static')
const dbconfig = require('./config/dbconfig.json')


//Database 기본 정보 입력
const con = mysql.createConnection({
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database,
    debug: false
})

//SQL 연결 
con.connect(function (err) {
    if (err) {
        console.log('error');
        console.log(err);
    }
    console.log("SQL connect ... ");

})

//express 실행
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/public', static(path.join(__dirname, 'public')))


//port 3000에서 html로부터 POST 받기
app.listen(3000, () => {
    console.log('listening on port 3000');
})


//회원가입 POST가 왔을 경우
app.post('/process/adduser', (req, res) => {
    console.log('/process/adduser 호출됨 ' + req)

    //전달 온 개인정보들
    const paramId = req.body.id;
    const paramName = req.body.name;
    const paramAge = req.body.age;
    const paramPassword = req.body.password;

    //NodeJS -> SQL : Query 전송 (데이터 입력)
    const exec = con.query('insert into `Sign`.`users` (`id`,`name`,`age`,`password`) values(?,?,?,?)',
        [paramId, paramName, paramAge, paramPassword],
        (err, result) => {

            //Error
            if (err) {
                console.log('SQL Error')
                console.dir(err)

                res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                res.write('<h2> 회원가입 SQL 에러 발생 </h2>')
                res.end()
                return;
            }

            //Success
            if (result) {
                console.log('Inserted 성공')
                console.log(paramId + ' ' + paramName + ' ' + paramAge + ' ' + paramPassword)
                res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                res.write('<h2> 회원가입 성공 </h2>')
                res.write('<a href="http://127.0.0.1:3001/sign_up_in/public/login.html">로그인 페이지로 돌아가기</a>')
                res.end()
                return;
            } else {
                console.log('Inserted 실패')
                res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                res.write('<h1>사용자 추가 실패</h1>')
                res.end();
            }

        })



})

//로그인 POST가 왔을 경우
app.post('/process/login', (req, res) => {
    console.log('/process/login 호출됨 ' + req)

    const paramId = req.body.id;
    const paramPassword = req.body.password;

    //NodeJS -> SQL ->: Query 전송 (데이터 일치 확인)
    const exec = con.query('select `id`,`name` from `Sign`.`users` where `id`=? and `password`=?',
        [paramId, paramPassword],
        (err, result) => {
            
            //Error
            if (err) {
                console.log('SQL Error')
                console.dir(err)

                res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                res.write('<h2> 로그인 SQL 에러 발생 </h2>')
                res.end()
                return;
            }

            //Success
            if (result.length>0) {
                console.log(paramId + '님이 로그인하셨습니다.')
                res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                res.write('<h2> 로그인 성공 </h2>')
                res.write('<a href="http://127.0.0.1:3001/sign_up_in/public/login.html">로그인 페이지로 돌아가기</a>')
                res.end()
                return;
            } else{
                console.log('로그인 실패')
                res.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' })
                res.write('<h1>로그인 실패</h1>')
                res.write('<a href="http://127.0.0.1:3001/sign_up_in/public/login.html">로그인 페이지로 돌아가기</a>')
                res.end();
            }

        })

})

