const mysql = require('mysql');
const sql = require('./sql.js');    //sql 쿼리문이 작성된 파일을 갖고 온다.

//Pool을 생성한다.
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    port            : 3306,
    user            : 'dev02',
    password        : '1234',
    database        : 'profiles'
});

/*쿼리문을 실행하고 결과를 반환하는 함수*/
/*
    pool이 생성되고 나면 pool의 내장함수인 query를 사용해 쿼리를 실행할 수 있다.

    pool.query(queryString, values, callback)
*/

const query = async (alias, values) => {

    console.log('values : ', values);

    return new Promise((resolve, reject) => pool.query(sql[alias], values, (error,
    results) => {
        if(error){
            console.log(error);
            reject({
                error
            });
        } else resolve(results);
    }));
}

module.exports = {
    query
};
