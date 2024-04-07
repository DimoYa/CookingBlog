import Base from "./base-model";

interface UserModel extends Base {
    fullname: string,
    username: string,
    password: string,
    phoneCode?: string,
    phoneNumber?: string,
    photo?: string
}
export default UserModel;