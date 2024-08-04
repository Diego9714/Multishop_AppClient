import { createAccessToken }   from '../libs/jwt.js'
import { pool }   from '../connection/mysql.connect.js'
import bcrypt from 'bcrypt'

export class Users {
  static async search(username , password) {
    try {
      let msg = {
        status: false,
        msg: "Client not found",
        code: 500
      }

      const connection = await pool.getConnection()

      let sql = 'SELECT id_scli , cod_cli , user_cli , pass_cli , existenceStatus , nom_cli , dir1_cli , tel_cli FROM scli WHERE user_cli = ?;'
      let [user] = await connection.execute(sql,[username.toUpperCase()])
      
      connection.release()

      if(user) {
        let isMatch = await bcrypt.compare(password.toUpperCase() , user[0].pass_cli)

        // let newPass = password.toUpperCase()
        // console.log(newPass)

        // const pass = await bcrypt.hash(newPass, 10)
        // console.log(pass)

        let userToken = {
          id_scli : user[0].id_scli,
          cod_cli : user[0].cod_cli,
          user_cli : user[0].user_cli,
          nom_cli : user[0].nom_cli,
          dir1_cli : user[0].dir1_cli,
          tel_cli : user[0].tel_cli,
          prodExistence: user[0].existenceStatus
        }
        
        let tokenUser

        if(isMatch){
          
          tokenUser = await createAccessToken(userToken)

          msg = {
            status: true,
            msg: "Client Found",
            code: 200,
            tokenUser
          } 
        }
      }
  
      return msg
    } catch (error) {
      return error
    }
  }
}

