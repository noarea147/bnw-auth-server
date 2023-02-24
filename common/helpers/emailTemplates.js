const userModel = require("../models/user.model")

const header = `
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa&family=Tajawal&display=swap" rel="stylesheet">
    <style>
        h1 {
            margin-top: 10px;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 35px;
            font-style: normal;
            font-variant: normal;
            font-weight: 700;
            line-height: 30.4px;
        }
        
        body {
            font-family: 'Aref Ruqaa', serif;
            font-family: 'Tajawal', sans-serif;
        }
        
        p {
            font-size: 20px;
        }
    </style>
</head>
`
const footer = `
    <table border="0" style="margin:auto;padding:20px;background-color: #222222;width:100%; max-width:600px;">
        <tbody>
            <tr>
                <td style="font-size: 10pt; font-family: Arial, sans-serif;; border-right: 3px solid; border-right-color: #ffcc00; width:180px; padding-right: 10px; vertical-align: top;" valign="top">
                    <img src="https://avoconsulte.com/219ddee3cb879df7b61e6e884a72f5b3.png" alt="avoconsulte" width="120" border="0" style="border:0; height:auto; width:120px">
                    <p style="margin-top:32px; margin-bottom:0; line-height:1.0">
                        <strong><span style="font-size: 12pt; font-family: Arial, sans-serif;; color:#ffcc00;">AvoConsulte Team<br></span></strong>
                        <span style="font-family: Arial, sans-serif;; font-size:9pt; color:#fff;">Support</span>
                    </p>
                </td>
                <td valign="top">
                    <table cellpadding="0" cellspacing="0" border="0">
                        <tbody>
                            <tr>
                                <td style="font-size: 10pt; color:#444444; font-family: Arial, sans-serif;; padding-bottom: 5px; padding-left: 30px; vertical-align: top; line-height:1.3" valign="top">
                                    <span style="color: #fff;"><strong>Mobile: </strong></span><span style="font-size: 9pt; font-family: Arial, sans-serif;; color:#fff;">+216 54 499 288<br></span>
                                    <span style="color: #fff;"><strong>E-mail: </strong></span><span style="font-size: 9pt; font-family: Arial, sans-serif;; color:#fff;">contact@avoconsulte.com</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 10pt; color:#0079ac; font-family: Arial, sans-serif;; padding-bottom: 5px; padding-left: 30px; vertical-align: top; line-height:1.3" valign="top">
                                    <strong style="font-family: Arial, sans-serif;; font-size:9pt; color:#fff;">Adresse: </strong>

                                    <span style="font-size: 10pt; font-family: Arial, sans-serif;; color: #fff;">24Bis alyssa bardo 2000 tunis<br></span>

                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 10pt; font-family: Arial, sans-serif;; padding-bottom: 5px; padding-top: 5px; padding-left: 30px; vertical-align: top; color: #0079ac;" valign="top">
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-left:15px; font-size: 10pt; font-family: Arial, sans-serif;; padding-top: 15px;margin-bottom:0px; margin-top:40px;" valign="top">
                                    <a href="{facebookURL}" target="_blank" rel="noopener"><img border="0" width="22" src="https://www.pngmart.com/files/15/Circle-Facebook-Logo-PNG-Background-Image.png" alt="facebook icon" style="border:0; height:32px; width:32px"></a>&nbsp;
                                    <a href="{twitterURL}" target="_blank" rel="noopener"><img border="0" width="22" src="https://www.freeiconspng.com/uploads/logo-twitter-circle-png-transparent-image-1.png" alt="twitter icon" style="border:0; height:32px; width:32px"></a>&nbsp;
                                    <a href="{linkedinURL}" target="_blank" rel="noopener"><img border="0" width="22" src="https://www.transparentpng.com/thumb/linkedin/linkedin-basic-round-social-icon-png-5.png" alt="linkedin icon" style="border:0; height:32px; width:32px"></a>&nbsp;
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
`
    // Appointment updates
