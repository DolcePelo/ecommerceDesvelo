export default class ContactDTO {
    constructor(user){
        this.first_name = user.first_name + " " + user.last_name;
        this.email = user.email;
    }
} 
//con el DTO elijo como quiero que llegue la información y retengo info sencible
//agregarlo al post de user en route