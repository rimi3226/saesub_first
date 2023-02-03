const express=require('express'); //module import
const app=express() // express 실행

app.listen(3000, ()=>{ // 서버 생성, 포트번호:3000, call back 함수
    console.log('서버 생성');
})