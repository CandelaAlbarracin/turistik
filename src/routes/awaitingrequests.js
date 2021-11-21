const express=require('express')
const nodemailer=require("nodemailer")
const {google}=require('googleapis')
const router=express.Router()
const pool=require('../database')

router.get('/',async(req,res)=>{
    res.render('./awaitingrequests/awaitingrequests')
})

router.post('/', async(req,res)=>{
    const {observaciones,resolucion}=req.body
    let sendhtml
    if (resolucion=="Aceptado"){
        sendhtml=`<table style="height: 32px; width: 100%; border-collapse: collapse; margin-left: auto; margin-right: auto;" border="1">
        <tbody>
        <tr style="height: 18px;">
        <td style="width: 100%; height: 18px; text-align: center;">
        <h1 style="text-align: center;"><strong><img src="https://res.cloudinary.com/turistick/image/upload/v1634951604/Global/clipart249913_gg7bil.png" alt="" width="37" height="37" />TURISTIK</strong></h1>
        </td>
        </tr>
        </tbody>
        </table>
        <h2 style="text-align: center;"><span style="color: #339966;"><em><strong>&iexcl;Felicitaciones!&nbsp;</strong></em></span></h2>
        <p>Hemos decidido aprobar tu solicitud. Tu emprendimiento ya se puede visualizar en la p&aacute;gina de Turistik.</p>
        <p>Adem&aacute;s realizamos las siguientes observaciones:&nbsp;&nbsp; ${observaciones}</p>
        <p>Recuerda que puedes ver tus emprendimientos iniciando sesi&oacute;n en la p&aacute;gina.</p>`
    }else{
        if (resolucion=="Modificacion"){
            sendhtml=`<table style="height: 32px; width: 100%; border-collapse: collapse; margin-left: auto; margin-right: auto;" border="1">
            <tbody>
            <tr style="height: 18px;">
            <td style="width: 100%; height: 18px; text-align: center;">
            <h1 style="text-align: center;"><strong><img src="https://res.cloudinary.com/turistick/image/upload/v1634951604/Global/clipart249913_gg7bil.png" alt="" width="37" height="37" />TURISTIK</strong></h1>
            </td>
            </tr>
            </tbody>
            </table>
            <h2 style="text-align: center;"><span style="color: #339966;"><em><strong><span style="color: #ff9900;">Estas casi adentro...</span>&nbsp;</strong></em></span></h2>
            <p>Notamos que hay unos peque&ntilde;os detalles para modificar antes de poder publicar tu emprendimiento en nuestra p&aacute;gina.&nbsp;</p>
            <p>Hemos realizado las siguientes observaciones: ${observaciones} .</p>
            <p>Para modificar tu emprendimiento accede a tu cuenta con el correo y contrase&ntilde;a que ingresaste al llenar el formulario. Una vez hayas accedido, en la pesta&ntilde;a llamada 'Mis emprendimientos' encontr&aacute;s la im&aacute;gen y nombre de tu emprendimiento y un bot&oacute;n llamado 'Editar' que te permit&aacute; modificar al mismo.&nbsp;</p>
            <p>Puedes comunicarte con nosotros si necesitas m&aacute;s ayuda enviando un correo electr&oacute;nico a turistikjujuy@gmail.com.</p>`
        }else{
            sendhtml=`<table style="height: 32px; width: 100%; border-collapse: collapse; margin-left: auto; margin-right: auto;" border="1">
            <tbody>
            <tr style="height: 18px;">
            <td style="width: 100%; height: 18px; text-align: center;">
            <h1 style="text-align: center;"><strong><img src="https://res.cloudinary.com/turistick/image/upload/v1634951604/Global/clipart249913_gg7bil.png" alt="" width="37" height="37" />TURISTIK</strong></h1>
            </td>
            </tr>
            </tbody>
            </table>
            <h2 style="text-align: center;"><span style="color: #339966;"><em><strong><span style="color: #ff0000;">Lo sentimos...</span>&nbsp;</strong></em></span></h2>
            <p>Hemos decidido rechazar tu solicitud. Debido a que .&nbsp;&nbsp; ${observaciones}.</p>
            <p>Puedes comunicarte con nosotros si crees que se trat&oacute; de un error o necesitas m&aacute;s ayuda enviando un correo electr&oacute;nico a turistikjujuy@gmail.com.</p>`
        }
        
    }

    
    const CLIENT_ID=process.env.CLIENT_ID
    const CLIENT_SECRET=process.env.CLIENT_SECRET
    const REDIRECT_URI=process.env.REDIRECT_URI
    const REFRESH_TOKEN=process.env.REFRESH_TOKEN
    const oAuth2Client= new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)

    oAuth2Client.setCredentials({
        refresh_token:REFRESH_TOKEN
    })

    async function sendMail(){
        try{
            const accessToken=await oAuth2Client.getAccessToken()
            const transporter=nodemailer.createTransport({
                service:"gmail",
                auth:{
                    type:"OAuth2",
                    user:"turistikjujuy@gmail.com",
                    clientId:CLIENT_ID,
                    clientSecret:CLIENT_SECRET,
                    refreshToken:REFRESH_TOKEN,
                    accessToken
                },
                tls: {
                    rejectUnauthorized: false
                }
                
            })
            const mailOption={
                from:"Turistik <turistikjujuy@gmail.com>",
                to:"candealbarracin.bocajuniors@gmail.com",
                subject:"Respuesta a su solicitud de ser emprendedor en Turistik",
                html:sendhtml
            }

            const result= await transporter.sendMail(mailOption)
            return result
        }catch(err){
            console.log(err)
        }
    }
    sendMail()
    .then((result)=>res.status(200).redirect("/solicitudespendientes"))
    .catch((error)=>console.log(error.message))
})

module.exports=router