const confirmUserAppointmentPending = (userName, lawyerName) => {
    const template = `
        ${header}
        <body>
            <table border="0" style="margin:auto;padding:20px;width:100%; max-width:600px">

                <tr>
                    <td>
                        <h1 style="text-align: center;"><span style="color: #ffcc00;">AVO</span>Consulte</h1>
                        <br>
                        <br>
                        <p><strong>Bonjour ${userName},</strong></p>


                        <p>Vous avez pris un rendez-vous avec AvoConsute,<br />le statut de votre demande : <strong>en attente.</strong></p>


                        <p><br />Vous recevrez un email d&egrave;s que ${lawyerName} aura confirm&eacute; votre demande.</p>
                    </td>
                </tr>
            </table>
            ${footer}
        `
    return template
}
const confirmLawyerAppointmentPending = (lawyerName, link) => {
    const template = `
        ${header}
        <body>
            <table border="0" style="margin:auto;padding:20px;width:100%; max-width:600px">

                <tr>
                    <td>
                        <h1 style="text-align: center;"><span style="color: #ffcc00;">AVO</span>Consulte</h1>
                        <br>
                        <br>
                        <p><strong>Bonjour ${lawyerName},</strong></p>


                        <p>Vous avez un nouveau rendez-vous avec AvoConsute,<br />le statut de votre rendez-vous: <strong>en attente.</strong></p>
                        <br>
                        <center><a style="text-decoration:none; border: 0; padding: 10px 15px 10px 15px; background-color:#222222;border-radius:50px;color:#fff;" href="${link}">Confirmer votre rendez-vous</a></center>
                        <br>
                    </td>
                </tr>
            </table>
            ${footer}
        `
    return template
}
const confirmUserAppointmentConfirmed = (userName) => {
    const template = `
        ${header}
        <body>
            <table border="0" style="margin:auto;padding:20px;width:100%; max-width:600px">

                <tr>
                    <td>
                        <h1 style="text-align: center;"><span style="color: #ffcc00;">AVO</span>Consulte</h1>
                        <br>
                        <br>
                        <p><strong>Bonjour ${userName},</strong></p>


                        <p>Vous avez pris un rendez-vous avec AvoConsute,<br />le statut de votre demande : <strong>confirmé.</strong></p>


                        <p><br />Merci d'avoir choisi AVOConsulte.</p>
                    </td>
                </tr>
            </table>
            ${footer}
        `
    return template
}
const confirmLawyerAppointmentConfirmed = (lawyerName) => {
    const template = `
        ${header}
        <body>
            <table border="0" style="margin:auto;padding:20px;width:100%; max-width:600px">

                <tr>
                    <td>
                        <h1 style="text-align: center;"><span style="color: #ffcc00;">AVO</span>Consulte</h1>
                        <br>
                        <br>
                        <p><strong>Bonjour ${lawyerName},</strong></p>


                        <p>Vous avez un rendez-vous avec AvoConsute,<br />le statut de votre rendez-vous: <strong>confirmé.</strong></p>
                    </td>
                </tr>
            </table>
            ${footer}
        `
    return template
}
const confirmUserAppointmentCancelled = (userName) => {
    const template = `
        ${header}
        <body>
            <table border="0" style="margin:auto;padding:20px;width:100%; max-width:600px">

                <tr>
                    <td>
                        <h1 style="text-align: center;"><span style="color: #ffcc00;">AVO</span>Consulte</h1>
                        <br>
                        <br>
                        <p><strong>Bonjour ${userName},</strong></p>


                        <p>Vous avez pris un rendez-vous avec AvoConsute,<br />le statut de votre demande : <strong>annulé.</strong></p>


                        <p><br />Vous pouvez prendre un autre rendez-vous à tout moment.</p>
                        <p><br />Merci d'avoir choisi AVOConsulte.</p>
                    </td>
                </tr>
            </table>
            ${footer}
        `
    return template
}
const confirmLawyerAppointmentCancelled = (lawyerName) => {
    const template = `
        ${header}
        <body>
            <table border="0" style="margin:auto;padding:20px;width:100%; max-width:600px">

                <tr>
                    <td>
                        <h1 style="text-align: center;"><span style="color: #ffcc00;">AVO</span>Consulte</h1>
                        <br>
                        <br>
                        <p><strong>Bonjour ${lawyerName},</strong></p>


                        <p>Vous avez un rendez-vous avec AvoConsute,<br />le statut de votre rendez-vous: <strong>annulé.</strong></p>
                    </td>
                </tr>
            </table>
            ${footer}
        `
    return template
}

