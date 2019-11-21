export class User
{
    email: string;
    password: string;
    
    /**
     * Constructor
     *
     * @param user
     */
    constructor(user)
    {
        {
            this.email =  user.email;
            this.password = user.password;
        }
    }
}
