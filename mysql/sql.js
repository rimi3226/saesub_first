module.exports = {
    memberList: `select * from members`,
    memberInsert: `insert into members set ?`,
    memberLogIn: `select id, nick_name, profile from members where id=? and password=?`
}