const contactUser = (userName, message) => {
    const template = `
        ${header}
        <body>
            <table border="0" style="margin:auto;padding:20px;width:100%; max-width:600px">

                <tr>
                    <td>
                        <h1 style="text-align: center;"><span style="color: #ffcc00;">AVO</span>Consulte</h1>
                        <br>
                        <br>
                        <p><strong>Bonjour ${userName},</strong></p>


                        <p>Nous avons reçu votre demande de contact.</p>
                        <p>Nous vous contacterons dans les plus brefs délais.</p>
                        <p>Votre message: ${message}</p>
                    </td>
                </tr>
            </table>
            ${footer}
        `
    return template
}
const contactAdmin = (userName, message) => {
    const template = `
        ${header}
        <body>
            <table border="0" style="margin:auto;padding:20px;width:100%; max-width:600px">

                <tr>
                    <td>
                        <h1 style="text-align: center;"><span style="color: #ffcc00;">AVO</span>Consulte</h1>
                        <br>
                        <br>
                        <p><strong>Bonjour cher Admin,</strong></p>


                        <p>Vous avez reçue une demande de contact de la part de ${userName}</p>
                        <p>message du client: ${message}</p>
                    </td>
                </tr>
            </table>
            ${footer}
        `
    return template
}
const lawyerAccountRequestRecievedUser = (userName) => {
    const template = `
        ${header}
        <body>
            <table border="0" style="margin:auto;padding:20px;width:100%; max-width:600px">

                <tr>
                    <td>
                        <h1 style="text-align: center;"><span style="color: #ffcc00;">AVO</span>Consulte</h1>
                        <br>
                        <br>
                        <p><strong>Bonjour ${userName},</strong></p>
                        <p>Vous Nous sommes heureux de vous informer que votre demande de compte d'avocat a été reçue. Notre équipe examinera votre demande et vous communiquera la suite de la procédure.</p>
                        <p>Dans l'intervalle, n'hésitez pas à nous poser toute question via la page "Contactez-nous". </p>
                        <br>
                        <p>Meilleures salutations </p>
                        <p>Avoconsulte Team</p>
                       <br>
                    </td>
                </tr>
            </table>
            ${footer}
        `
    return template
}
const lawyerAccountRequestRecievedAdmin = (userName) => {
    const template = `
        ${header}
        <body>
            <table border="0" style="margin:auto;padding:20px;width:100%; max-width:600px">

                <tr>
                    <td>
                        <h1 style="text-align: center;"><span style="color: #ffcc00;">AVO</span>Consulte</h1>
                        <br>
                        <br>
                        <p><strong>Bonjour Admin,</strong></p>


                        <p>Vous avez reçu une demande de compte d'avocat de la part de ${userName}, veuillez la vérifier.</p>
                        <br>
                        <p>Meilleures salutations </p>
                        <p>Avoconsulte Team</p>
                        <br>
                    </td>
                </tr>
            </table>
            ${footer}
        `
    return template
}

exports.getForgotPasswordTemplate = (userName, passwordResetCode) => {
    const template = `
        ${header}
        <body>
            <table border="0" style="margin:auto;padding:20px;width:100%; max-width:600px">
                <tr>
                    <td>
                        <h1 style="text-align: center;"><span style="color: #ffcc00;">AVO</span>Consulte</h1>
                        <br>
                        <br>
                        <p><strong>Bonjour ${userName},</strong></p>
                        <p>En pièce jointe à cet e-mail, vous trouverez un code secret de réinitialisation de votre mot de passe: </p>
                        <br>
                        <strong>Code: ${passwordResetCode}</strong>
                        <br>
                        <p>Meilleures salutations </p>
                        <p>Avoconsulte Team</p>
                        <br>
                    </td>
                </tr>
            </table>
            ${footer}
        `
    return template
}

// confirm email template
exports.getConfirmEmailTemplate = (userName, link) => {
    const template = `
        ${header}
        <body>
            <table border="0" style="margin:auto;padding:20px;width:100%; max-width:600px">

                <tr>
                    <td>
                        <h1 style="text-align: center;"><span style="color: #ffcc00;">AVO</span>Consulte</h1>
                        <br>
                        <br>
                        <p><strong>Bonjour ${userName},</strong></p>


                        <p>merci de vous inscrire à avoconsulte, vous êtes à un pas de votre compte personnel avoconsulte. Veuillez cliquer sur l'email suivant pour vérifier votre compte:</p>
                        <br>
                        <br>
                        <center><a style="text-decoration:none; border: 0; padding: 10px 15px 10px 15px; background-color:#222222;border-radius:50px;color:#fff;" href="${link}">confirmer votre compte</a></center>
                        <br>
                        <p>Meilleures salutations </p>
                        <p>Avoconsulte Team</p>
                        <br>
                    </td>
                </tr>
            </table>
            ${footer}
        `
    return template
}
exports.getAppointmentEmailTemplate = (to, status, userName = 'client', lawyerName = 'avocat', link = 'https://avoconsulte.com') => {
    if (to === 'lawyer') {
        if (status === 'pending') {
            return confirmLawyerAppointmentPending(lawyerName, link)
        }
        if (status === 'confirmed') {
            return confirmLawyerAppointmentConfirmed(lawyerName)
        }
        if (status === 'cancelled') {
            return confirmLawyerAppointmentCancelled(lawyerName)
        }
    }
    if (to === 'user') {
        if (status === 'pending') {
            return confirmUserAppointmentPending(userName, lawyerName)
        }
        if (status === 'confirmed') {
            return confirmUserAppointmentConfirmed(userName)
        }
        if (status === 'cancelled') {
            return confirmUserAppointmentCancelled(userName)
        }
    }
    return ''
}

exports.getBusinessAccountRequestRecievedTemplate = (to, userName) => {
    if (to === 'lawyer-account-request-user') {
        return lawyerAccountRequestRecievedUser(userName)
    }
    if (to === 'lawyer-account-request-admin') {
        return lawyerAccountRequestRecievedAdmin(userName)
    }
    return ''
}

exports.getContactUserEmailTemplate = (to, userName, message) => {
    if (to === 'contact-user') {
        return contactUser(userName, message)
    }
    if (to === 'contact-admin') {
        return contactAdmin(userName, message)
    }
    return ''
}